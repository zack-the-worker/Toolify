import { describe, it, expect } from 'vitest'
import { parseCurl, toJavaScriptFetch, toPythonRequests } from './logic'

describe('parseCurl', () => {
  it('parses method, url, headers, and body from a curl command', () => {
    const parsed = parseCurl(
      `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -H "Authorization: Bearer abc" -d '{"name":"Alice"}'`,
    )
    expect(parsed).toEqual({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer abc' },
      body: '{"name":"Alice"}',
    })
  })

  it('defaults to GET when no method or data is given', () => {
    const parsed = parseCurl('curl https://example.com')
    expect(parsed.method).toBe('GET')
    expect(parsed.url).toBe('https://example.com')
  })

  it('infers POST when -d is present without -X', () => {
    const parsed = parseCurl(`curl https://example.com -d 'a=1'`)
    expect(parsed.method).toBe('POST')
  })

  it('throws when no URL can be found', () => {
    expect(() => parseCurl('curl -X GET')).toThrow()
  })
})

describe('toJavaScriptFetch', () => {
  it('generates a fetch call with headers and JSON body', () => {
    const code = toJavaScriptFetch({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"Alice"}',
    })
    expect(code).toContain(`fetch('https://api.example.com/users'`)
    expect(code).toContain(`method: 'POST'`)
    expect(code).toContain(`'Content-Type': 'application/json'`)
    expect(code).toContain(`body: '{"name":"Alice"}'`)
  })
})

describe('toPythonRequests', () => {
  it('generates a requests call with headers and JSON body', () => {
    const code = toPythonRequests({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name":"Alice"}',
    })
    expect(code).toContain(`requests.post(`)
    expect(code).toContain(`"https://api.example.com/users"`)
    expect(code).toContain(`"Content-Type": "application/json"`)
  })
})
