import { describe, it, expect } from 'vitest'
import { generateLoremIpsum } from './logic'

describe('generateLoremIpsum', () => {
  it('generates the requested number of words', () => {
    const text = generateLoremIpsum({ unit: 'words', count: 10 })
    expect(text.trim().split(/\s+/)).toHaveLength(10)
  })

  it('generates the requested number of sentences', () => {
    const text = generateLoremIpsum({ unit: 'sentences', count: 3 })
    const sentences = text.split('.').map((s) => s.trim()).filter(Boolean)
    expect(sentences).toHaveLength(3)
  })

  it('generates the requested number of paragraphs separated by blank lines', () => {
    const text = generateLoremIpsum({ unit: 'paragraphs', count: 2 })
    expect(text.split('\n\n')).toHaveLength(2)
  })

  it('starts with "Lorem ipsum" when startWithLorem is true', () => {
    const text = generateLoremIpsum({ unit: 'words', count: 5, startWithLorem: true })
    expect(text.toLowerCase().startsWith('lorem ipsum')).toBe(true)
  })
})
