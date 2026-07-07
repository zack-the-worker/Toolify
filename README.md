# Toolify

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-24C8DB)](https://tauri.app)
[![Vue 3](https://img.shields.io/badge/frontend-Vue%203-42b883)](https://vuejs.org)

An offline-first desktop toolbox for developers — JSON, encoding, formatting, codegen,
and more, all in one fast, native app. Built with **Tauri (Rust)** + **Vue 3**.

Everything runs locally: no data ever leaves your machine.

## Why Toolify

Most "paste your JSON/text here" web tools choke on large input because they do
everything on the JS main thread and render every node into the DOM. Toolify pushes
the heavy lifting (parsing, formatting, hashing, certificate decoding, …) into the Rust
backend and renders large output through a virtualized list, so only the visible rows
ever touch the DOM.

Benchmark: a 9 MB / 840,000-line JSON document parses and flattens in **~87ms** in
release mode — see [`app/src-tauri/src/tools/json.rs`](app/src-tauri/src/tools/json.rs).

The JSON viewer also auto-repairs common copy-paste mistakes (escaped quotes from
PHP's `addslashes()`, trailing commas) and tells you exactly what it fixed instead of
just failing with "invalid JSON".

## Tools

42 tools and counting, organized by category:

**Data** — JSON Viewer (tree view, JSONPath query, right-click copy path/value),
Number Base Converter, URL Parser, JWT Debugger, JSON ↔ CSV, YAML ↔ JSON,
Certificate Decoder (X.509), PHP Serializer/Unserializer, PHP ↔ JSON

**Encoding** — Base64, Base64 Image Encode/Decode, URL Encode, HTML Entity
Encode/Decode, Backslash Escape/Unescape, Hex ↔ ASCII

**Text** — String Case Converter, Line Sort/Dedupe, RegExp Tester, Text Diff Checker,
String Inspector

**Beautify** — HTML, CSS, JS, SCSS, LESS, XML, ERB Beautify/Minify, SQL Formatter

**Codegen** — cURL to Code, JSON to Code (TypeScript interfaces), HTML to JSX

**Generators** — UUID/ULID, Lorem Ipsum, Random String, Hash Generator (MD5, SHA-1/256/512),
QR Code Reader/Generator

**Design** — Color Converter, SVG to CSS

**Date/Time** — Unix Timestamp Converter, Cron Job Parser

**Web** — HTML Preview, Markdown Preview

Missing a tool you rely on? Open an issue or send a PR — see [Contributing](#contributing).

## Tech stack

- **Backend**: Rust + [Tauri 2](https://tauri.app) — heavy/streaming work (JSON, YAML,
  X.509 parsing) lives here, with `cargo test` coverage
- **Frontend**: Vue 3 + TypeScript + Vite, [Vitest](https://vitest.dev) for unit tests
- **Icons**: [Hugeicons](https://hugeicons.com) (no emoji, ever)

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain) — required by Tauri
- Platform-specific Tauri dependencies: see the
  [Tauri prerequisites guide](https://tauri.app/start/prerequisites/)

### Install & run

```sh
cd app
npm install
npm run tauri:dev    # launch the desktop app in dev mode
```

### Build a release bundle

```sh
npm run tauri:build
```

### Run the test suites

```sh
# Frontend (Vitest)
cd app
npm test

# Backend (Rust)
cd app/src-tauri
cargo test
```

## Project layout

```
app/
├─ src/                      Vue 3 frontend
│  ├─ tools/                 one folder per tool: logic.ts (+ logic.test.ts) + a *.vue wrapper
│  │  └─ registry.ts         central list of tools shown in the sidebar
│  └─ components/            shared UI: VirtualList, ContextMenu, BeautifyMinifyTool, …
└─ src-tauri/                Rust backend
   └─ src/tools/             one module per Tauri-backed tool, with #[cfg(test)] coverage
```

Adding a new tool: create `src/tools/<name>/logic.ts` with pure functions (tested first —
see [Contributing](#contributing)), a thin `<Name>Tool.vue` wrapper, and register it in
`src/tools/registry.ts`. If the tool needs heavy or streaming work, add a Tauri command
under `src-tauri/src/tools/` instead of doing it in the frontend.

## Contributing

Contributions are welcome!

1. Fork the repo and create a branch off `main`.
2. This project follows **test-first development**: write a failing test in
   `logic.test.ts` (frontend) or a `#[test]` (Rust) before implementing, then make it pass.
3. Run the full test suite (`npm test` and `cargo test`) before opening a PR.
4. Keep tools self-contained: pure logic in `logic.ts`, UI in a thin `.vue` wrapper.
5. Open a pull request describing what changed and why.

Bug reports and feature requests are just as welcome as code — please open an
[issue](https://github.com/zack-the-worker/Toolify/issues).

## License

[MIT](LICENSE)
