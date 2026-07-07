import { css as beautifyCssLib } from 'js-beautify'

export function beautifyCss(input: string, indentSize = 4): string {
  return beautifyCssLib(input, { indent_size: indentSize })
}

export function minifyCss(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\s+/g, ' ')
    .trim()
}
