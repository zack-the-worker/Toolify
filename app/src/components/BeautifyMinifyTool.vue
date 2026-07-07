<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  beautify: (input: string, indentSize: number) => string
  minify: (input: string) => string | Promise<string>
  placeholder?: string
}>()

const input = ref('')
const mode = ref<'beautify' | 'minify'>('beautify')
const indent = ref(4)
const output = ref('')
const error = ref('')

async function process() {
  if (!input.value) {
    output.value = ''
    error.value = ''
    return
  }
  try {
    output.value = mode.value === 'beautify' ? props.beautify(input.value, indent.value) : await props.minify(input.value)
    error.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    output.value = ''
  }
}
watch([input, mode, indent], process)

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <div class="seg">
        <button :class="{ active: mode === 'beautify' }" @click="mode = 'beautify'">Beautify</button>
        <button :class="{ active: mode === 'minify' }" @click="mode = 'minify'">Minify</button>
      </div>
      <label v-if="mode === 'beautify'" class="chk">
        Indent
        <select v-model.number="indent">
          <option :value="2">2</option>
          <option :value="4">4</option>
        </select>
      </label>
      <div class="spacer"></div>
      <button @click="copyOutput" :disabled="!output">Copy</button>
    </div>
    <div v-if="error" class="error-bar">{{ error }}</div>
    <div class="body">
      <textarea v-model="input" class="pane" :placeholder="placeholder ?? 'Input'" spellcheck="false"></textarea>
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
.chk { font-size: 12px; display: flex; align-items: center; gap: 6px; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; font-family: monospace; }
.body { flex: 1; display: flex; min-height: 0; }
.pane {
  flex: 1; resize: none; border: none; outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.pane:first-child { border-right: 1px solid var(--border, #333); }
select {
  padding: 4px 6px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd);
}
button {
  font-size: 12px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); cursor: pointer;
}
button:hover:not(:disabled) { background: var(--btn-hover, #3a3a3a); }
button:disabled { opacity: 0.5; cursor: default; }
</style>
