export function phpSerialize(value: unknown): string {
  if (value === null || value === undefined) return 'N;'
  if (typeof value === 'boolean') return `b:${value ? 1 : 0};`
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `i:${value};` : `d:${value};`
  }
  if (typeof value === 'string') {
    const byteLength = new TextEncoder().encode(value).length
    return `s:${byteLength}:"${value}";`
  }
  if (Array.isArray(value)) {
    const entries = value.map((v, i) => phpSerialize(i) + phpSerialize(v)).join('')
    return `a:${value.length}:{${entries}}`
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value as Record<string, unknown>)
    const entries = keys
      .map((k) => phpSerialize(k) + phpSerialize((value as Record<string, unknown>)[k]))
      .join('')
    return `a:${keys.length}:{${entries}}`
  }
  throw new Error(`Cannot serialize value of type ${typeof value}`)
}

class Cursor {
  pos = 0
  input: string
  constructor(input: string) {
    this.input = input
  }
  peek(n = 1) {
    return this.input.slice(this.pos, this.pos + n)
  }
  expect(str: string) {
    if (this.peek(str.length) !== str) {
      throw new Error(`Expected '${str}' at position ${this.pos}, got '${this.peek(str.length)}'`)
    }
    this.pos += str.length
  }
  readUntil(char: string): string {
    const idx = this.input.indexOf(char, this.pos)
    if (idx === -1) throw new Error(`Expected '${char}' after position ${this.pos}`)
    const result = this.input.slice(this.pos, idx)
    this.pos = idx
    return result
  }
}

function arrayEntriesToValue(entries: [unknown, unknown][]): unknown {
  const isList = entries.every(([k], i) => k === i)
  if (isList) return entries.map(([, v]) => v)
  const obj: Record<string, unknown> = {}
  for (const [k, v] of entries) obj[String(k)] = v
  return obj
}

function parseValue(c: Cursor): unknown {
  const type = c.peek(1)
  switch (type) {
    case 'N': {
      c.expect('N;')
      return null
    }
    case 'b': {
      c.expect('b:')
      const v = c.readUntil(';')
      c.expect(';')
      return v === '1'
    }
    case 'i': {
      c.expect('i:')
      const v = c.readUntil(';')
      c.expect(';')
      return parseInt(v, 10)
    }
    case 'd': {
      c.expect('d:')
      const v = c.readUntil(';')
      c.expect(';')
      return parseFloat(v)
    }
    case 's': {
      c.expect('s:')
      const lenStr = c.readUntil(':')
      c.expect(':')
      const byteLen = parseInt(lenStr, 10)
      c.expect('"')
      // Walk by UTF-8 byte length, not JS string length, to match PHP's semantics.
      const bytes = new TextEncoder().encode(c.input.slice(c.pos))
      const strBytes = bytes.slice(0, byteLen)
      const str = new TextDecoder().decode(strBytes)
      c.pos += str.length
      c.expect('"')
      c.expect(';')
      return str
    }
    case 'a': {
      c.expect('a:')
      const countStr = c.readUntil(':')
      c.expect(':')
      const count = parseInt(countStr, 10)
      c.expect('{')
      const entries: [unknown, unknown][] = []
      for (let i = 0; i < count; i++) {
        const key = parseValue(c)
        const val = parseValue(c)
        entries.push([key, val])
      }
      c.expect('}')
      return arrayEntriesToValue(entries)
    }
    default:
      throw new Error(`Unsupported or malformed PHP-serialized type marker '${type}' at position ${c.pos}`)
  }
}

export function phpUnserialize(input: string): unknown {
  const c = new Cursor(input.trim())
  const result = parseValue(c)
  return result
}
