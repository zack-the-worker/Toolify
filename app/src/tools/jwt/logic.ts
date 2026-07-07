function base64UrlDecode(segment: string): Uint8Array {
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(segment.length / 4) * 4, '=')
  const binary = atob(padded)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

function base64UrlDecodeToString(segment: string): string {
  return new TextDecoder().decode(base64UrlDecode(segment))
}

function base64UrlEncode(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('A JWT must have 3 dot-separated segments')
  const [headerSeg, payloadSeg, signature] = parts
  let header: Record<string, unknown>
  let payload: Record<string, unknown>
  try {
    header = JSON.parse(base64UrlDecodeToString(headerSeg))
    payload = JSON.parse(base64UrlDecodeToString(payloadSeg))
  } catch {
    throw new Error('Header or payload is not valid base64url-encoded JSON')
  }
  return { header, payload, signature }
}

export async function verifyHs256(token: string, secret: string): Promise<boolean> {
  const parts = token.trim().split('.')
  if (parts.length !== 3) throw new Error('A JWT must have 3 dot-separated segments')
  const [headerSeg, payloadSeg, signatureSeg] = parts
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${headerSeg}.${payloadSeg}`))
  return base64UrlEncode(signed) === signatureSeg
}
