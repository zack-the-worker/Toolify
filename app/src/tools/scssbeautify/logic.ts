import { css as beautifyCssLib } from 'js-beautify'
import { minifyCss } from '../cssbeautify/logic'

// js-beautify's CSS formatter doesn't understand Sass semantics, but it
// formats braces/indentation the same way regardless — good enough for a
// dev-tool "beautify" without needing a dedicated Sass parser.
export function beautifyScss(input: string, indentSize = 4): string {
  return beautifyCssLib(input, { indent_size: indentSize })
}

export function minifyScss(input: string): string {
  const withoutLineComments = input.replace(/\/\/.*$/gm, '')
  return minifyCss(withoutLineComments)
}
