export function svgToCssBackground(svg: string, property = 'background-image'): string {
  if (!svg.trim()) throw new Error('SVG input is empty')
  const base64 = btoa(unescape(encodeURIComponent(svg)))
  return `${property}: url("data:image/svg+xml;base64,${base64}");`
}
