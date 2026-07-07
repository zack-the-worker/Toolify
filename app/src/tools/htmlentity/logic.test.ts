import { describe, it, expect } from 'vitest'
import { encodeHtmlEntities, decodeHtmlEntities } from './logic'

describe('encodeHtmlEntities', () => {
  it('escapes the 5 reserved XML characters', () => {
    expect(encodeHtmlEntities(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    )
  })

  it('leaves plain text untouched', () => {
    expect(encodeHtmlEntities('hello world')).toBe('hello world')
  })

  it('encodes non-ASCII characters as numeric entities', () => {
    expect(encodeHtmlEntities('café')).toBe('caf&#233;')
  })
})

describe('decodeHtmlEntities', () => {
  it('decodes named entities', () => {
    expect(decodeHtmlEntities('&lt;b&gt;&amp;&lt;/b&gt;')).toBe('<b>&</b>')
  })

  it('decodes decimal numeric entities', () => {
    expect(decodeHtmlEntities('caf&#233;')).toBe('café')
  })

  it('decodes hex numeric entities', () => {
    expect(decodeHtmlEntities('caf&#xe9;')).toBe('café')
  })

  it('round-trips with encode', () => {
    const input = `<tag attr="v">it's & "quoted"</tag>`
    expect(decodeHtmlEntities(encodeHtmlEntities(input))).toBe(input)
  })
})
