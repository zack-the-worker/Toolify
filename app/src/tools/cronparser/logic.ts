const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface CronFields {
  minute: Set<number>
  hour: Set<number>
  dom: Set<number>
  month: Set<number>
  dow: Set<number>
  domRaw: string
  dowRaw: string
}

function parseField(field: string, min: number, max: number): Set<number> {
  const set = new Set<number>()
  for (const part of field.split(',')) {
    const m = part.match(/^(\*|\d+-\d+|\d+)(?:\/(\d+))?$/)
    if (!m) throw new Error(`Invalid cron field segment '${part}'`)
    const [, base, stepStr] = m
    const step = stepStr ? Number(stepStr) : 1
    let rangeStart: number
    let rangeEnd: number
    if (base === '*') {
      rangeStart = min
      rangeEnd = max
    } else if (base.includes('-')) {
      const [s, e] = base.split('-').map(Number)
      rangeStart = s
      rangeEnd = e
    } else {
      rangeStart = rangeEnd = Number(base)
    }
    if (rangeStart < min || rangeEnd > max || rangeStart > rangeEnd) {
      throw new Error(`Value out of range in '${part}' (expected ${min}-${max})`)
    }
    for (let v = rangeStart; v <= rangeEnd; v += step) set.add(v % 7 === 7 ? 0 : v)
  }
  return set
}

function parseCron(expr: string): CronFields {
  const fields = expr.trim().split(/\s+/)
  if (fields.length !== 5) {
    throw new Error('Cron expression must have exactly 5 fields: minute hour day-of-month month day-of-week')
  }
  const [minute, hour, dom, month, dow] = fields
  return {
    minute: parseField(minute, 0, 59),
    hour: parseField(hour, 0, 23),
    dom: parseField(dom, 1, 31),
    month: parseField(month, 1, 12),
    dow: parseField(dow, 0, 7),
    domRaw: dom,
    dowRaw: dow,
  }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function describeCron(expr: string): string {
  const fields = expr.trim().split(/\s+/)
  if (fields.length !== 5) {
    throw new Error('Cron expression must have exactly 5 fields: minute hour day-of-month month day-of-week')
  }
  const [min, hour, dom, mon, dow] = fields
  const parsed = parseCron(expr) // validates ranges, throws on bad input

  if (min === '*' && hour === '*') return 'Every minute'

  if (min !== '*' && hour !== '*') {
    const time = `${pad(Number([...parsed.hour][0]))}:${pad(Number([...parsed.minute][0]))}`
    if (dom === '*' && mon === '*' && dow === '*') return `At ${time} every day`
    if (dow !== '*' && dom === '*' && mon === '*') {
      const names = [...parsed.dow].sort((a, b) => a - b).map((d) => DAY_NAMES[d])
      return `At ${time}, only on ${names.join(', ')}`
    }
    if (dom !== '*' && mon === '*' && dow === '*') {
      return `At ${time} on day ${dom} of the month`
    }
  }

  return `At minute ${min} past hour ${hour} on day-of-month ${dom}, month ${mon}, and day-of-week ${dow}`
}

export function nextRunTimes(expr: string, count: number, from: Date = new Date()): Date[] {
  const fields = parseCron(expr)
  const domRestricted = fields.domRaw !== '*'
  const dowRestricted = fields.dowRaw !== '*'

  function matches(date: Date): boolean {
    if (!fields.minute.has(date.getUTCMinutes())) return false
    if (!fields.hour.has(date.getUTCHours())) return false
    if (!fields.month.has(date.getUTCMonth() + 1)) return false
    const domOk = fields.dom.has(date.getUTCDate())
    const dowOk = fields.dow.has(date.getUTCDay())
    if (domRestricted && dowRestricted) return domOk || dowOk
    if (domRestricted) return domOk
    if (dowRestricted) return dowOk
    return true
  }

  const results: Date[] = []
  let candidate = new Date(from.getTime())
  candidate.setUTCSeconds(0, 0)
  candidate = new Date(candidate.getTime() + 60_000)

  const MAX_ITERATIONS = 4 * 366 * 24 * 60
  let iterations = 0
  while (results.length < count) {
    if (iterations++ > MAX_ITERATIONS) throw new Error('No matching run time found within 4 years')
    if (matches(candidate)) results.push(new Date(candidate))
    candidate = new Date(candidate.getTime() + 60_000)
  }
  return results
}
