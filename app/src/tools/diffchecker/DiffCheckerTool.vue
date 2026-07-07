<script setup lang="ts">
import { ref, computed } from 'vue'
import { diffLines } from './logic'

const left = ref('')
const right = ref('')

const diff = computed(() => diffLines(left.value, right.value))
</script>

<template>
  <div class="tool">
    <div class="inputs">
      <textarea v-model="left" class="pane" placeholder="Original" spellcheck="false"></textarea>
      <textarea v-model="right" class="pane" placeholder="Changed" spellcheck="false"></textarea>
    </div>
    <div class="diff-output">
      <div
        v-for="(line, i) in diff"
        :key="i"
        class="diff-line"
        :class="line.type"
      >
        <span class="marker">{{ line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ' }}</span>
        <span class="text">{{ line.text }}</span>
      </div>
      <div v-if="diff.length === 0" class="empty-hint">No differences to show</div>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.inputs { display: flex; height: 35%; border-bottom: 1px solid var(--border, #333); }
.pane {
  flex: 1; resize: none; border: none; outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.pane:first-child { border-right: 1px solid var(--border, #333); }
.diff-output { flex: 1; overflow-y: auto; font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; }
.diff-line { display: flex; padding: 1px 10px; white-space: pre-wrap; word-break: break-word; }
.diff-line.added { background: rgba(46, 160, 67, 0.15); color: #7ee787; }
.diff-line.removed { background: rgba(248, 81, 73, 0.15); color: #ff9a9a; }
.marker { width: 16px; flex-shrink: 0; opacity: 0.7; }
.empty-hint { padding: 10px; color: var(--muted, #666); }
</style>
