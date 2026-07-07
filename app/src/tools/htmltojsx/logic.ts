const VOID_ELEMENTS = 'area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr'

function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

function convertStyleAttr(styleValue: string): string {
  const declarations = styleValue
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const idx = d.indexOf(':')
      const prop = toCamelCase(d.slice(0, idx).trim())
      const value = d.slice(idx + 1).trim()
      return `${prop}: '${value}'`
    })
  return `style={{${declarations.join(', ')}}}`
}

export function htmlToJsx(html: string): string {
  let out = html

  // HTML comments -> JSX comments
  out = out.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')

  // Reserved-word attributes
  out = out.replace(/(\s)class=/g, '$1className=')
  out = out.replace(/(\s)for=/g, '$1htmlFor=')

  // Inline style string -> JSX style object
  out = out.replace(/style="([^"]*)"/g, (_, styleValue: string) => convertStyleAttr(styleValue))

  // on<event> handlers -> camelCase
  out = out.replace(/(\s)on([a-z]+)=/g, (_, ws: string, event: string) => `${ws}on${event[0].toUpperCase()}${event.slice(1)}=`)

  // Void elements must self-close in JSX
  const voidRe = new RegExp(`<(${VOID_ELEMENTS})((?:\\s+[^<>]*)?)\\s*/?>`, 'gi')
  out = out.replace(voidRe, (_, tag: string, attrs: string) => `<${tag}${attrs ? attrs.trimEnd() : ''} />`)

  return out
}
