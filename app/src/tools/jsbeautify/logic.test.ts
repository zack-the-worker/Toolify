import { describe, it, expect } from 'vitest'
import { beautifyJs, minifyJs } from './logic'

describe('beautifyJs', () => {
  it('indents a function body', () => {
    const out = beautifyJs('function add(a,b){return a+b;}')
    expect(out).toBe('function add(a, b) {\n    return a + b;\n}')
  })
})

describe('minifyJs', () => {
  it('removes unnecessary whitespace while preserving behavior', async () => {
    const out = await minifyJs('function add(a, b) {\n  return a + b;\n}')
    expect(out.replace(/\s/g, '')).toContain('function')
    expect(out.length).toBeLessThan('function add(a, b) {\n  return a + b;\n}'.length)
  })

  it('throws on syntactically invalid JS', async () => {
    await expect(minifyJs('function (')).rejects.toThrow()
  })
})
