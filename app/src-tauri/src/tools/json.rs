use serde::{Deserialize, Serialize};
use serde_json::Value;

const KIND_OBJECT: u8 = 0;
const KIND_ARRAY: u8 = 1;
const KIND_STRING: u8 = 2;
const KIND_NUMBER: u8 = 3;
const KIND_BOOL: u8 = 4;
const KIND_NULL: u8 = 5;
const KIND_CLOSE: u8 = 6;

// Guards against pathological/adversarial input (e.g. `[[[[...]]]]`) blowing the call stack.
const MAX_DEPTH: u16 = 500;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JsonLine {
    pub depth: u16,
    pub key: Option<String>,
    pub kind: u8,
    pub value: Option<String>,
    pub is_last: bool,
    pub children_count: u32,
    /// Number of descendant lines (including this container's own closing
    /// line). Lets the frontend skip a whole collapsed subtree in O(1)
    /// instead of re-scanning it.
    pub subtree_size: u32,
    pub bracket: Option<char>,
    /// Index (into the flat `lines` array) of this node's enclosing
    /// container, or -1 for the root. Lets the frontend reconstruct a JSON
    /// path for any line on demand (e.g. for a right-click "Copy path")
    /// without paying the cost of storing a full path string on every line.
    pub parent_index: i64,
    /// Position among siblings when the parent is an array (key is None in
    /// that case). Needed to build the `[i]` path segment.
    pub array_index: Option<u32>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FlattenResult {
    pub lines: Vec<JsonLine>,
    pub root_is_container: bool,
    /// Human-readable descriptions of any automatic repairs applied because
    /// the input didn't parse as strict JSON (e.g. addslashes-style escaping,
    /// trailing commas). Empty when the input was valid as-is.
    pub corrections: Vec<String>,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct JsonError {
    pub message: String,
    pub line: usize,
    pub column: usize,
}

impl JsonError {
    fn parse(e: serde_json::Error) -> Self {
        JsonError {
            message: e.to_string(),
            line: e.line(),
            column: e.column(),
        }
    }

    fn other(message: impl Into<String>) -> Self {
        JsonError {
            message: message.into(),
            line: 0,
            column: 0,
        }
    }

    pub fn from_message(message: impl Into<String>) -> Self {
        Self::other(message)
    }
}

#[allow(clippy::too_many_arguments)]
fn flatten_node(
    value: &Value,
    key: Option<String>,
    array_index: Option<u32>,
    depth: u16,
    is_last: bool,
    depth_budget: u16,
    parent_index: i64,
    lines: &mut Vec<JsonLine>,
) {
    if depth_budget == 0 {
        // Depth limit hit: render remainder as an opaque string rather than recursing further.
        lines.push(JsonLine {
            depth,
            key,
            kind: KIND_STRING,
            value: Some("<max nesting depth exceeded>".to_string()),
            is_last,
            children_count: 0,
            subtree_size: 0,
            bracket: None,
            parent_index,
            array_index,
        });
        return;
    }

    match value {
        Value::Object(map) => {
            let self_index = lines.len() as i64;
            lines.push(JsonLine {
                depth,
                key,
                kind: KIND_OBJECT,
                value: None,
                is_last,
                children_count: map.len() as u32,
                subtree_size: 0,
                bracket: None,
                parent_index,
                array_index,
            });
            let start = self_index as usize;
            let n = map.len();
            for (i, (k, v)) in map.iter().enumerate() {
                flatten_node(
                    v,
                    Some(k.clone()),
                    None,
                    depth + 1,
                    i + 1 == n,
                    depth_budget - 1,
                    self_index,
                    lines,
                );
            }
            lines.push(JsonLine {
                depth,
                key: None,
                kind: KIND_CLOSE,
                value: None,
                is_last,
                children_count: 0,
                subtree_size: 0,
                bracket: Some('}'),
                parent_index,
                array_index: None,
            });
            let end = lines.len();
            lines[start].subtree_size = (end - start - 1) as u32;
        }
        Value::Array(arr) => {
            let self_index = lines.len() as i64;
            lines.push(JsonLine {
                depth,
                key,
                kind: KIND_ARRAY,
                value: None,
                is_last,
                children_count: arr.len() as u32,
                subtree_size: 0,
                bracket: None,
                parent_index,
                array_index,
            });
            let start = self_index as usize;
            let n = arr.len();
            for (i, v) in arr.iter().enumerate() {
                flatten_node(
                    v,
                    None,
                    Some(i as u32),
                    depth + 1,
                    i + 1 == n,
                    depth_budget - 1,
                    self_index,
                    lines,
                );
            }
            lines.push(JsonLine {
                depth,
                key: None,
                kind: KIND_CLOSE,
                value: None,
                is_last,
                children_count: 0,
                subtree_size: 0,
                bracket: Some(']'),
                parent_index,
                array_index: None,
            });
            let end = lines.len();
            lines[start].subtree_size = (end - start - 1) as u32;
        }
        Value::String(s) => lines.push(JsonLine {
            depth,
            key,
            kind: KIND_STRING,
            value: Some(s.clone()),
            is_last,
            children_count: 0,
            subtree_size: 0,
            bracket: None,
            parent_index,
            array_index,
        }),
        Value::Number(n) => lines.push(JsonLine {
            depth,
            key,
            kind: KIND_NUMBER,
            value: Some(n.to_string()),
            is_last,
            children_count: 0,
            subtree_size: 0,
            bracket: None,
            parent_index,
            array_index,
        }),
        Value::Bool(b) => lines.push(JsonLine {
            depth,
            key,
            kind: KIND_BOOL,
            value: Some(b.to_string()),
            is_last,
            children_count: 0,
            subtree_size: 0,
            bracket: None,
            parent_index,
            array_index,
        }),
        Value::Null => lines.push(JsonLine {
            depth,
            key,
            kind: KIND_NULL,
            value: None,
            is_last,
            children_count: 0,
            subtree_size: 0,
            bracket: None,
            parent_index,
            array_index,
        }),
    }
}

/// Removes a comma that's immediately followed by (optionally, whitespace
/// and) a closing `]`/`}`, without touching commas inside string literals.
fn strip_trailing_commas(input: &str) -> String {
    let chars: Vec<char> = input.chars().collect();
    let mut out = String::with_capacity(input.len());
    let mut in_string = false;
    let mut escaped = false;
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        if in_string {
            out.push(c);
            if escaped {
                escaped = false;
            } else if c == '\\' {
                escaped = true;
            } else if c == '"' {
                in_string = false;
            }
            i += 1;
            continue;
        }
        if c == '"' {
            in_string = true;
            out.push(c);
            i += 1;
            continue;
        }
        if c == ',' {
            let mut j = i + 1;
            while j < chars.len() && chars[j].is_whitespace() {
                j += 1;
            }
            if j < chars.len() && (chars[j] == ']' || chars[j] == '}') {
                i += 1; // drop the comma
                continue;
            }
        }
        out.push(c);
        i += 1;
    }
    out
}

/// Best-effort recovery for JSON that failed strict parsing, covering the
/// two most common ways hand-copied JSON gets mangled: PHP addslashes()
/// style `\"` escaping applied to the whole document, and trailing commas.
/// Returns the parsed value plus a human-readable list of what was fixed,
/// or None if no combination of fixes produces valid JSON.
fn try_lenient_fixes(input: &str) -> Option<(Value, Vec<String>)> {
    const ADDSLASHES_MSG: &str = "Removed backslash-escaped quotes (looks like addslashes() was applied)";
    const TRAILING_COMMA_MSG: &str = "Removed trailing comma(s) before ] or }";

    let unescaped = input.replace("\\\"", "\"");
    let addslashes_changed = unescaped != input;

    // Try: addslashes fix alone.
    if addslashes_changed {
        if let Ok(v) = serde_json::from_str::<Value>(&unescaped) {
            return Some((v, vec![ADDSLASHES_MSG.to_string()]));
        }
    }

    // Try: trailing-comma fix alone.
    let no_trailing = strip_trailing_commas(input);
    if no_trailing != input {
        if let Ok(v) = serde_json::from_str::<Value>(&no_trailing) {
            return Some((v, vec![TRAILING_COMMA_MSG.to_string()]));
        }
    }

    // Try: both together.
    if addslashes_changed {
        let combined = strip_trailing_commas(&unescaped);
        if combined != input {
            if let Ok(v) = serde_json::from_str::<Value>(&combined) {
                return Some((v, vec![ADDSLASHES_MSG.to_string(), TRAILING_COMMA_MSG.to_string()]));
            }
        }
    }

    None
}

fn parse_lenient(input: &str) -> Result<(Value, Vec<String>), JsonError> {
    match serde_json::from_str::<Value>(input) {
        Ok(v) => Ok((v, Vec::new())),
        Err(e) => try_lenient_fixes(input).ok_or_else(|| JsonError::parse(e)),
    }
}

#[tauri::command]
pub fn json_parse_flatten(input: String) -> Result<FlattenResult, JsonError> {
    let (value, corrections) = parse_lenient(&input)?;
    let root_is_container = value.is_object() || value.is_array();
    let mut lines = Vec::new();
    flatten_node(&value, None, None, 0, true, MAX_DEPTH, -1, &mut lines);
    Ok(FlattenResult {
        lines,
        root_is_container,
        corrections,
    })
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FormatResult {
    pub text: String,
    pub corrections: Vec<String>,
}

#[tauri::command]
pub fn json_format(input: String, indent: usize, minify: bool) -> Result<FormatResult, JsonError> {
    let (value, corrections) = parse_lenient(&input)?;
    let text = if minify {
        serde_json::to_string(&value).unwrap()
    } else {
        let indent_str = " ".repeat(indent.clamp(1, 8));
        let formatter = serde_json::ser::PrettyFormatter::with_indent(indent_str.as_bytes());
        let mut buf = Vec::new();
        let mut ser = serde_json::Serializer::with_formatter(&mut buf, formatter);
        serde::Serialize::serialize(&value, &mut ser).unwrap();
        String::from_utf8(buf).unwrap()
    };
    Ok(FormatResult { text, corrections })
}

#[tauri::command]
pub fn json_validate(input: String) -> Result<bool, JsonError> {
    serde_json::from_str::<Value>(&input)
        .map(|_| true)
        .map_err(JsonError::parse)
}

/// One step of a concrete (non-wildcard) path, as reconstructed by the
/// frontend from a tree line's ancestor chain (see `useJsonTree.buildPath`).
#[derive(Deserialize, Debug)]
#[serde(untagged)]
pub enum PathPart {
    Key(String),
    Index(usize),
}

#[tauri::command]
pub fn json_get_subtree(input: String, path: Vec<PathPart>) -> Result<String, JsonError> {
    let value: Value = serde_json::from_str(&input).map_err(JsonError::parse)?;
    let mut current = &value;
    for part in &path {
        current = match (part, current) {
            (PathPart::Key(k), Value::Object(map)) => map
                .get(k)
                .ok_or_else(|| JsonError::other(format!("key '{k}' not found")))?,
            (PathPart::Index(i), Value::Array(arr)) => arr
                .get(*i)
                .ok_or_else(|| JsonError::other(format!("index {i} out of bounds")))?,
            _ => return Err(JsonError::other("path does not match document shape")),
        };
    }
    serde_json::to_string_pretty(current).map_err(JsonError::parse)
}

// --- Minimal JSONPath subset -------------------------------------------
// Supports: leading `$`, `.key`, `['key']`/`["key"]`, `[index]`, `[*]`
// (array wildcard) and `.*` (object wildcard). Enough to cover common
// "peek at this shape" queries; not a full JSONPath implementation.

enum QueryToken {
    Key(String),
    Index(usize),
    WildcardArray,
    WildcardObject,
}

fn parse_json_path(path: &str) -> Result<Vec<QueryToken>, JsonError> {
    let mut tokens = Vec::new();
    let chars: Vec<char> = path.trim().chars().collect();
    let mut i = 0;
    if chars.first() == Some(&'$') {
        i += 1;
    }
    while i < chars.len() {
        match chars[i] {
            '.' => {
                i += 1;
                if chars.get(i) == Some(&'*') {
                    tokens.push(QueryToken::WildcardObject);
                    i += 1;
                } else {
                    let start = i;
                    while i < chars.len() && chars[i] != '.' && chars[i] != '[' {
                        i += 1;
                    }
                    if i == start {
                        return Err(JsonError::other("expected a key after '.'"));
                    }
                    tokens.push(QueryToken::Key(chars[start..i].iter().collect()));
                }
            }
            '[' => {
                i += 1;
                if chars.get(i) == Some(&'*') {
                    tokens.push(QueryToken::WildcardArray);
                    i += 1;
                } else if chars.get(i) == Some(&'\'') || chars.get(i) == Some(&'"') {
                    let quote = chars[i];
                    i += 1;
                    let start = i;
                    while i < chars.len() && chars[i] != quote {
                        i += 1;
                    }
                    tokens.push(QueryToken::Key(chars[start..i].iter().collect()));
                    i += 1; // closing quote
                } else {
                    let start = i;
                    while i < chars.len() && chars[i] != ']' {
                        i += 1;
                    }
                    let idx_str: String = chars[start..i].iter().collect();
                    let idx = idx_str
                        .parse::<usize>()
                        .map_err(|_| JsonError::other(format!("invalid index '{idx_str}'")))?;
                    tokens.push(QueryToken::Index(idx));
                }
                if chars.get(i) == Some(&']') {
                    i += 1;
                } else {
                    return Err(JsonError::other("unterminated '['"));
                }
            }
            _ => return Err(JsonError::other(format!("unexpected character '{}'", chars[i]))),
        }
    }
    Ok(tokens)
}

fn eval_tokens<'a>(value: &'a Value, tokens: &[QueryToken], out: &mut Vec<&'a Value>) {
    if tokens.is_empty() {
        out.push(value);
        return;
    }
    let (head, rest) = (&tokens[0], &tokens[1..]);
    match head {
        QueryToken::Key(k) => {
            if let Value::Object(map) = value {
                if let Some(v) = map.get(k) {
                    eval_tokens(v, rest, out);
                }
            }
        }
        QueryToken::Index(idx) => {
            if let Value::Array(arr) = value {
                if let Some(v) = arr.get(*idx) {
                    eval_tokens(v, rest, out);
                }
            }
        }
        QueryToken::WildcardArray => {
            if let Value::Array(arr) = value {
                for v in arr {
                    eval_tokens(v, rest, out);
                }
            }
        }
        QueryToken::WildcardObject => {
            if let Value::Object(map) = value {
                for v in map.values() {
                    eval_tokens(v, rest, out);
                }
            }
        }
    }
}

#[tauri::command]
pub fn json_query(input: String, path: String) -> Result<String, JsonError> {
    let value: Value = serde_json::from_str(&input).map_err(JsonError::parse)?;
    let tokens = parse_json_path(&path)?;
    let mut matches = Vec::new();
    eval_tokens(&value, &tokens, &mut matches);
    let owned: Vec<Value> = matches.into_iter().cloned().collect();
    serde_json::to_string_pretty(&owned).map_err(JsonError::parse)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn flattens_object_with_array_and_preserves_order() {
        let input = r#"{"b": 1, "a": [1, 2, 3], "c": {"d": null}}"#;
        let result = json_parse_flatten(input.to_string()).unwrap();
        assert!(result.root_is_container);

        // root-open, "b", "a"-open, 1, 2, 3, "a"-close,
        // "c"-open, "d", "c"-close, root-close = 11 lines.
        assert_eq!(result.lines.len(), 11);

        let root = &result.lines[0];
        assert_eq!(root.kind, KIND_OBJECT);
        assert_eq!(root.children_count, 3);
        assert_eq!(root.subtree_size, 10);
        assert_eq!(root.parent_index, -1);

        let b_line = &result.lines[1];
        assert_eq!(b_line.key.as_deref(), Some("b"));
        assert_eq!(b_line.kind, KIND_NUMBER);
        assert_eq!(b_line.value.as_deref(), Some("1"));
        assert!(!b_line.is_last);
        assert_eq!(b_line.parent_index, 0);

        let a_line = &result.lines[2];
        assert_eq!(a_line.key.as_deref(), Some("a"));
        assert_eq!(a_line.kind, KIND_ARRAY);
        assert_eq!(a_line.children_count, 3);
        // array open + 3 items + array close = 4 descendant lines
        assert_eq!(a_line.subtree_size, 4);

        let first_item = &result.lines[3];
        assert_eq!(first_item.parent_index, 2);
        assert_eq!(first_item.array_index, Some(0));

        let array_close = &result.lines[6];
        assert_eq!(array_close.kind, KIND_CLOSE);
        assert_eq!(array_close.bracket, Some(']'));

        let last_line = result.lines.last().unwrap();
        assert_eq!(last_line.kind, KIND_CLOSE);
        assert_eq!(last_line.bracket, Some('}'));
        assert!(last_line.is_last);
    }

    #[test]
    fn collapsing_a_line_skips_exactly_its_subtree() {
        let input = r#"{"a": {"x": 1, "y": 2}, "b": 3}"#;
        let result = json_parse_flatten(input.to_string()).unwrap();
        // root, a-open, x, y, a-close, b, root-close
        assert_eq!(result.lines.len(), 7);

        let a_open_idx = 1;
        let a_line = &result.lines[a_open_idx];
        assert_eq!(a_line.kind, KIND_OBJECT);
        // Skipping from the "a" line should land exactly on "b" (index 5).
        let next_visible = a_open_idx + a_line.subtree_size as usize + 1;
        assert_eq!(next_visible, 5);
        assert_eq!(result.lines[next_visible].key.as_deref(), Some("b"));
    }

    #[test]
    fn reports_line_and_column_on_syntax_error() {
        let err = json_parse_flatten("{\n  \"a\": ,\n}".to_string()).unwrap_err();
        assert_eq!(err.line, 2);
    }

    #[test]
    fn format_pretty_and_minify_preserve_key_order() {
        let input = r#"{"z": 1, "a": 2}"#;
        let pretty = json_format(input.to_string(), 2, false).unwrap().text;
        assert!(pretty.find("\"z\"").unwrap() < pretty.find("\"a\"").unwrap());
        assert!(pretty.contains("\n  \""));

        let minified = json_format(input.to_string(), 2, true).unwrap().text;
        assert_eq!(minified, r#"{"z":1,"a":2}"#);
    }

    #[test]
    fn deeply_nested_input_does_not_overflow_stack() {
        // serde_json itself has a recursion-limit guard and safely errors out
        // on pathological nesting before our own MAX_DEPTH guard is even
        // reached. The point of this test is just that we get a controlled
        // Result back instead of a stack-overflow crash.
        let depth = 5000;
        let input = "[".repeat(depth) + &"]".repeat(depth);
        let _ = json_parse_flatten(input);
    }

    #[test]
    fn get_subtree_returns_nested_object() {
        let input = r#"{"store": {"book": [{"title": "A"}, {"title": "B"}]}}"#;
        let path = vec![
            PathPart::Key("store".into()),
            PathPart::Key("book".into()),
            PathPart::Index(1),
        ];
        let out = json_get_subtree(input.to_string(), path).unwrap();
        assert_eq!(out, "{\n  \"title\": \"B\"\n}");
    }

    #[test]
    fn query_wildcard_array_field() {
        let input = r#"{"store":{"book":[{"author":"Nigel Rees"},{"author":"Evelyn Waugh"}]}}"#;
        let out = json_query(input.to_string(), "$.store.book[*].author".to_string()).unwrap();
        assert_eq!(out, "[\n  \"Nigel Rees\",\n  \"Evelyn Waugh\"\n]");
    }

    #[test]
    fn query_invalid_path_reports_error() {
        let err = json_query("{}".to_string(), "$.[".to_string()).unwrap_err();
        assert!(!err.message.is_empty());
    }

    #[test]
    fn valid_json_has_no_corrections() {
        let result = json_parse_flatten(r#"{"a":1}"#.to_string()).unwrap();
        assert!(result.corrections.is_empty());
    }

    #[test]
    fn repairs_addslashes_style_escaped_quotes() {
        // What you get pasting the output of PHP's addslashes($json) directly.
        let input = r#"{\"name\":\"Alice\",\"age\":30}"#;
        let result = json_parse_flatten(input.to_string()).unwrap();
        assert_eq!(result.lines[1].key.as_deref(), Some("name"));
        assert_eq!(result.lines[1].value.as_deref(), Some("Alice"));
        assert!(result.corrections.iter().any(|c| c.contains("escaped quote")));
    }

    #[test]
    fn repairs_trailing_comma_in_object_and_array() {
        let input = r#"{"a":1,"b":[1,2,3,],}"#;
        let result = json_parse_flatten(input.to_string()).unwrap();
        assert!(result.root_is_container);
        assert!(result.corrections.iter().any(|c| c.contains("trailing comma")));
    }

    #[test]
    fn repairs_combined_addslashes_and_trailing_comma() {
        let input = r#"{\"a\":1,\"b\":2,}"#;
        let result = json_parse_flatten(input.to_string()).unwrap();
        assert_eq!(result.corrections.len(), 2);
    }

    #[test]
    fn unrepairable_input_still_reports_the_original_error() {
        let err = json_parse_flatten("{not json at all".to_string()).unwrap_err();
        assert!(!err.message.is_empty());
    }

    #[test]
    fn trailing_comma_inside_a_string_value_is_not_touched() {
        let input = r#"{"note":"trailing, comma, inside string","ok":true,}"#;
        let result = json_parse_flatten(input.to_string()).unwrap();
        let note_line = result.lines.iter().find(|l| l.key.as_deref() == Some("note")).unwrap();
        assert_eq!(note_line.value.as_deref(), Some("trailing, comma, inside string"));
    }

    #[test]
    fn format_also_applies_lenient_repair() {
        let input = r#"{"a":1,"b":2,}"#;
        let result = json_format(input.to_string(), 2, false).unwrap();
        let reparsed: Value = serde_json::from_str(&result.text).unwrap();
        assert_eq!(reparsed["a"], 1);
        assert_eq!(reparsed["b"], 2);
        assert_eq!(result.corrections.len(), 1);
    }
}
