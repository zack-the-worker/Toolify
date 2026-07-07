import { describe, it, expect } from 'vitest'
import { jsonToCsv, csvToJson } from './logic'

describe('jsonToCsv', () => {
  it('converts an array of flat objects to CSV with a header row', () => {
    const json = JSON.stringify([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ])
    expect(jsonToCsv(json)).toBe('name,age\nAlice,30\nBob,25')
  })

  it('quotes fields containing commas, quotes, or newlines', () => {
    const json = JSON.stringify([{ text: 'a,b', quote: 'he said "hi"', multi: 'line1\nline2' }])
    expect(jsonToCsv(json)).toBe('text,quote,multi\n"a,b","he said ""hi""","line1\nline2"')
  })

  it('fills missing keys with empty strings', () => {
    const json = JSON.stringify([{ a: 1, b: 2 }, { a: 3 }])
    expect(jsonToCsv(json)).toBe('a,b\n1,2\n3,')
  })

  it('throws on non-array input', () => {
    expect(() => jsonToCsv('{"a":1}')).toThrow()
  })
})

describe('csvToJson', () => {
  it('parses a header row and data rows into an array of objects', () => {
    const csv = 'name,age\nAlice,30\nBob,25'
    expect(csvToJson(csv)).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ])
  })

  it('handles quoted fields with embedded commas and escaped quotes', () => {
    const csv = 'text,quote\n"a,b","he said ""hi"""'
    expect(csvToJson(csv)).toEqual([{ text: 'a,b', quote: 'he said "hi"' }])
  })

  it('round-trips with jsonToCsv for simple flat data', () => {
    const original = [
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ]
    const csv = jsonToCsv(JSON.stringify(original))
    expect(csvToJson(csv)).toEqual(original)
  })
})
