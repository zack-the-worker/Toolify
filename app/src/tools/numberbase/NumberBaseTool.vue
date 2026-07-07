<script setup lang="ts">
import { ref, computed } from 'vue'
import { convertBase } from './logic'

const value = ref('255')
const fromBase = ref(10)

const targets = [
  { base: 2, label: 'Binary' },
  { base: 8, label: 'Octal' },
  { base: 10, label: 'Decimal' },
  { base: 16, label: 'Hexadecimal' },
]

const error = ref('')

const results = computed(() => {
  error.value = ''
  if (!value.value.trim()) return null
  try {
    return Object.fromEntries(targets.map((t) => [t.base, convertBase(value.value, fromBase.value, t.base)]))
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    return null
  }
})

async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <input v-model="value" class="value-input" placeholder="Value" spellcheck="false" />
      <label class="chk">
        From base
        <select v-model.number="fromBase">
          <option v-for="t in targets" :key="t.base" :value="t.base">{{ t.base }} ({{ t.label }})</option>
        </select>
      </label>
    </div>
    <div v-if="error" class="error-bar">{{ error }}</div>
    <div v-if="results" class="results">
      <div v-for="t in targets" :key="t.base" class="result-row" @click="copy(results[t.base])">
        <span class="label">{{ t.label }}</span><code>{{ results[t.base] }}</code>
      </div>
      <div class="hint">Click a row to copy</div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.value-input {
  flex: 1; max-width: 300px; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px;
}
.chk { font-size: 12px; display: flex; align-items: center; gap: 6px; }
select { padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border, #444); background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; border-radius: 6px; margin-bottom: 12px; }
.results { display: flex; flex-direction: column; gap: 6px; max-width: 420px; }
.result-row { display: flex; gap: 12px; padding: 8px 10px; border-radius: 6px; background: var(--btn-bg, #2a2a2a); cursor: pointer; }
.result-row:hover { background: var(--btn-hover, #3a3a3a); }
.label { width: 100px; color: var(--muted, #888); font-size: 12px; flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; word-break: break-all; }
.hint { color: var(--muted, #666); font-size: 11px; margin-top: 4px; }
</style>
