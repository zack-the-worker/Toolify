<script setup lang="ts">
import { ref, watch } from 'vue'
import { invoke } from '@tauri-apps/api/core'

const direction = ref<'yamlToJson' | 'jsonToYaml'>('yamlToJson')
const input = ref('')
const output = ref('')
const error = ref('')

async function process() {
  if (!input.value.trim()) {
    output.value = ''
    error.value = ''
    return
  }
  try {
    output.value = await invoke<string>(direction.value === 'yamlToJson' ? 'yaml_to_json' : 'json_to_yaml', {
      input: input.value,
    })
    error.value = ''
  } catch (e) {
    const err = e as { message?: string }
    error.value = typeof err === 'string' ? err : (err.message ?? String(e))
    output.value = ''
  }
}

watch([input, direction], process)

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <div class="seg">
        <button :class="{ active: direction === 'yamlToJson' }" @click="direction = 'yamlToJson'">YAML → JSON</button>
        <button :class="{ active: direction === 'jsonToYaml' }" @click="direction = 'jsonToYaml'">JSON → YAML</button>
      </div>
      <div class="spacer"></div>
      <button @click="copyOutput" :disabled="!output">Copy</button>
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
