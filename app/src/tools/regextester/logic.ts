export interface RegexMatch {
  match: string
  index: number
  groups: string[]
  namedGroups: Record<string, string>
}

export interface RegexTestResult {
  matches: RegexMatch[]
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  const effectiveFlags = flags.includes('g') ? flags : flags + 'g'
  let re: RegExp
  try {
    re = new RegExp(pattern, effectiveFlags)
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e))
  }

  const matches: RegexMatch[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    matches.push({
      match: m[0],
      index: m.index,
      groups: m.slice(1),
      namedGroups: m.groups ? { ...m.groups } : {},
    })
    if (m[0] === '') re.lastIndex++
  }
  return { matches }
}
