import { describe, it, expect } from 'vitest'
import { decodeJwt, verifyHs256 } from './logic'

// header {"alg":"HS256","typ":"JWT"}, payload {"sub":"1234567890","name":"John Doe","iat":1516239022}
// signed with secret "your-256-bit-secret" — this is the canonical jwt.io example token.
const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

describe('decodeJwt', () => {
  it('decodes header and payload', () => {
    const decoded = decodeJwt(SAMPLE_JWT)
    expect(decoded.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(decoded.payload).toEqual({ sub: '1234567890', name: 'John Doe', iat: 1516239022 })
  })

  it('exposes the raw signature segment', () => {
    const decoded = decodeJwt(SAMPLE_JWT)
    expect(decoded.signature).toBe('SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  })

  it('throws on a token that is not 3 segments', () => {
    expect(() => decodeJwt('not.a.jwt.token')).toThrow()
    expect(() => decodeJwt('onlyonepart')).toThrow()
  })

  it('throws when a segment is not valid base64url JSON', () => {
    expect(() => decodeJwt('!!!.!!!.!!!')).toThrow()
  })
})

describe('verifyHs256', () => {
  it('confirms a signature made with the correct secret', async () => {
    await expect(verifyHs256(SAMPLE_JWT, 'your-256-bit-secret')).resolves.toBe(true)
  })

  it('rejects a signature made with the wrong secret', async () => {
    await expect(verifyHs256(SAMPLE_JWT, 'wrong-secret')).resolves.toBe(false)
  })
})
