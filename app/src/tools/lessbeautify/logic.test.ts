import { describe, it, expect } from 'vitest'
import { beautifyLess, minifyLess } from './logic'

describe('beautifyLess', () => {
  it('indents nested LESS rules', () => {
    const out = beautifyLess('.a{@color:red;.b{color:@color}}')
    expect(out).toContain('.a {')
    expect(out).toContain('    .b {')
  })
})

describe('minifyLess', () => {
  it('strips whitespace and comments while keeping variables intact', () => {
    expect(minifyLess('.a {\n  @color: red; // note\n  color: @color;\n}')).toBe('.a{@color:red;color:@color}')
  })
})
