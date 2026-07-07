<script setup lang="ts">
import { ref, computed } from 'vue'
import { testRegex } from './logic'

const pattern = ref('(?<year>\\d{4})-(\\d{2})-(\\d{2})')
const flags = ref('g')
const text = ref('Started 2024-05-01, ended 2024-06-15.')

const result = computed(() => {
  try {
    return { value: testRegex(pattern.value, flags.value, text.value), error: '' }
  } catch (e) {
    return { value: null, error: e instanceof Error ? e.message : String(e) }
  }
})

const highlighted = computed(() => {
  if (!result.value.value) return text.value
  let out = ''
  let last = 0
  for (const m of result.value.value.matches) {
    out += escapeHtml(text.value.slice(last, m.index))
    out += `<mark>${escapeHtml(m.match)}</mark>`
    last = m.index + m.match.length
  }
  out += escapeHtml(text.value.slice(last))
  return out
})

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <span class="slash">/</span>
      <input v-model="pattern" class="pattern-input" spellcheck="false" />
      <span class="slash">/</span>
      <input v-model="flags" class="flags-input" spellcheck="false" />
    </div>
    <div v-if="result.error" class="error-bar">{{ result.error }}</div>
    <div class="body">
      <textarea v-model="text" class="input-area" placeholder="Test string" spellcheck="false"></textarea>
      <div class="output-area">
        <div class="highlighted" v-html="highlighted"></div>
        <div v-if="result.value" class="matches">
          <div v-if="result.value.matches.length === 0" class="empty-hint">No matches</div>
          <div v-for="(m, i) in result.value.matches" :key="i" class="match-row">
            <span class="idx">#{{ i }}</span>
            <code>{{ m.match }}</code>
            <span class="at">@ {{ m.index }}</span>
            <span v-if="m.groups.length" class="groups">groups: {{ m.groups.join(', ') }}</span>
            <span v-if="Object.keys(m.namedGroups).length" class="groups">named: {{ JSON.stringify(m.namedGroups) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; align-items: center; gap: 4px; padding: 8px; border-bottom: 1px solid var(--border, #333); font-family: 'SF Mono', Menlo, Consolas, monospace; }
.slash { color: var(--muted, #888); }
.pattern-input { flex: 1; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); font-family: inherit; font-size: 13px; }
.flags-input { width: 60px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); font-family: inherit; font-size: 13px; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; font-family: monospace; }
.body { flex: 1; display: flex; min-height: 0; }
.input-area {
  flex: 0 0 40%; resize: none; border: none; border-right: 1px solid var(--border, #333); outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.output-area { flex: 1; overflow-y: auto; padding: 10px; }
.highlighted {
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; white-space: pre-wrap; word-break: break-word;
  padding: 10px; background: var(--btn-bg, #2a2a2a); border-radius: 6px; margin-bottom: 12px;
}
.highlighted :deep(mark) { background: var(--accent, #3a72ff); color: white; border-radius: 2px; }
.match-row { display: flex; gap: 8px; align-items: baseline; padding: 4px 0; font-size: 12px; flex-wrap: wrap; }
.idx { color: var(--muted, #888); width: 24px; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; color: var(--string-color, #ce9178); }
.at { color: var(--muted, #888); }
.groups { color: var(--muted, #888); }
.empty-hint { color: var(--muted, #666); font-size: 12.5px; }
</style>
