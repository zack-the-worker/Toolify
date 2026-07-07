<script setup lang="ts">
import { ref } from 'vue'
import { generateLoremIpsum, type LoremUnit } from './logic'

const unit = ref<LoremUnit>('paragraphs')
const count = ref(3)
const startWithLorem = ref(true)
const output = ref('')

function generate() {
  output.value = generateLoremIpsum({ unit: unit.value, count: count.value, startWithLorem: startWithLorem.value })
}
generate()

async function copyOutput() {
  await navigator.clipboard.writeText(output.value)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <select v-model="unit">
        <option value="words">Words</option>
        <option value="sentences">Sentences</option>
        <option value="paragraphs">Paragraphs</option>
      </select>
      <input v-model.number="count" type="number" min="1" max="100" class="count-input" />
      <label class="chk"><input type="checkbox" v-model="startWithLorem" /> Start with "Lorem ipsum"</label>
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
.count-input { width: 60px; padding: 5px; border-radius: 6px; border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); }
.chk { font-size: 12px; display: flex; align-items: center; gap: 4px; }
.output {
  flex: 1; resize: none; border: none; outline: none; padding: 12px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; line-height: 1.6;
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
