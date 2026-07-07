<script setup lang="ts">
import { ref, computed } from 'vue'
import { generateUuidV4, decodeUuid, generateUlid, decodeUlid } from './logic'

const generated = ref(generateUuidV4())
const decodeInput = ref('')

const uuidInfo = computed(() => {
  if (!decodeInput.value) return null
  try {
    return { kind: 'uuid' as const, ...decodeUuid(decodeInput.value) }
  } catch {
    return null
  }
})

const ulidInfo = computed(() => {
  if (!decodeInput.value) return null
  try {
    const info = decodeUlid(decodeInput.value)
    return { kind: 'ulid' as const, ...info }
  } catch {
    return null
  }
})

const decodeError = computed(() =>
  decodeInput.value && !uuidInfo.value && !ulidInfo.value ? 'Not a valid UUID or ULID' : '',
)

function newUuid() {
  generated.value = generateUuidV4()
}
function newUlid() {
  generated.value = generateUlid()
}
async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="tool">
    <div class="section">
      <h3>Generate</h3>
      <div class="gen-row">
        <button @click="newUuid">New UUID v4</button>
        <button @click="newUlid">New ULID</button>
      </div>
      <div class="result-row" @click="copy(generated)">
        <code>{{ generated }}</code>
      </div>
    </div>

    <div class="section">
      <h3>Decode</h3>
      <input v-model="decodeInput" class="input" placeholder="Paste a UUID or ULID" spellcheck="false" />
      <div v-if="decodeError" class="error">{{ decodeError }}</div>
      <div v-if="uuidInfo" class="row"><span class="label">Version</span><code>{{ uuidInfo.version }}</code></div>
      <div v-if="uuidInfo" class="row"><span class="label">Variant</span><code>{{ uuidInfo.variant }}</code></div>
      <div v-if="ulidInfo" class="row"><span class="label">Timestamp</span><code>{{ ulidInfo.timestamp }}</code></div>
      <div v-if="ulidInfo" class="row"><span class="label">Date (UTC)</span><code>{{ ulidInfo.date.toISOString() }}</code></div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.section { margin-bottom: 24px; }
h3 { font-size: 13px; color: var(--muted, #888); margin: 0 0 10px; text-transform: uppercase; letter-spacing: 0.04em; }
.gen-row { display: flex; gap: 8px; margin-bottom: 10px; }
.result-row, .row { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 6px; background: var(--btn-bg, #2a2a2a); margin-bottom: 6px; }
.result-row { cursor: pointer; max-width: 400px; }
.result-row:hover { background: var(--btn-hover, #3a3a3a); }
.label { width: 90px; color: var(--muted, #888); font-size: 12px; flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; }
.input {
  width: 100%; max-width: 400px; box-sizing: border-box; padding: 6px 8px; margin-bottom: 8px;
  border-radius: 6px; border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e);
  color: var(--text, #ddd); font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
}
.error { color: #ff9a9a; font-size: 12px; margin-bottom: 8px; }
button {
  font-size: 12px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); cursor: pointer;
}
button:hover { background: var(--btn-hover, #3a3a3a); }
</style>
