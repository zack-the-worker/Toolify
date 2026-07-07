export function extractBase64FromDataUrl(input: string): string {
  const idx = input.indexOf(',')
  return input.startsWith('data:') && idx !== -1 ? input.slice(idx + 1) : input
}

export function isLikelyImageDataUrl(input: string): boolean {
  return /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(input)
}
