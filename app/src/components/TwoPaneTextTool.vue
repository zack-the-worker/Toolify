<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modes?: { value: string; label: string }[]
  transform: (input: string, mode: string) => string
  inputPlaceholder?: string
  outputPlaceholder?: string
}>()

const input = ref('')
const mode = ref(props.modes?.[0]?.value ?? '')
const error = ref('')

const output = computed(() => {
  if (!input.value) {
    error.value = ''
    return ''
  }
  try {
    const result = props.transform(input.value, mode.value)
    error.value = ''
    return result
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    return ''
  }
})

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar" v-if="modes && modes.length">
      <div class="seg">
        <button
          v-for="m in modes"
          :key="m.value"
          :class="{ active: mode === m.value }"
          @click="mode = m.value"
        >
          {{ m.label }}
        </button>
      </div>
      <div class="spacer"></div>
      <button @click="copyOutput" :disabled="!output">Copy</button>
    </div>
    <div v-if="error" class="error-bar">{{ error }}</div>
    <div class="body">
      <textarea
        v-model="input"
        class="pane"
        :placeholder="inputPlaceholder ?? 'Input'"
        spellcheck="false"
      ></textarea>
      <textarea
        :value="output"
        class="pane"
        :placeholder="outputPlaceholder ?? 'Output'"
        spellcheck="false"
        readonly
      ></textarea>
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
  border-radius: 6px;
  border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a);
  color: var(--text, #ddd);
  cursor: pointer;
}
button:hover:not(:disabled) { background: var(--btn-hover, #3a3a3a); }
button:disabled { opacity: 0.5; cursor: default; }
</style>
