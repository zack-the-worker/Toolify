<script setup lang="ts">
import { ref, computed } from 'vue'
import { phpToJson, jsonToPhp } from './logic'

const mode = ref<'phpToJson' | 'jsonToPhp'>('phpToJson')
const input = ref('a:2:{s:4:"name";s:5:"Alice";s:3:"age";i:30;}')

const result = computed(() => {
  try {
    return { value: mode.value === 'phpToJson' ? phpToJson(input.value) : jsonToPhp(input.value), error: '' }
  } catch (e) {
    return { value: '', error: e instanceof Error ? e.message : String(e) }
  }
})

async function copyOutput() {
  await navigator.clipboard.writeText(result.value.value)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <div class="seg">
        <button :class="{ active: mode === 'phpToJson' }" @click="mode = 'phpToJson'">PHP → JSON</button>
        <button :class="{ active: mode === 'jsonToPhp' }" @click="mode = 'jsonToPhp'">JSON → PHP</button>
      </div>
      <div class="spacer"></div>
      <button @click="copyOutput" :disabled="!result.value">Copy</button>
    </div>
    <div v-if="result.error" class="error-bar">{{ result.error }}</div>
    <div class="body">
      <textarea v-model="input" class="pane" placeholder="Input" spellcheck="false"></textarea>
      <textarea :value="result.value" class="pane" placeholder="Output" spellcheck="false" readonly></textarea>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid var(--border, #333); }
.spacer { flex: 1; }
.seg { display: flex; border: 1px solid var(--border, #444); border-radius: 6px; overflow: hidden; }
.seg button { border: none; border-radius: 0; }
.seg button.active { background: var(--accent, #3a72ff); color: white; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; font-family: monospace; }
.body { flex: 1; display: flex; min-height: 0; }
.pane {
  flex: 1; resize: none; border: none; outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.pane:first-child { border-right: 1px solid var(--border, #333); }
button {
  font-size: 12px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); cursor: pointer;
}
button:hover:not(:disabled) { background: var(--btn-hover, #3a3a3a); }
button:disabled { opacity: 0.5; cursor: default; }
</style>
