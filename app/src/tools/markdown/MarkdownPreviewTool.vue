<script setup lang="ts">
import { ref, computed } from 'vue'
import { renderMarkdown } from './logic'

const input = ref('# Hello\n\nType **Markdown** on the left, see it rendered on the right.\n\n- one\n- two\n')
const html = computed(() => renderMarkdown(input.value))

const srcdoc = computed(
  () => `<style>body{font-family:-apple-system,sans-serif;padding:16px;color:#111}pre{background:#f4f4f4;padding:8px;border-radius:6px;overflow-x:auto}</style>${html.value}`,
)
</script>

<template>
  <div class="tool">
    <div class="body">
      <textarea v-model="input" class="input-area" placeholder="Paste Markdown here" spellcheck="false"></textarea>
      <iframe class="preview" :srcdoc="srcdoc" sandbox=""></iframe>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.body { flex: 1; display: flex; min-height: 0; }
.input-area {
  flex: 0 0 45%; resize: none; border: none; border-right: 1px solid var(--border, #333); outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.preview { flex: 1; border: none; background: white; }
</style>
