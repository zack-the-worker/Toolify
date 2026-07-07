<script setup lang="ts">
import { ref, watch } from 'vue'

const input = ref('')
const output = ref('')
const mode = ref<'encode' | 'decode'>('encode')
const error = ref('')

function process() {
  error.value = ''
  try {
    output.value = mode.value === 'encode' ? encodeURIComponent(input.value) : decodeURIComponent(input.value)
  } catch {
    error.value = 'Invalid input for ' + mode.value
    output.value = ''
  }
}

watch([input, mode], process)
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <div class="seg">
        <button :class="{ active: mode === 'encode' }" @click="mode = 'encode'">Encode</button>
        <button :class="{ active: mode === 'decode' }" @click="mode = 'decode'">Decode</button>
      </div>
    </div>
    <div v-if="error" class="error-bar">{{ error }}</div>
    <div class="body">
      <textarea v-model="input" class="pane" placeholder="Input" spellcheck="false"></textarea>
      <textarea :value="output" class="pane" placeholder="Output" spellcheck="false" readonly></textarea>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; gap: 8px; padding: 8px; border-bottom: 1px solid var(--border, #333); }
.seg { display: flex; border: 1px solid var(--border, #444); border-radius: 6px; overflow: hidden; }
.seg button { border: none; border-radius: 0; }
.seg button.active { background: var(--accent, #3a72ff); color: white; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; }
.body { flex: 1; display: flex; min-height: 0; }
.pane {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  background: var(--input-bg, #1e1e1e);
  color: var(--text, #ddd);
}
.pane:first-child { border-right: 1px solid var(--border, #333); }
button {
  font-size: 12px;
  padding: 5px 10px;
  border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a);
  color: var(--text, #ddd);
  cursor: pointer;
}
</style>
