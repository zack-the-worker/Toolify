export interface StringStats {
  characters: number
  words: number
  lines: number
  bytes: number
  hasLeadingOrTrailingWhitespace: boolean
  mostFrequentChar: { char: string; count: number } | null
}

export function inspectString(input: string): StringStats {
  if (input === '') {
    return {
      characters: 0,
      words: 0,
      lines: 0,
      bytes: 0,
      hasLeadingOrTrailingWhitespace: false,
      mostFrequentChar: null,
    }
  }

  const characters = Array.from(input).length
  const words = input.trim().split(/\s+/).filter(Boolean).length
  const lines = input.split('\n').length
  const bytes = new TextEncoder().encode(input).length
  const hasLeadingOrTrailingWhitespace = /^\s|\s$/.test(input)

  const freq = new Map<string, number>()
  for (const ch of input) {
    if (/\s/.test(ch)) continue
    freq.set(ch, (freq.get(ch) ?? 0) + 1)
  }
  let mostFrequentChar: StringStats['mostFrequentChar'] = null
  for (const [char, count] of freq) {
    if (!mostFrequentChar || count > mostFrequentChar.count) mostFrequentChar = { char, count }
  }

  return { characters, words, lines, bytes, hasLeadingOrTrailingWhitespace, mostFrequentChar }
}
