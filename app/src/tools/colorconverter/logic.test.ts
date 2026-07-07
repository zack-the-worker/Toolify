import { describe, it, expect } from 'vitest'
import { parseColor, toHexString, toRgbString } from './logic'

describe('parseColor', () => {
  it('parses 6-digit hex', () => {
    const c = parseColor('#ff8800')
    expect(c).toEqual({ r: 255, g: 136, b: 0, a: 1 })
  })

  it('parses 3-digit hex shorthand', () => {
    const c = parseColor('#f80')
    expect(c).toEqual({ r: 255, g: 136, b: 0, a: 1 })
  })

  it('parses rgb() function syntax', () => {
    expect(parseColor('rgb(255, 136, 0)')).toEqual({ r: 255, g: 136, b: 0, a: 1 })
  })

  it('parses rgba() with alpha', () => {
    expect(parseColor('rgba(255, 136, 0, 0.5)')).toEqual({ r: 255, g: 136, b: 0, a: 0.5 })
  })

  it('parses hsl() function syntax', () => {
    // hue 32 is where rgb(255, 136, 0) actually falls (verified via toHslString below).
    const c = parseColor('hsl(32, 100%, 50%)')!
    expect(c.r).toBe(255)
    expect(c.g).toBeCloseTo(136, 0)
    expect(c.b).toBe(0)
  })

  it('returns null for invalid input', () => {
    expect(parseColor('not-a-color')).toBeNull()
  })

  it('round-trips hex -> rgb -> hex formatting helpers', () => {
    const c = parseColor('#ff8800')!
    expect(toHexString(c)).toBe('#ff8800')
    expect(toRgbString(c)).toBe('rgb(255, 136, 0)')
  })
})
