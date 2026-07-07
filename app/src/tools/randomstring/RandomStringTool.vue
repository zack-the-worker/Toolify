<script setup lang="ts">
import { ref } from 'vue'
import { generateRandomString, type Charset } from './logic'

const length = ref(32)
const charset = ref<Charset>('alnum')
const output = ref('')

function generate() {
  output.value = generateRandomString({ length: length.value, charset: charset.value })
}
generate()

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <label class="chk">
        Length
        <input v-model.number="length" type="number" min="1" max="512" class="count-input" />
      </label>
      <select v-model="charset">
        <option value="alnum">Alphanumeric</option>
        <option value="alpha">Letters only</option>
        <option value="numeric">Numeric</option>
        <option value="hex">Hex</option>
        <option value="alnumSymbols">Alphanumeric + Symbols</option>
      </select>
      <button @click="generate">Generate</button>
      <div class="spacer"></div>
      <button @click="copyOutput" :disabled="!output">Copy</button>
    </div>
    <textarea :value="output" class="output" readonly spellcheck="false"></textarea>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid var(--border, #333); flex-wrap: wrap; }
.spacer { flex: 1; }
.chk { font-size: 12px; display: flex; align-items: center; gap: 6px; }
.count-input { width: 70px; padding: 5px; border-radius: 6px; border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); }
.output {
  flex: 1; resize: none; border: none; outline: none; padding: 12px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; word-break: break-all; white-space: pre-wrap;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
select {
  padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd);
}
button {
  font-size: 12px; padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); cursor: pointer;
}
button:hover:not(:disabled) { background: var(--btn-hover, #3a3a3a); }
button:disabled { opacity: 0.5; cursor: default; }
</style>
