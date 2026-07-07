interface XmlNode {
  tag: string
  selfClosing: boolean
  children: (XmlNode | string)[]
}

export function minifyXml(input: string): string {
  return input.replace(/>\s+</g, '><').trim()
}

function tokenize(input: string): string[] {
  return input.match(/<\?[^?]*\?>|<!--[\s\S]*?-->|<\/[^>]+>|<[^>]+\/>|<[^>]+>|[^<]+/g) || []
}

function parseToTree(tokens: string[]): (XmlNode | string)[] {
  const root: (XmlNode | string)[] = []
  const stack: XmlNode[] = []
  const currentChildren = () => (stack.length ? stack[stack.length - 1].children : root)

  for (const token of tokens) {
    if (/^<\//.test(token)) {
      stack.pop()
    } else if (/^<\?/.test(token) || /^<!--/.test(token)) {
      currentChildren().push(token)
    } else if (/^<[^>]+\/>$/.test(token)) {
      currentChildren().push({ tag: token, selfClosing: true, children: [] })
    } else if (/^<[^>]+>$/.test(token)) {
      const node: XmlNode = { tag: token, selfClosing: false, children: [] }
      currentChildren().push(node)
      stack.push(node)
    } else {
      const text = token.trim()
      if (text) currentChildren().push(text)
    }
  }
  return root
}

function closingTagFor(openTag: string): string {
  const m = openTag.match(/^<([a-zA-Z0-9:_-]+)/)
  return `</${m ? m[1] : ''}>`
}

function renderNodes(nodes: (XmlNode | string)[], depth: number, indentUnit: string): string[] {
  const lines: string[] = []
  for (const n of nodes) {
    if (typeof n === 'string') {
      lines.push(indentUnit.repeat(depth) + n)
      continue
    }
    if (n.selfClosing) {
      lines.push(indentUnit.repeat(depth) + n.tag)
      continue
    }
    if (n.children.length === 0) {
      lines.push(indentUnit.repeat(depth) + n.tag + closingTagFor(n.tag))
    } else if (n.children.length === 1 && typeof n.children[0] === 'string') {
      lines.push(indentUnit.repeat(depth) + n.tag + n.children[0] + closingTagFor(n.tag))
    } else {
      lines.push(indentUnit.repeat(depth) + n.tag)
      lines.push(...renderNodes(n.children, depth + 1, indentUnit))
      lines.push(indentUnit.repeat(depth) + closingTagFor(n.tag))
    }
  }
  return lines
}

export function beautifyXml(input: string, indentSize = 2): string {
  const tree = parseToTree(tokenize(minifyXml(input)))
  return renderNodes(tree, 0, ' '.repeat(indentSize)).join('\n')
}
