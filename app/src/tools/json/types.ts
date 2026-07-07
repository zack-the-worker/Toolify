export const KIND_OBJECT = 0
export const KIND_ARRAY = 1
export const KIND_STRING = 2
export const KIND_NUMBER = 3
export const KIND_BOOL = 4
export const KIND_NULL = 5
export const KIND_CLOSE = 6

export interface JsonLine {
  depth: number
  key: string | null
  kind: number
  value: string | null
  isLast: boolean
  childrenCount: number
  subtreeSize: number
  bracket: string | null
  parentIndex: number
  arrayIndex: number | null
}

// Matches Rust's `#[serde(untagged)] enum PathPart { Key(String), Index(usize) }`:
// a bare string or a bare number, not a wrapped object.
export type PathPart = string | number

export interface FlattenResult {
  lines: JsonLine[]
  rootIsContainer: boolean
  corrections: string[]
}

export interface FormatResult {
  text: string
  corrections: string[]
}

export interface JsonError {
  message: string
  line: number
  column: number
}
