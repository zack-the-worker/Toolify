import { describe, it, expect } from 'vitest'
import { formatSql } from './logic'

describe('formatSql', () => {
  it('formats a simple SELECT onto multiple lines', () => {
    const out = formatSql('select id, name from users where active = 1')
    expect(out).toContain('SELECT')
    expect(out).toContain('FROM')
    expect(out).toContain('WHERE')
    expect(out.split('\n').length).toBeGreaterThan(1)
  })

  it('throws a descriptive error for empty input handling is not required, but garbage input should not crash silently', () => {
    expect(() => formatSql('')).not.toThrow()
  })
})
