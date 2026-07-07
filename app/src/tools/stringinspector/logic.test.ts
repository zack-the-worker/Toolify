import { describe, it, expect } from 'vitest'
import { inspectString } from './logic'

describe('inspectString', () => {
  it('counts characters, words, and lines', () => {
    const info = inspectString('hello world\nsecond line')
    expect(info.characters).toBe(23)
    expect(info.words).toBe(4)
    expect(info.lines).toBe(2)
  })

  it('reports UTF-8 byte length distinct from character count for multibyte text', () => {
    const info = inspectString('café')
    expect(info.characters).toBe(4)
    expect(info.bytes).toBe(5)
  })

  it('reports empty-string stats as all zero', () => {
    const info = inspectString('')
    expect(info).toMatchObject({ characters: 0, words: 0, lines: 0, bytes: 0 })
  })

  it('detects leading/trailing whitespace', () => {
    expect(inspectString('  x  ').hasLeadingOrTrailingWhitespace).toBe(true)
    expect(inspectString('x').hasLeadingOrTrailingWhitespace).toBe(false)
  })

  it('computes most frequent character', () => {
    const info = inspectString('aabbbcc')
    expect(info.mostFrequentChar).toEqual({ char: 'b', count: 3 })
  })
})
