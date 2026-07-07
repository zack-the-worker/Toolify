import { html as beautifyHtmlLib } from 'js-beautify'

export function beautifyHtml(input: string, indentSize = 4): string {
  return beautifyHtmlLib(input, { indent_size: indentSize, wrap_line_length: 0 })
}

export function minifyHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .trim()
}
