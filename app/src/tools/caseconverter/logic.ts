export type CaseMode = 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'title' | 'lower' | 'upper'

function tokenize(input: string): string[] {
  const s = input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
  return s.split(/\s+/).filter(Boolean).map((w) => w.toLowerCase())
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function convertCase(input: string, mode: CaseMode): string {
  const words = tokenize(input)
  switch (mode) {
    case 'camel':
      return words.map((w, i) => (i === 0 ? w : capitalize(w))).join('')
    case 'pascal':
      return words.map(capitalize).join('')
    case 'snake':
      return words.join('_')
    case 'kebab':
      return words.join('-')
    case 'constant':
      return words.map((w) => w.toUpperCase()).join('_')
    case 'title':
      return words.map(capitalize).join(' ')
    case 'lower':
      return words.join(' ')
    case 'upper':
      return words.join(' ').toUpperCase()
  }
}
