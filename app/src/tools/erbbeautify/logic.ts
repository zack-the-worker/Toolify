import { beautifyHtml, minifyHtml } from '../htmlbeautify/logic'

// js-beautify's HTML formatter doesn't know about ERB tags (<% %>) and will
// mangle them, so we swap them out for inert placeholders it won't touch,
// then restore the original text afterwards.
const ERB_TAG_RE = /<%[-=]?[\s\S]*?%>/g

function protect(input: string): { protected: string; tags: string[] } {
  const tags: string[] = []
  const result = input.replace(ERB_TAG_RE, (match) => {
    tags.push(match)
    return `__ERB_TAG_${tags.length - 1}__`
  })
  return { protected: result, tags }
}

function restore(input: string, tags: string[]): string {
  return input.replace(/__ERB_TAG_(\d+)__/g, (_, i) => tags[Number(i)])
}

export function beautifyErb(input: string, indentSize = 4): string {
  const { protected: safe, tags } = protect(input)
  return restore(beautifyHtml(safe, indentSize), tags)
}

export function minifyErb(input: string): string {
  const { protected: safe, tags } = protect(input)
  // minifyHtml only collapses whitespace directly between `>` and `<`; our
  // placeholders are plain text, so also strip whitespace hugging them.
  const minified = minifyHtml(safe).replace(/\s*(__ERB_TAG_\d+__)\s*/g, '$1')
  return restore(minified, tags)
}
