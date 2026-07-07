function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function jsonToTypeScript(jsonString: string, rootName = 'Root'): string {
  const value = JSON.parse(jsonString)
  const output: string[] = []

  function resolveType(val: unknown, nameHint: string): string {
    if (val === null || val === undefined) return 'unknown'
    if (Array.isArray(val)) {
      if (val.length === 0) return 'unknown[]'
      return `${resolveType(val[0], nameHint + 'Item')}[]`
    }
    if (typeof val === 'object') {
      buildInterface(val as Record<string, unknown>, nameHint)
      return nameHint
    }
    if (typeof val === 'string') return 'string'
    if (typeof val === 'number') return 'number'
    if (typeof val === 'boolean') return 'boolean'
    return 'unknown'
  }

  function buildInterface(obj: Record<string, unknown>, name: string) {
    const props = Object.entries(obj).map(([key, val]) => `  ${key}: ${resolveType(val, name + capitalize(key))};`)
    output.push(`interface ${name} {\n${props.join('\n')}\n}`)
  }

  buildInterface(value, rootName)
  return output.join('\n\n')
}
