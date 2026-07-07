import { describe, it, expect } from 'vitest'
import { beautifyCss, minifyCss } from './logic'

describe('beautifyCss', () => {
  it('expands a minified rule onto multiple indented lines', () => {
    // js-beautify preserves whether the source had a trailing semicolon on the last declaration.
    const out = beautifyCss('.a{color:red;background:blue}')
    expect(out).toBe('.a {\n    color: red;\n    background: blue\n}')
  })
})

describe('minifyCss', () => {
  it('strips whitespace and comments', () => {
    expect(minifyCss('.a {\n  color: red; /* comment */\n  background: blue;\n}')).toBe('.a{color:red;background:blue}')
  })

  it('removes the trailing semicolon before a closing brace', () => {
    expect(minifyCss('.a { color: red; }')).toBe('.a{color:red}')
  })

  it('collapses multiple selectors and rules', () => {
    expect(minifyCss('.a, .b {\n  color: red;\n}\n.c {\n  color: blue;\n}')).toBe('.a,.b{color:red}.c{color:blue}')
  })
})
