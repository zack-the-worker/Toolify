<script setup lang="ts">
import { ref } from 'vue'

const input = ref('<h1>Hello</h1>\n<p>Type HTML on the left, see it rendered on the right.</p>')
</script>

<template>
  <div class="tool">
    <div class="body">
      <textarea v-model="input" class="input-area" placeholder="Paste HTML here" spellcheck="false"></textarea>
      <iframe class="preview" :srcdoc="input" sandbox="allow-scripts"></iframe>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.body { flex: 1; display: flex; min-height: 0; }
.input-area {
  flex: 0 0 45%;
  resize: none; border: none; border-right: 1px solid var(--border, #333); outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.preview { flex: 1; border: none; background: white; }
</style>
