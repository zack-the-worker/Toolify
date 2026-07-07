export type Charset = 'alnum' | 'numeric' | 'hex' | 'alnumSymbols' | 'alpha'

const CHARSETS: Record<Charset, string> = {
  numeric: '0123456789',
  hex: '0123456789abcdef',
  alpha: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alnum: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  alnumSymbols: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*',
}

export interface RandomStringOptions {
  length: number
  charset: Charset
}

export function generateRandomString({ length, charset }: RandomStringOptions): string {
  const pool = CHARSETS[charset]
  const bytes = new Uint32Array(length)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 0xffffffff)
  }
  let out = ''
  for (let i = 0; i < length; i++) out += pool[bytes[i] % pool.length]
  return out
}
