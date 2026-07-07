function leftRotate(x: number, c: number): number {
  return (x << c) | (x >>> (32 - c))
}

function wordToLittleEndianHex(word: number): string {
  const bytes = [word & 0xff, (word >>> 8) & 0xff, (word >>> 16) & 0xff, (word >>> 24) & 0xff]
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Pure-JS MD5 since the Web Crypto API deliberately doesn't implement it
// (it's cryptographically broken, but still widely needed for checksums).
export function md5(input: string): string {
  const msg = new TextEncoder().encode(input)
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0)
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]

  const bitLen = BigInt(msg.length) * 8n
  const padLen = (56 - (msg.length + 1) % 64 + 64) % 64
  const padded = new Uint8Array(msg.length + 1 + padLen + 8)
  padded.set(msg)
  padded[msg.length] = 0x80
  for (let i = 0; i < 8; i++) {
    padded[padded.length - 8 + i] = Number((bitLen >> BigInt(8 * i)) & 0xffn)
  }

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  for (let chunkStart = 0; chunkStart < padded.length; chunkStart += 64) {
    const M = new Array(16)
    for (let j = 0; j < 16; j++) {
      const o = chunkStart + j * 4
      M[j] = padded[o] | (padded[o + 1] << 8) | (padded[o + 2] << 16) | (padded[o + 3] << 24)
    }
    let [A, B, C, D] = [a0, b0, c0, d0]
    for (let i = 0; i < 64; i++) {
      let F: number
      let g: number
      if (i < 16) {
        F = (B & C) | (~B & D)
        g = i
      } else if (i < 32) {
        F = (D & B) | (~D & C)
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        F = B ^ C ^ D
        g = (3 * i + 5) % 16
      } else {
        F = C ^ (B | ~D)
        g = (7 * i) % 16
      }
      F = (F + A + K[i] + M[g]) | 0
      A = D
      D = C
      C = B
      B = (B + leftRotate(F, S[i])) | 0
    }
    a0 = (a0 + A) | 0
    b0 = (b0 + B) | 0
    c0 = (c0 + C) | 0
    d0 = (d0 + D) | 0
  }

  return [a0, b0, c0, d0].map(wordToLittleEndianHex).join('')
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function webCryptoDigest(algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', input: string): Promise<string> {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(input))
  return bufferToHex(digest)
}

export const sha1 = (input: string) => webCryptoDigest('SHA-1', input)
export const sha256 = (input: string) => webCryptoDigest('SHA-256', input)
export const sha512 = (input: string) => webCryptoDigest('SHA-512', input)
