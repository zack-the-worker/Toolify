const NAMED_ENCODE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const NAMED_DECODE: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
}

export function encodeHtmlEntities(input: string): string {
  let out = ''
  for (const ch of input) {
    if (NAMED_ENCODE[ch]) {
      out += NAMED_ENCODE[ch]
    } else if (ch.codePointAt(0)! > 127) {
      out += `&#${ch.codePointAt(0)};`
    } else {
      out += ch
    }
  }
  return out
}

export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body.startsWith('#x') || body.startsWith('#X')) {
      return String.fromCodePoint(parseInt(body.slice(2), 16))
    }
    if (body.startsWith('#')) {
      return String.fromCodePoint(parseInt(body.slice(1), 10))
    }
    return body in NAMED_DECODE ? NAMED_DECODE[body] : match
  })
}
