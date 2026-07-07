import { format, type FormatOptionsWithLanguage } from 'sql-formatter'

export function formatSql(input: string, language: FormatOptionsWithLanguage['language'] = 'sql'): string {
  if (!input.trim()) return ''
  return format(input, { language, keywordCase: 'upper' })
}
