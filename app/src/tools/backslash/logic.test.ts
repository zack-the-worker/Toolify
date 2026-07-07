import { describe, it, expect } from 'vitest'
import { escapeBackslash, unescapeBackslash } from './logic'

describe('escapeBackslash', () => {
  it('escapes backslash, quotes, and control characters', () => {
    expect(escapeBackslash('a\\b"c\nd\te\rf')).toBe('a\\\\b\\"c\\nd\\te\\rf')
  })

  it('leaves plain text untouched', () => {
    expect(escapeBackslash('hello world')).toBe('hello world')
  })
})

describe('unescapeBackslash', () => {
  it('reverses escapeBackslash', () => {
    const input = 'a\\b"c\nd\te\rf'
    expect(unescapeBackslash(escapeBackslash(input))).toBe(input)
  })

  it('decodes standard escape sequences', () => {
    expect(unescapeBackslash('a\\\\b\\"c\\nd\\te\\rf')).toBe('a\\b"c\nd\te\rf')
  })

  it('leaves unknown escapes as-is', () => {
    expect(unescapeBackslash('\\q')).toBe('\\q')
  })
})
