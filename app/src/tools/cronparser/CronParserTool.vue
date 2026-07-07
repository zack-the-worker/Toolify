<script setup lang="ts">
import { ref, computed } from 'vue'
import { describeCron, nextRunTimes } from './logic'

const expr = ref('30 4 * * 1-5')

const description = computed(() => {
  try {
    return { value: describeCron(expr.value), error: '' }
  } catch (e) {
    return { value: '', error: e instanceof Error ? e.message : String(e) }
  }
})

const upcoming = computed(() => {
  if (description.value.error) return []
  try {
    return nextRunTimes(expr.value, 5)
  } catch {
    return []
  }
})
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <input v-model="expr" class="expr-input" placeholder="* * * * *" spellcheck="false" />
    </div>
    <div v-if="description.error" class="error-bar">{{ description.error }}</div>
    <div v-else class="content">
      <div class="description">{{ description.value }}</div>
      <h3>Next 5 runs (UTC)</h3>
      <div class="row" v-for="(d, i) in upcoming" :key="i"><code>{{ d.toISOString() }}</code></div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.toolbar { margin-bottom: 14px; }
.expr-input {
  width: 100%; max-width: 320px; box-sizing: border-box; padding: 8px 10px; border-radius: 6px;
  border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 14px;
}
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 8px 10px; font-size: 12.5px; border-radius: 6px; }
.description { font-size: 15px; margin-bottom: 16px; }
h3 { font-size: 12px; color: var(--muted, #888); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 8px; }
.row { padding: 6px 10px; border-radius: 6px; margin-bottom: 4px; background: var(--btn-bg, #2a2a2a); max-width: 320px; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; }
</style>
