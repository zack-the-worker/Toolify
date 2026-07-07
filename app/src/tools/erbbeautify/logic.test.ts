import { describe, it, expect } from 'vitest'
import { beautifyErb, minifyErb } from './logic'

describe('beautifyErb', () => {
  it('indents nested HTML while preserving ERB tags verbatim', () => {
    const out = beautifyErb('<div><% if true %><p>hi</p><% end %></div>')
    expect(out).toContain('<% if true %>')
    expect(out).toContain('<% end %>')
    expect(out).toContain('<p>hi</p>')
  })

  it('preserves ERB output tags with embedded Ruby expressions', () => {
    const out = beautifyErb('<p><%= user.name %></p>')
    expect(out).toContain('<%= user.name %>')
  })
})

describe('minifyErb', () => {
  it('strips whitespace between tags while keeping ERB tags intact', () => {
    expect(minifyErb('<div>\n  <%= name %>\n</div>')).toBe('<div><%= name %></div>')
  })
})
