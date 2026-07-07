import { describe, it, expect } from 'vitest'
import { md5, sha1, sha256, sha512 } from './logic'

describe('md5', () => {
  it('matches known test vectors', () => {
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e')
    expect(md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72')
  })
})

describe('sha1', () => {
  it('matches known test vectors', async () => {
    expect(await sha1('')).toBe('da39a3ee5e6b4b0d3255bfef95601890afd80709')
    expect(await sha1('abc')).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })
})

describe('sha256', () => {
  it('matches known test vectors', async () => {
    expect(await sha256('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    expect(await sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
})

describe('sha512', () => {
  it('matches a known test vector for "abc"', async () => {
    expect(await sha512('abc')).toBe(
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    )
  })
})
