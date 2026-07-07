import { describe, it, expect } from 'vitest'
import { svgToCssBackground } from './logic'

describe('svgToCssBackground', () => {
  it('produces a background-image declaration with a base64 data URI', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
    const css = svgToCssBackground(svg)
    expect(css).toBe(`background-image: url("data:image/svg+xml;base64,${btoa(svg)}");`)
  })

  it('accepts a custom CSS property name', () => {
    const svg = '<svg></svg>'
    const css = svgToCssBackground(svg, 'mask-image')
    expect(css.startsWith('mask-image: url("data:image/svg+xml;base64,')).toBe(true)
  })

  it('throws on empty input', () => {
    expect(() => svgToCssBackground('')).toThrow()
  })
})
