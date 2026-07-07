use crate::tools::json::JsonError;
use serde_json::Value;

#[tauri::command]
pub fn yaml_to_json(input: String) -> Result<String, JsonError> {
    let value: Value = serde_yaml::from_str(&input)
        .map_err(|e| JsonError::from_message(e.to_string()))?;
    serde_json::to_string_pretty(&value).map_err(|e| JsonError::from_message(e.to_string()))
}

#[tauri::command]
pub fn json_to_yaml(input: String) -> Result<String, JsonError> {
    let value: Value =
        serde_json::from_str(&input).map_err(|e| JsonError::from_message(e.to_string()))?;
    serde_yaml::to_string(&value).map_err(|e| JsonError::from_message(e.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn yaml_to_json_converts_mapping() {
        let yaml = "name: Toolify\ncount: 3\ntags:\n  - a\n  - b\n";
        let json = yaml_to_json(yaml.to_string()).unwrap();
        let parsed: serde_json::Value = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed["name"], "Toolify");
        assert_eq!(parsed["count"], 3);
        assert_eq!(parsed["tags"], serde_json::json!(["a", "b"]));
    }

    #[test]
    fn yaml_to_json_reports_error_on_invalid_yaml() {
        let err = yaml_to_json("key: [unterminated".to_string()).unwrap_err();
        assert!(!err.message.is_empty());
    }

    #[test]
    fn json_to_yaml_converts_object() {
        let json = r#"{"name":"Toolify","count":3,"tags":["a","b"]}"#;
        let yaml = json_to_yaml(json.to_string()).unwrap();
        assert!(yaml.contains("name: Toolify"));
        assert!(yaml.contains("count: 3"));
        assert!(yaml.contains("- a"));
    }

    #[test]
    fn round_trips_json_to_yaml_to_json() {
        let json = r#"{"a":1,"b":[1,2,3],"c":{"d":null}}"#;
        let yaml = json_to_yaml(json.to_string()).unwrap();
        let back = yaml_to_json(yaml).unwrap();
        let original: serde_json::Value = serde_json::from_str(json).unwrap();
        let roundtripped: serde_json::Value = serde_json::from_str(&back).unwrap();
        assert_eq!(original, roundtripped);
    }
}
