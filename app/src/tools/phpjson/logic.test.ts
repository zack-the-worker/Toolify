import { describe, it, expect } from 'vitest'
import { phpToJson, jsonToPhp } from './logic'

describe('phpToJson', () => {
  it('converts a PHP-serialized array to a JSON string', () => {
    const json = phpToJson('a:2:{s:4:"name";s:5:"Alice";s:3:"age";i:30;}')
    expect(JSON.parse(json)).toEqual({ name: 'Alice', age: 30 })
  })
})

describe('jsonToPhp', () => {
  it('converts a JSON string to a PHP-serialized value', () => {
    expect(jsonToPhp('{"name":"Alice","age":30}')).toBe('a:2:{s:4:"name";s:5:"Alice";s:3:"age";i:30;}')
  })

  it('round-trips through phpToJson', () => {
    const json = '{"a":1,"b":[1,2,3]}'
    expect(JSON.parse(phpToJson(jsonToPhp(json)))).toEqual(JSON.parse(json))
  })
})
