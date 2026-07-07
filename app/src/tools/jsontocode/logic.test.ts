import { describe, it, expect } from 'vitest'
import { jsonToTypeScript } from './logic'

describe('jsonToTypeScript', () => {
  it('generates an interface for a flat object', () => {
    const ts = jsonToTypeScript('{"name":"Alice","age":30,"active":true}', 'Root')
    expect(ts).toContain('interface Root {')
    expect(ts).toContain('name: string;')
    expect(ts).toContain('age: number;')
    expect(ts).toContain('active: boolean;')
  })

  it('generates nested interfaces for nested objects', () => {
    const ts = jsonToTypeScript('{"user":{"name":"Alice"}}', 'Root')
    expect(ts).toContain('interface Root {')
    expect(ts).toContain('user: RootUser;')
    expect(ts).toContain('interface RootUser {')
    expect(ts).toContain('name: string;')
  })

  it('types arrays using the element type', () => {
    const ts = jsonToTypeScript('{"tags":["a","b"]}', 'Root')
    expect(ts).toContain('tags: string[];')
  })

  it('types arrays of objects with a generated element interface', () => {
    const ts = jsonToTypeScript('{"users":[{"name":"Alice"}]}', 'Root')
    expect(ts).toContain('users: RootUsersItem[];')
    expect(ts).toContain('interface RootUsersItem {')
  })

  it('types null as unknown and empty arrays as unknown[]', () => {
    const ts = jsonToTypeScript('{"a":null,"b":[]}', 'Root')
    expect(ts).toContain('a: unknown;')
    expect(ts).toContain('b: unknown[];')
  })
})
