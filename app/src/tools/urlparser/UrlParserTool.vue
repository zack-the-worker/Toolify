<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseUrl } from './logic'

const input = ref('https://user:pass@example.com:8080/path/to/page?a=1&b=2#section')

const parsed = computed(() => {
  try {
    return parseUrl(input.value)
  } catch {
    return null
  }
})

const error = computed(() => (input.value && !parsed.value ? 'Invalid URL' : ''))
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <input v-model="input" class="url-input" placeholder="Paste a URL" spellcheck="false" />
    </div>
    <div v-if="error" class="error-bar">{{ error }}</div>
    <div v-if="parsed" class="results">
      <div class="row"><span class="label">Protocol</span><code>{{ parsed.protocol }}</code></div>
      <div class="row" v-if="parsed.username"><span class="label">Username</span><code>{{ parsed.username }}</code></div>
      <div class="row" v-if="parsed.password"><span class="label">Password</span><code>{{ parsed.password }}</code></div>
      <div class="row"><span class="label">Hostname</span><code>{{ parsed.hostname }}</code></div>
      <div class="row" v-if="parsed.port"><span class="label">Port</span><code>{{ parsed.port }}</code></div>
      <div class="row"><span class="label">Path</span><code>{{ parsed.pathname }}</code></div>
      <div class="row" v-if="parsed.hash"><span class="label">Hash</span><code>{{ parsed.hash }}</code></div>

      <div v-if="parsed.searchParams.length" class="query-section">
        <h3>Query Parameters</h3>
        <div class="row" v-for="(p, i) in parsed.searchParams" :key="i">
          <span class="label">{{ p.key }}</span><code>{{ p.value }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.toolbar { margin-bottom: 16px; }
.url-input {
  width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px;
}
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; border-radius: 6px; margin-bottom: 12px; }
.results { display: flex; flex-direction: column; gap: 4px; max-width: 600px; }
.row { display: flex; gap: 12px; padding: 6px 10px; border-radius: 6px; }
.row:nth-child(odd) { background: var(--btn-bg, #2a2a2a); }
.label { width: 100px; color: var(--muted, #888); font-size: 12px; flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; word-break: break-all; }
.query-section { margin-top: 12px; }
h3 { font-size: 12px; color: var(--muted, #888); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 6px; }
</style>
