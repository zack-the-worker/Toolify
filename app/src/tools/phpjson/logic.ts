import { phpSerialize, phpUnserialize } from '../phpserialize/logic'

export function phpToJson(phpSerialized: string): string {
  return JSON.stringify(phpUnserialize(phpSerialized), null, 2)
}

export function jsonToPhp(json: string): string {
  return phpSerialize(JSON.parse(json))
}
