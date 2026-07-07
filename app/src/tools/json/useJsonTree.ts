import { shallowRef, computed } from 'vue'
import type { JsonLine, PathPart } from './types'

const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/

/**
 * Reconstructs the JSON path leading to `lines[index]` by walking the
 * parentIndex chain. Cheap and only ever done on demand (right-click), so we
 * don't pay to store a full path string on every one of the (possibly
 * hundreds of thousands of) lines.
 */
export function buildPath(lines: JsonLine[], index: number) {
  const parts: PathPart[] = []
  let cur = index
  while (cur !== -1) {
    const line = lines[cur]
    if (line.key !== null) parts.unshift(line.key)
    else if (line.arrayIndex !== null) parts.unshift(line.arrayIndex)
    cur = line.parentIndex
  }
  const display =
    '$' +
    parts
      .map((p) =>
        typeof p === 'number' ? `[${p}]` : IDENTIFIER_RE.test(p) ? `.${p}` : `['${p.replace(/'/g, "\\'")}']`,
      )
      .join('')
  return { parts, display }
}

/**
 * Manages the flat line array + collapse state for a JSON tree.
 * `lines` is kept as a shallowRef because it can hold hundreds of thousands
 * of plain-object rows for large payloads — deep Vue reactivity over that
 * many objects would itself become the bottleneck we're trying to avoid.
 */
export function useJsonTree() {
  const lines = shallowRef<JsonLine[]>([])
  const collapsed = shallowRef<Set<number>>(new Set())

  // Recomputed only when `lines` or `collapsed` change (i.e. on toggle),
  // never during scroll. Uses subtreeSize to skip whole collapsed subtrees
  // in one jump instead of visiting every descendant line.
  const visibleIndices = computed<number[]>(() => {
    const ls = lines.value
    const coll = collapsed.value
    const visible: number[] = []
    let i = 0
    while (i < ls.length) {
      visible.push(i)
      const line = ls[i]
      if (coll.has(i) && line.subtreeSize > 0) {
        i += line.subtreeSize + 1
      } else {
        i++
      }
    }
    return visible
  })

  function setLines(newLines: JsonLine[]) {
    lines.value = newLines
    collapsed.value = new Set()
  }

  function toggle(index: number) {
    const next = new Set(collapsed.value)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    collapsed.value = next
  }

  function isCollapsed(index: number) {
    return collapsed.value.has(index)
  }

  function expandAll() {
    collapsed.value = new Set()
  }

  function collapseAll() {
    const next = new Set<number>()
    const ls = lines.value
    for (let i = 0; i < ls.length; i++) {
      if (ls[i].subtreeSize > 0) next.add(i)
    }
    collapsed.value = next
  }

  return { lines, collapsed, visibleIndices, setLines, toggle, isCollapsed, expandAll, collapseAll }
}
