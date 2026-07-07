import { describe, it, expect } from 'vitest'
import { beautifyScss, minifyScss } from './logic'

describe('beautifyScss', () => {
  it('indents nested SCSS rules', () => {
    const out = beautifyScss('.a{$color:red;.b{color:$color}}')
    expect(out).toContain('.a {')
    expect(out).toContain('    .b {')
  })
})

describe('minifyScss', () => {
  it('strips whitespace and comments while keeping variables intact', () => {
    expect(minifyScss('.a {\n  $color: red; // note\n  color: $color;\n}')).toBe('.a{$color:red;color:$color}')
  })
})
