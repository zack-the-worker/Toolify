import { describe, it, expect } from 'vitest'
import { beautifyHtml, minifyHtml } from './logic'

describe('beautifyHtml', () => {
  it('indents nested tags', () => {
    const out = beautifyHtml('<div><p>hi</p></div>')
    expect(out).toBe('<div>\n    <p>hi</p>\n</div>')
  })
})

describe('minifyHtml', () => {
  it('strips whitespace between tags', () => {
    expect(minifyHtml('<div>\n  <p>hi</p>\n</div>')).toBe('<div><p>hi</p></div>')
  })

  it('removes HTML comments', () => {
    expect(minifyHtml('<div><!-- comment -->hi</div>')).toBe('<div>hi</div>')
  })

  it('preserves whitespace-significant inline text', () => {
    expect(minifyHtml('<p>hello world</p>')).toBe('<p>hello world</p>')
  })
})
