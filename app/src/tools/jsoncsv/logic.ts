function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"'
  }
  return value
}

export function jsonToCsv(jsonString: string): string {
  const data = JSON.parse(jsonString)
  if (!Array.isArray(data)) throw new Error('Input must be a JSON array of objects')

  const headers: string[] = []
  for (const row of data) {
    for (const key of Object.keys(row)) {
      if (!headers.includes(key)) headers.push(key)
    }
  }

  const lines = [headers.join(',')]
  for (const row of data) {
    lines.push(
      headers
        .map((h) => csvEscape(row[h] !== undefined && row[h] !== null ? String(row[h]) : ''))
        .join(','),
    )
  }
  return lines.join('\n')
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  while (i < csv.length) {
    const ch = csv[i]
    if (inQuotes) {
      if (ch === '"') {
        if (csv[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += ch
      i++
      continue
    }
    if (ch === '"') {
      inQuotes = true
      i++
      continue
    }
    if (ch === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i++
      continue
    }
    if (ch === '\r') {
      i++
      continue
    }
    field += ch
    i++
  }
  row.push(field)
  rows.push(row)
  return rows
}

export function csvToJson(csv: string): Record<string, string>[] {
  const rows = parseCsvRows(csv).filter((r) => !(r.length === 1 && r[0] === ''))
  const [header, ...dataRows] = rows
  if (!header) return []
  return dataRows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])))
}
