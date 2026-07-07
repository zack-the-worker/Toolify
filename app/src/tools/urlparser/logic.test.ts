import { describe, it, expect } from 'vitest'
import { parseUrl } from './logic'

describe('parseUrl', () => {
  it('breaks a URL down into its components', () => {
    const info = parseUrl('https://user:pass@example.com:8080/path/to/page?a=1&b=2#section')
    expect(info).toMatchObject({
      protocol: 'https:',
      username: 'user',
      password: 'pass',
      hostname: 'example.com',
      port: '8080',
      pathname: '/path/to/page',
      hash: '#section',
    })
    expect(info.searchParams).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
    ])
  })

  it('handles URLs with no query string or hash', () => {
    const info = parseUrl('http://example.com/foo')
    expect(info.searchParams).toEqual([])
    expect(info.hash).toBe('')
  })

  it('handles repeated query keys', () => {
    const info = parseUrl('http://example.com/?tag=a&tag=b')
    expect(info.searchParams).toEqual([
      { key: 'tag', value: 'a' },
      { key: 'tag', value: 'b' },
    ])
  })

  it('throws on invalid URLs', () => {
    expect(() => parseUrl('not a url')).toThrow()
  })
})
