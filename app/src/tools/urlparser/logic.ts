export interface ParsedUrl {
  protocol: string
  username: string
  password: string
  hostname: string
  port: string
  pathname: string
  hash: string
  searchParams: { key: string; value: string }[]
}

export function parseUrl(input: string): ParsedUrl {
  const url = new URL(input)
  const searchParams: { key: string; value: string }[] = []
  url.searchParams.forEach((value, key) => searchParams.push({ key, value }))
  return {
    protocol: url.protocol,
    username: url.username,
    password: url.password,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    hash: url.hash,
    searchParams,
  }
}
