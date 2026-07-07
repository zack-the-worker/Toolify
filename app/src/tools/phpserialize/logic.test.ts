import { describe, it, expect } from 'vitest'
import { phpSerialize, phpUnserialize } from './logic'

describe('phpSerialize', () => {
  it('serializes null', () => {
    expect(phpSerialize(null)).toBe('N;')
  })

  it('serializes booleans', () => {
    expect(phpSerialize(true)).toBe('b:1;')
    expect(phpSerialize(false)).toBe('b:0;')
  })

  it('serializes integers and floats', () => {
    expect(phpSerialize(42)).toBe('i:42;')
    expect(phpSerialize(1.5)).toBe('d:1.5;')
  })

  it('serializes strings using byte length', () => {
    expect(phpSerialize('hello')).toBe('s:5:"hello";')
  })

  it('serializes a list as a 0-indexed PHP array', () => {
    expect(phpSerialize(['a', 'b'])).toBe('a:2:{i:0;s:1:"a";i:1;s:1:"b";}')
  })

  it('serializes an object as an associative PHP array', () => {
    expect(phpSerialize({ name: 'Alice', age: 30 })).toBe('a:2:{s:4:"name";s:5:"Alice";s:3:"age";i:30;}')
  })
})

describe('phpUnserialize', () => {
  it('round-trips all supported types', () => {
    const value = { name: 'Alice', tags: ['a', 'b'], age: 30, active: true, note: null }
    expect(phpUnserialize(phpSerialize(value))).toEqual(value)
  })

  it('parses a raw PHP-serialized string', () => {
    expect(phpUnserialize('a:2:{i:0;s:1:"a";i:1;s:1:"b";}')).toEqual(['a', 'b'])
  })

  it('throws on malformed input', () => {
    expect(() => phpUnserialize('garbage')).toThrow()
  })
})
