const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

export function generateUuidV4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  const b = randomBytes(16)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const hex = Array.from(b, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export interface UuidInfo {
  version: number | null
  variant: string
}

export function decodeUuid(input: string): UuidInfo {
  const m = input
    .trim()
    .match(/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i)
  if (!m) throw new Error('Not a valid UUID')
  const version = parseInt(m[3][0], 16)
  const variantNibble = parseInt(m[4][0], 16)
  let variant = 'unknown'
  if ((variantNibble & 0b1000) === 0) variant = 'reserved (NCS)'
  else if ((variantNibble & 0b1100) === 0b1000) variant = 'RFC 4122'
  else if ((variantNibble & 0b1110) === 0b1100) variant = 'reserved (Microsoft)'
  else variant = 'reserved (future)'
  return { version, variant }
}

function encodeUlidTime(timeMs: number): string {
  let time = timeMs
  let chars = ''
  for (let i = 0; i < 10; i++) {
    chars = ULID_ALPHABET[time % 32] + chars
    time = Math.floor(time / 32)
  }
  return chars
}

export function generateUlid(now: number = Date.now()): string {
  const timePart = encodeUlidTime(now)
  const randBytes = randomBytes(10)
  let randomPart = ''
  // Pack 10 bytes (80 bits) into 16 base32 chars (5 bits each).
  let bitBuffer = 0
  let bitCount = 0
  let byteIndex = 0
  while (randomPart.length < 16) {
    if (bitCount < 5) {
      bitBuffer = (bitBuffer << 8) | randBytes[byteIndex++]
      bitCount += 8
    }
    bitCount -= 5
    randomPart += ULID_ALPHABET[(bitBuffer >> bitCount) & 0x1f]
  }
  return timePart + randomPart
}

export interface UlidInfo {
  timestamp: number
  date: Date
}

export function decodeUlid(input: string): UlidInfo {
  const s = input.trim().toUpperCase()
  if (s.length !== 26) throw new Error('ULID must be 26 characters')
  let time = 0
  for (let i = 0; i < 10; i++) {
    const value = ULID_ALPHABET.indexOf(s[i])
    if (value === -1) throw new Error('Invalid ULID character')
    time = time * 32 + value
  }
  return { timestamp: time, date: new Date(time) }
}
