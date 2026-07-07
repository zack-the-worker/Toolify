import { describe, it, expect } from 'vitest'
import { testRegex } from './logic'

describe('testRegex', () => {
  it('finds all matches with global flag', () => {
    const result = testRegex('\\d+', 'g', 'a1 b22 c333')
    expect(result.matches.map((m) => m.match)).toEqual(['1', '22', '333'])
  })

  it('reports match index', () => {
    const result = testRegex('b+', 'g', 'aabbbcc')
    expect(result.matches[0].index).toBe(2)
  })

  it('captures named and positional groups', () => {
    const result = testRegex('(?<year>\\d{4})-(\\d{2})', '', '2024-05')
    expect(result.matches[0].groups).toEqual(['2024', '05'])
    expect(result.matches[0].namedGroups).toEqual({ year: '2024' })
  })

  it('returns no matches for non-matching input', () => {
    const result = testRegex('xyz', 'g', 'abc')
    expect(result.matches).toEqual([])
  })

  it('throws a descriptive error for invalid patterns', () => {
    expect(() => testRegex('(unterminated', 'g', 'abc')).toThrow()
  })
})
