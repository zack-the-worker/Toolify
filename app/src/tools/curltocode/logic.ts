export interface ParsedCurl {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
}

function tokenize(command: string): string[] {
  const tokens: string[] = []
  let current = ''
  let quote: '"' | "'" | null = null
  for (let i = 0; i < command.length; i++) {
    const ch = command[i]
    if (quote) {
      if (ch === quote) {
        quote = null
      } else {
        current += ch
      }
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      continue
    }
    if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += ch
  }
  if (current) tokens.push(current)
  return tokens
}

export function parseCurl(command: string): ParsedCurl {
  const tokens = tokenize(command).filter((t) => t !== 'curl')
  let method: string | undefined
  let url: string | undefined
  const headers: Record<string, string> = {}
  let body: string | undefined

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]
    if (t === '-X' || t === '--request') {
      method = tokens[++i]
    } else if (t === '-H' || t === '--header') {
      const header = tokens[++i]
      const idx = header.indexOf(':')
      if (idx !== -1) headers[header.slice(0, idx).trim()] = header.slice(idx + 1).trim()
    } else if (t === '-d' || t === '--data' || t === '--data-raw') {
      body = tokens[++i]
    } else if (t.startsWith('-')) {
      // Unrecognized flag: skip it (and its value if it looks like one follows).
      continue
    } else if (!url) {
      url = t
    }
  }

  if (!url) throw new Error('Could not find a URL in this curl command')
  if (!method) method = body !== undefined ? 'POST' : 'GET'

  return { method, url, headers, body }
}

export function toJavaScriptFetch(parsed: ParsedCurl): string {
  const lines = [`fetch('${parsed.url}', {`, `  method: '${parsed.method}',`]
  if (Object.keys(parsed.headers).length) {
    lines.push('  headers: {')
    for (const [k, v] of Object.entries(parsed.headers)) lines.push(`    '${k}': '${v}',`)
    lines.push('  },')
  }
  if (parsed.body !== undefined) lines.push(`  body: '${parsed.body}',`)
  lines.push('})')
  return lines.join('\n')
}

export function toPythonRequests(parsed: ParsedCurl): string {
  const lines = ['import requests', '']
  if (Object.keys(parsed.headers).length) {
    lines.push('headers = {')
    for (const [k, v] of Object.entries(parsed.headers)) lines.push(`    "${k}": "${v}",`)
    lines.push('}')
  }
  if (parsed.body !== undefined) lines.push(`data = '${parsed.body}'`)
  const args = [`"${parsed.url}"`]
  if (Object.keys(parsed.headers).length) args.push('headers=headers')
  if (parsed.body !== undefined) args.push('data=data')
  lines.push(`response = requests.${parsed.method.toLowerCase()}(${args.join(', ')})`)
  return lines.join('\n')
}
