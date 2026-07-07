const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

function digitValue(ch: string): number {
  const v = DIGITS.indexOf(ch.toLowerCase())
  if (v === -1) throw new Error(`Invalid digit '${ch}'`)
  return v
}

export function convertBase(value: string, fromBase: number, toBase: number): string {
  const trimmed = value.trim()
  if (!trimmed) throw new Error('Input is empty')

  let big = 0n
  const fromBig = BigInt(fromBase)
  for (const ch of trimmed) {
    const v = digitValue(ch)
    if (v >= fromBase) throw new Error(`Digit '${ch}' is not valid in base ${fromBase}`)
    big = big * fromBig + BigInt(v)
  }

  if (big === 0n) return '0'

  const toBig = BigInt(toBase)
  let out = ''
  let n = big
  while (n > 0n) {
    out = DIGITS[Number(n % toBig)] + out
    n = n / toBig
  }
  return out
}
