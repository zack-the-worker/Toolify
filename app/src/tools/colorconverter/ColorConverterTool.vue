<script setup lang="ts">
import { ref, computed } from 'vue'
import { parseColor, toHexString, toRgbString, toHslString } from './logic'

const input = ref('#ff8800')

const parsed = computed(() => parseColor(input.value))
const error = computed(() => (input.value && !parsed.value ? 'Could not parse this color' : ''))

async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <input v-model="input" class="color-input" placeholder="#ff8800, rgb(255,136,0), hsl(32,100%,50%)…" spellcheck="false" />
      <div class="swatch" :style="{ background: parsed ? toRgbString(parsed) : 'transparent' }"></div>
    </div>
    <div v-if="error" class="error-bar">{{ error }}</div>
    <div v-if="parsed" class="results">
      <div class="result-row" @click="copy(toHexString(parsed))">
        <span class="label">HEX</span><code>{{ toHexString(parsed) }}</code>
      </div>
      <div class="result-row" @click="copy(toRgbString(parsed))">
        <span class="label">RGB</span><code>{{ toRgbString(parsed) }}</code>
      </div>
      <div class="result-row" @click="copy(toHslString(parsed))">
        <span class="label">HSL</span><code>{{ toHslString(parsed) }}</code>
      </div>
      <div class="hint">Click a row to copy</div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; height: 100%; box-sizing: border-box; overflow-y: auto; }
.toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.color-input {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e);
  color: var(--text, #ddd);
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px;
}
.swatch { width: 40px; height: 40px; border-radius: 8px; border: 1px solid var(--border, #444); flex-shrink: 0; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; border-radius: 6px; margin-bottom: 12px; }
.results { display: flex; flex-direction: column; gap: 6px; max-width: 400px; }
.result-row {
  display: flex;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--btn-bg, #2a2a2a);
  cursor: pointer;
}
.result-row:hover { background: var(--btn-hover, #3a3a3a); }
.label { width: 40px; color: var(--muted, #888); font-size: 12px; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; }
.hint { color: var(--muted, #666); font-size: 11px; margin-top: 4px; }
</style>
