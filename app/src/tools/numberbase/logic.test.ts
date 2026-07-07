import { describe, it, expect } from 'vitest'
import { convertBase } from './logic'

describe('convertBase', () => {
  it('converts decimal to binary/octal/hex', () => {
    expect(convertBase('255', 10, 2)).toBe('11111111')
    expect(convertBase('255', 10, 8)).toBe('377')
    expect(convertBase('255', 10, 16)).toBe('ff')
  })

  it('converts hex to decimal', () => {
    expect(convertBase('ff', 16, 10)).toBe('255')
  })

  it('converts binary to decimal', () => {
    expect(convertBase('11111111', 2, 10)).toBe('255')
  })

  it('is case-insensitive for hex input', () => {
    expect(convertBase('FF', 16, 10)).toBe('255')
  })

  it('supports arbitrary bases between 2 and 36', () => {
    expect(convertBase('z', 36, 10)).toBe('35')
  })

  it('throws on digits invalid for the given base', () => {
    expect(() => convertBase('129', 2, 10)).toThrow()
  })

  it('throws on empty input', () => {
    expect(() => convertBase('', 10, 2)).toThrow()
  })
})
