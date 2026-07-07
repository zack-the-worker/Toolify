import { describe, it, expect } from 'vitest'
import { convertCase } from './logic'

const words = 'hello world example'

describe('convertCase', () => {
  it('converts to camelCase', () => {
    expect(convertCase(words, 'camel')).toBe('helloWorldExample')
  })
  it('converts to PascalCase', () => {
    expect(convertCase(words, 'pascal')).toBe('HelloWorldExample')
  })
  it('converts to snake_case', () => {
    expect(convertCase(words, 'snake')).toBe('hello_world_example')
  })
  it('converts to kebab-case', () => {
    expect(convertCase(words, 'kebab')).toBe('hello-world-example')
  })
  it('converts to CONSTANT_CASE', () => {
    expect(convertCase(words, 'constant')).toBe('HELLO_WORLD_EXAMPLE')
  })
  it('converts to Title Case', () => {
    expect(convertCase(words, 'title')).toBe('Hello World Example')
  })
  it('converts to lower case', () => {
    expect(convertCase('Hello World', 'lower')).toBe('hello world')
  })
  it('converts to UPPER CASE', () => {
    expect(convertCase('Hello World', 'upper')).toBe('HELLO WORLD')
  })
  it('tokenizes existing camelCase/PascalCase input on word boundaries', () => {
    expect(convertCase('helloWorldExample', 'snake')).toBe('hello_world_example')
    expect(convertCase('HelloWorldXML', 'kebab')).toBe('hello-world-xml')
  })
  it('tokenizes existing snake_case/kebab-case input', () => {
    expect(convertCase('hello_world-example', 'camel')).toBe('helloWorldExample')
  })
})
