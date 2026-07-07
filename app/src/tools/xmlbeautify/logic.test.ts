import { describe, it, expect } from 'vitest'
import { beautifyXml, minifyXml } from './logic'

describe('beautifyXml', () => {
  it('indents nested elements', () => {
    expect(beautifyXml('<root><child>text</child></root>')).toBe('<root>\n  <child>text</child>\n</root>')
  })

  it('handles self-closing tags', () => {
    expect(beautifyXml('<root><item/></root>')).toBe('<root>\n  <item/>\n</root>')
  })

  it('keeps the XML declaration on its own line', () => {
    const out = beautifyXml('<?xml version="1.0"?><root><a>1</a></root>')
    expect(out).toBe('<?xml version="1.0"?>\n<root>\n  <a>1</a>\n</root>')
  })
})

describe('minifyXml', () => {
  it('strips whitespace between tags', () => {
    expect(minifyXml('<root>\n  <child>text</child>\n</root>')).toBe('<root><child>text</child></root>')
  })
})
