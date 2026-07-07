import { js as beautifyJsLib } from 'js-beautify'
import { minify } from 'terser'

export function beautifyJs(input: string, indentSize = 4): string {
  return beautifyJsLib(input, { indent_size: indentSize })
}

export async function minifyJs(input: string): Promise<string> {
  const result = await minify(input)
  if (result.code === undefined) throw new Error('Minification produced no output')
  return result.code
}
