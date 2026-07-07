const WORD_BANK = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
]

export type LoremUnit = 'words' | 'sentences' | 'paragraphs'

export interface LoremOptions {
  unit: LoremUnit
  count: number
  startWithLorem?: boolean
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function randomWord(): string {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function makeWords(count: number): string[] {
  return Array.from({ length: count }, randomWord)
}

function makeSentence(): string {
  const words = makeWords(randomInt(6, 14))
  return capitalize(words.join(' ')) + '.'
}

function makeParagraph(): string {
  const sentences = Array.from({ length: randomInt(3, 6) }, makeSentence)
  return sentences.join(' ')
}

export function generateLoremIpsum(options: LoremOptions): string {
  const { unit, count, startWithLorem } = options

  if (unit === 'words') {
    const words = startWithLorem && count >= 2 ? ['lorem', 'ipsum', ...makeWords(count - 2)] : makeWords(count)
    words[0] = capitalize(words[0])
    return words.join(' ')
  }

  if (unit === 'sentences') {
    const sentences = Array.from({ length: count }, makeSentence)
    if (startWithLorem && sentences.length > 0) {
      sentences[0] = 'Lorem ipsum ' + sentences[0].replace(/^./, (c) => c.toLowerCase())
    }
    return sentences.join(' ')
  }

  const paragraphs = Array.from({ length: count }, makeParagraph)
  if (startWithLorem && paragraphs.length > 0) {
    paragraphs[0] = 'Lorem ipsum ' + paragraphs[0].replace(/^./, (c) => c.toLowerCase())
  }
  return paragraphs.join('\n\n')
}
