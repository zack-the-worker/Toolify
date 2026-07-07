import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(input: string): string {
  return marked.parse(input, { async: false }) as string
}
