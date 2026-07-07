import { describe, it, expect } from 'vitest'
import { processLines } from './logic'

const input = 'banana\napple\ncherry\napple'

describe('processLines', () => {
  it('sorts ascending', () => {
    expect(processLines(input, 'sortAsc')).toBe('apple\napple\nbanana\ncherry')
  })

  it('sorts descending', () => {
    expect(processLines(input, 'sortDesc')).toBe('cherry\nbanana\napple\napple')
  })

  it('dedupes while preserving order', () => {
    expect(processLines(input, 'dedupe')).toBe('banana\napple\ncherry')
  })

  it('sorts and dedupes', () => {
    expect(processLines(input, 'sortDedupe')).toBe('apple\nbanana\ncherry')
  })

  it('reverses line order', () => {
    expect(processLines(input, 'reverse')).toBe('apple\ncherry\napple\nbanana')
  })

  it('removes blank lines', () => {
    expect(processLines('a\n\nb\n\n\nc', 'removeBlank')).toBe('a\nb\nc')
  })
})
