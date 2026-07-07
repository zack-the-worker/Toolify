import { describe, it, expect } from 'vitest'
import { asciiToHex, hexToAscii } from './logic'

describe('asciiToHex', () => {
  it('encodes ASCII text to space-separated hex bytes', () => {
    expect(asciiToHex('AB')).toBe('41 42')
  })

  it('encodes UTF-8 multi-byte characters', () => {
    expect(asciiToHex('é')).toBe('c3 a9')
  })

  it('encodes empty string to empty output', () => {
    expect(asciiToHex('')).toBe('')
  })
})

describe('hexToAscii', () => {
  it('decodes space-separated hex bytes', () => {
    expect(hexToAscii('41 42')).toBe('AB')
  })

  it('decodes hex with no separators', () => {
    expect(hexToAscii('4142')).toBe('AB')
  })

  it('tolerates 0x prefixes and newlines', () => {
    expect(hexToAscii('0x41\n0x42')).toBe('AB')
  })

  it('round-trips with asciiToHex', () => {
    expect(hexToAscii(asciiToHex('Hello, 世界'))).toBe('Hello, 世界')
  })

  it('throws on odd-length hex', () => {
    expect(() => hexToAscii('414')).toThrow()
  })
})
