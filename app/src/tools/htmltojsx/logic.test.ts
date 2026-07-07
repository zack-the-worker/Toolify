import { describe, it, expect } from 'vitest'
import { htmlToJsx } from './logic'

describe('htmlToJsx', () => {
  it('renames class to className', () => {
    expect(htmlToJsx('<div class="box">hi</div>')).toBe('<div className="box">hi</div>')
  })

  it('renames for to htmlFor', () => {
    expect(htmlToJsx('<label for="name">Name</label>')).toBe('<label htmlFor="name">Name</label>')
  })

  it('self-closes void elements', () => {
    expect(htmlToJsx('<img src="a.png">')).toBe('<img src="a.png" />')
    expect(htmlToJsx('<br>')).toBe('<br />')
  })

  it('converts inline style strings to JSX style objects', () => {
    expect(htmlToJsx('<div style="color: red; font-size: 12px;">hi</div>')).toBe(
      "<div style={{color: 'red', fontSize: '12px'}}>hi</div>",
    )
  })

  it('converts onclick-style attributes to camelCase JSX event handlers', () => {
    expect(htmlToJsx('<button onclick="doThing()">Go</button>')).toBe('<button onClick="doThing()">Go</button>')
  })

  it('converts HTML comments to JSX comments', () => {
    expect(htmlToJsx('<!-- note -->')).toBe('{/* note */}')
  })
})
