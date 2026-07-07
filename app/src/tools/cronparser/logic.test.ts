import { describe, it, expect } from 'vitest'
import { describeCron, nextRunTimes } from './logic'

describe('describeCron', () => {
  it('describes "every minute"', () => {
    expect(describeCron('* * * * *')).toBe('Every minute')
  })

  it('describes a specific time daily', () => {
    expect(describeCron('30 4 * * *')).toBe('At 04:30 every day')
  })

  it('describes a weekly schedule', () => {
    expect(describeCron('0 9 * * 1')).toBe('At 09:00, only on Monday')
  })

  it('throws on malformed expressions', () => {
    expect(() => describeCron('* * *')).toThrow()
    expect(() => describeCron('60 * * * *')).toThrow()
  })
})

describe('nextRunTimes', () => {
  it('computes the next N run times after a given reference date', () => {
    // "0 * * * *" = top of every hour
    const from = new Date('2024-01-01T10:15:00Z')
    const runs = nextRunTimes('0 * * * *', 3, from)
    expect(runs.map((d) => d.toISOString())).toEqual([
      '2024-01-01T11:00:00.000Z',
      '2024-01-01T12:00:00.000Z',
      '2024-01-01T13:00:00.000Z',
    ])
  })

  it('respects day-of-month constraints', () => {
    const from = new Date('2024-01-01T00:00:00Z')
    const runs = nextRunTimes('0 0 15 * *', 2, from)
    expect(runs[0].toISOString()).toBe('2024-01-15T00:00:00.000Z')
    expect(runs[1].toISOString()).toBe('2024-02-15T00:00:00.000Z')
  })
})
