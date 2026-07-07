<script setup lang="ts">
import { ref, computed } from 'vue'
import { inspectString } from './logic'

const input = ref('')
const stats = computed(() => inspectString(input.value))
</script>

<template>
  <div class="tool">
    <div class="body">
      <textarea v-model="input" class="input-area" placeholder="Paste text to inspect" spellcheck="false"></textarea>
      <div class="output-area">
        <div class="row"><span class="label">Characters</span><code>{{ stats.characters }}</code></div>
        <div class="row"><span class="label">Bytes (UTF-8)</span><code>{{ stats.bytes }}</code></div>
        <div class="row"><span class="label">Words</span><code>{{ stats.words }}</code></div>
        <div class="row"><span class="label">Lines</span><code>{{ stats.lines }}</code></div>
        <div class="row"><span class="label">Leading/trailing whitespace</span><code>{{ stats.hasLeadingOrTrailingWhitespace ? 'Yes' : 'No' }}</code></div>
        <div class="row" v-if="stats.mostFrequentChar">
          <span class="label">Most frequent char</span>
          <code>"{{ stats.mostFrequentChar.char }}" ({{ stats.mostFrequentChar.count }}×)</code>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.body { flex: 1; display: flex; min-height: 0; }
.input-area {
  flex: 0 0 55%; resize: none; border: none; border-right: 1px solid var(--border, #333); outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.output-area { flex: 1; padding: 12px; overflow-y: auto; }
.row { display: flex; gap: 12px; padding: 8px 10px; border-radius: 6px; margin-bottom: 4px; }
.row:nth-child(odd) { background: var(--btn-bg, #2a2a2a); }
.label { width: 190px; color: var(--muted, #888); font-size: 12px; flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; }
</style>
