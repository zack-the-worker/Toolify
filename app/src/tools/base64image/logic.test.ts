import { describe, it, expect } from 'vitest'
import { extractBase64FromDataUrl, isLikelyImageDataUrl } from './logic'

describe('extractBase64FromDataUrl', () => {
  it('strips the data URL prefix, leaving only the base64 payload', () => {
    expect(extractBase64FromDataUrl('data:image/png;base64,aGVsbG8=')).toBe('aGVsbG8=')
  })

  it('returns the input unchanged if there is no data URL prefix', () => {
    expect(extractBase64FromDataUrl('aGVsbG8=')).toBe('aGVsbG8=')
  })
})

describe('isLikelyImageDataUrl', () => {
  it('accepts a well-formed image data URL', () => {
    expect(isLikelyImageDataUrl('data:image/png;base64,aGVsbG8=')).toBe(true)
  })

  it('rejects a non-image data URL', () => {
    expect(isLikelyImageDataUrl('data:text/plain;base64,aGVsbG8=')).toBe(false)
  })

  it('rejects plain base64 with no data URL prefix', () => {
    expect(isLikelyImageDataUrl('aGVsbG8=')).toBe(false)
  })
})
