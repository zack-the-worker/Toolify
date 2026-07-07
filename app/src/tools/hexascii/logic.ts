export function asciiToHex(input: string): string {
  const bytes = new TextEncoder().encode(input)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ')
}

export function hexToAscii(input: string): string {
  const cleaned = input
    .replace(/0x/gi, '')
    .replace(/[^0-9a-fA-F]/g, '')
  if (cleaned.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of digits')
  }
  const bytes = new Uint8Array(cleaned.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16)
  }
  return new TextDecoder().decode(bytes)
}
