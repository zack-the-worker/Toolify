const ESCAPE_MAP: Record<string, string> = {
  '\\': '\\\\',
  '"': '\\"',
  '\n': '\\n',
  '\t': '\\t',
  '\r': '\\r',
}

const UNESCAPE_MAP: Record<string, string> = {
  '\\': '\\',
  '"': '"',
  n: '\n',
  t: '\t',
  r: '\r',
}

export function escapeBackslash(input: string): string {
  let out = ''
  for (const ch of input) out += ESCAPE_MAP[ch] ?? ch
  return out
}

export function unescapeBackslash(input: string): string {
  let out = ''
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '\\' && i + 1 < input.length) {
      const next = input[i + 1]
      if (next in UNESCAPE_MAP) {
        out += UNESCAPE_MAP[next]
        i++
        continue
      }
    }
    out += input[i]
  }
  return out
}
