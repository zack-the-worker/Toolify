import { describe, it, expect } from 'vitest'
import { diffLines } from './logic'

describe('diffLines', () => {
  it('marks identical lines as unchanged', () => {
    const result = diffLines('a\nb\nc', 'a\nb\nc')
    expect(result.every((l) => l.type === 'unchanged')).toBe(true)
  })

  it('detects an added line', () => {
    const result = diffLines('a\nb', 'a\nb\nc')
    expect(result.at(-1)).toEqual({ type: 'added', text: 'c' })
  })

  it('detects a removed line', () => {
    const result = diffLines('a\nb\nc', 'a\nc')
    expect(result).toContainEqual({ type: 'removed', text: 'b' })
  })

  it('detects a line changed in the middle, preserving context', () => {
    const result = diffLines('a\nb\nc', 'a\nx\nc')
    expect(result).toEqual([
      { type: 'unchanged', text: 'a' },
      { type: 'removed', text: 'b' },
      { type: 'added', text: 'x' },
      { type: 'unchanged', text: 'c' },
    ])
  })

  it('handles empty inputs', () => {
    expect(diffLines('', '')).toEqual([])
    expect(diffLines('a', '')).toEqual([{ type: 'removed', text: 'a' }])
  })
})
