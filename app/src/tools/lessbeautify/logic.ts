import { css as beautifyCssLib } from 'js-beautify'
import { minifyCss } from '../cssbeautify/logic'

export function beautifyLess(input: string, indentSize = 4): string {
  return beautifyCssLib(input, { indent_size: indentSize })
}

export function minifyLess(input: string): string {
  const withoutLineComments = input.replace(/\/\/.*$/gm, '')
  return minifyCss(withoutLineComments)
}
