import { describe, it, expect } from 'vitest'
import { generateRandomString } from './logic'

describe('generateRandomString', () => {
  it('generates a string of the requested length', () => {
    expect(generateRandomString({ length: 16, charset: 'alnum' })).toHaveLength(16)
  })

  it('only uses characters from the numeric charset', () => {
    const s = generateRandomString({ length: 50, charset: 'numeric' })
    expect(s).toMatch(/^[0-9]{50}$/)
  })

  it('only uses characters from the hex charset', () => {
    const s = generateRandomString({ length: 50, charset: 'hex' })
    expect(s).toMatch(/^[0-9a-f]{50}$/)
  })

  it('includes symbols when the symbols charset is requested', () => {
    const s = generateRandomString({ length: 200, charset: 'alnumSymbols' })
    expect(s).toMatch(/[!@#$%^&*]/)
  })

  it('produces different output across calls', () => {
    expect(generateRandomString({ length: 32, charset: 'alnum' })).not.toBe(
      generateRandomString({ length: 32, charset: 'alnum' }),
    )
  })
})
