export type LineMode = 'sortAsc' | 'sortDesc' | 'dedupe' | 'sortDedupe' | 'reverse' | 'removeBlank' | 'shuffle'

export function processLines(input: string, mode: LineMode): string {
  let lines = input.split('\n')

  switch (mode) {
    case 'sortAsc':
      lines = [...lines].sort((a, b) => a.localeCompare(b))
      break
    case 'sortDesc':
      lines = [...lines].sort((a, b) => b.localeCompare(a))
      break
    case 'dedupe':
      lines = [...new Set(lines)]
      break
    case 'sortDedupe':
      lines = [...new Set(lines)].sort((a, b) => a.localeCompare(b))
      break
    case 'reverse':
      lines = [...lines].reverse()
      break
    case 'removeBlank':
      lines = lines.filter((l) => l.trim() !== '')
      break
    case 'shuffle':
      lines = [...lines]
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[lines[i], lines[j]] = [lines[j], lines[i]]
      }
      break
  }

  return lines.join('\n')
}
