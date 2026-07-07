import { describe, it, expect } from 'vitest'
import { renderMarkdown } from './logic'

describe('renderMarkdown', () => {
  it('renders headers', () => {
    expect(renderMarkdown('# Hello').trim()).toBe('<h1>Hello</h1>')
  })

  it('renders bold and italic', () => {
    const html = renderMarkdown('**bold** and *italic*')
    expect(html).toContain('<strong>bold</strong>')
    expect(html).toContain('<em>italic</em>')
  })

  it('renders unordered lists', () => {
    const html = renderMarkdown('- one\n- two')
    expect(html).toContain('<ul>')
    expect(html).toContain('<li>one</li>')
  })

  it('renders fenced code blocks', () => {
    const html = renderMarkdown('```\nconst x = 1;\n```')
    expect(html).toContain('<pre>')
    expect(html).toContain('const x = 1;')
  })

  it('renders links', () => {
    const html = renderMarkdown('[Toolify](https://example.com)')
    expect(html).toContain('<a href="https://example.com">Toolify</a>')
  })
})
