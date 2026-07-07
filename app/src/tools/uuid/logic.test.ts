import { describe, it, expect } from 'vitest'
import { generateUuidV4, decodeUuid, generateUlid, decodeUlid } from './logic'

describe('generateUuidV4', () => {
  it('produces a valid v4 UUID shape', () => {
    const id = generateUuidV4()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('produces distinct values across calls', () => {
    expect(generateUuidV4()).not.toBe(generateUuidV4())
  })
})

describe('decodeUuid', () => {
  it('reports version and variant', () => {
    const info = decodeUuid('550e8400-e29b-41d4-a716-446655440000')
    expect(info.version).toBe(4)
    expect(info.variant).toBe('RFC 4122')
  })

  it('throws on malformed input', () => {
    expect(() => decodeUuid('not-a-uuid')).toThrow()
  })
})

describe('generateUlid', () => {
  it('produces a 26-character Crockford base32 string', () => {
    const id = generateUlid()
    expect(id).toHaveLength(26)
    expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/)
  })
})

describe('decodeUlid', () => {
  it('extracts the embedded timestamp', () => {
    // A ULID generated at a known time: 2021-01-01T00:00:00.000Z = 1609459200000 ms
    const id = ulidFromParts(1609459200000, '0000000000000000'.slice(0, 16))
    const info = decodeUlid(id)
    expect(info.timestamp).toBe(1609459200000)
    expect(info.date.toISOString()).toBe('2021-01-01T00:00:00.000Z')
  })

  it('throws on malformed input', () => {
    expect(() => decodeUlid('too-short')).toThrow()
  })
})

// Test-only helper to build a ULID string from a known timestamp + fixed
// randomness, so we can assert exact timestamp decoding.
function ulidFromParts(timeMs: number, randomness16chars: string): string {
  const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
  let time = timeMs
  let timeChars = ''
  for (let i = 0; i < 10; i++) {
    timeChars = ALPHABET[time % 32] + timeChars
    time = Math.floor(time / 32)
  }
  return timeChars + randomness16chars.padEnd(16, '0')
}
