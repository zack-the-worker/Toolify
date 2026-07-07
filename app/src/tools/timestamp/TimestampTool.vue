<script setup lang="ts">
import { ref, computed } from 'vue'

const now = ref(Date.now())
setInterval(() => (now.value = Date.now()), 1000)

const inputTimestamp = ref(String(Math.floor(Date.now() / 1000)))
const inputDate = ref(new Date().toISOString().slice(0, 19))

const fromTimestamp = computed(() => {
  const n = Number(inputTimestamp.value)
  if (!Number.isFinite(n)) return null
  const ms = inputTimestamp.value.length > 10 ? n : n * 1000
  const d = new Date(ms)
  if (isNaN(d.getTime())) return null
  return d
})

const fromDate = computed(() => {
  const d = new Date(inputDate.value)
  if (isNaN(d.getTime())) return null
  return d
})
</script>

<template>
  <div class="tool">
    <div class="section">
      <h3>Current time</h3>
      <div class="row"><span class="label">Unix (s)</span><code>{{ Math.floor(now / 1000) }}</code></div>
      <div class="row"><span class="label">Unix (ms)</span><code>{{ now }}</code></div>
      <div class="row"><span class="label">ISO</span><code>{{ new Date(now).toISOString() }}</code></div>
    </div>

    <div class="section">
      <h3>Timestamp → Date</h3>
      <input v-model="inputTimestamp" class="input" placeholder="Unix timestamp (s or ms)" />
      <div v-if="fromTimestamp" class="row"><span class="label">Local</span><code>{{ fromTimestamp.toString() }}</code></div>
      <div v-if="fromTimestamp" class="row"><span class="label">UTC</span><code>{{ fromTimestamp.toUTCString() }}</code></div>
      <div v-if="fromTimestamp" class="row"><span class="label">ISO</span><code>{{ fromTimestamp.toISOString() }}</code></div>
      <div v-else class="error">Invalid timestamp</div>
    </div>

    <div class="section">
      <h3>Date → Timestamp</h3>
      <input v-model="inputDate" class="input" type="text" placeholder="YYYY-MM-DDTHH:mm:ss" />
      <div v-if="fromDate" class="row"><span class="label">Unix (s)</span><code>{{ Math.floor(fromDate.getTime() / 1000) }}</code></div>
      <div v-if="fromDate" class="row"><span class="label">Unix (ms)</span><code>{{ fromDate.getTime() }}</code></div>
      <div v-else class="error">Invalid date</div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.section { margin-bottom: 20px; }
h3 { font-size: 13px; color: var(--muted, #888); margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.04em; }
.row { display: flex; gap: 10px; align-items: baseline; padding: 3px 0; font-size: 13px; }
.label { width: 70px; color: var(--muted, #888); flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; }
.input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  margin-bottom: 6px;
  border-radius: 6px;
  border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e);
  color: var(--text, #ddd);
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
}
.error { color: #ff9a9a; font-size: 12px; }
</style>
