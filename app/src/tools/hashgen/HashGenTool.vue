<script setup lang="ts">
import { ref, watch } from 'vue'
import { md5, sha1, sha256, sha512 } from './logic'

const input = ref('')
const hashes = ref<{ label: string; value: string }[]>([])

async function compute() {
  if (!input.value) {
    hashes.value = []
    return
  }
  const [h1, h256, h512] = await Promise.all([sha1(input.value), sha256(input.value), sha512(input.value)])
  hashes.value = [
    { label: 'MD5', value: md5(input.value) },
    { label: 'SHA-1', value: h1 },
    { label: 'SHA-256', value: h256 },
    { label: 'SHA-512', value: h512 },
  ]
}
watch(input, compute, { immediate: true })

async function copy(text: string) {
  await navigator.clipboard.writeText(text)
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <input v-model="input" class="text-input" placeholder="Text to hash" spellcheck="false" />
    </div>
    <div class="results">
      <div v-for="h in hashes" :key="h.label" class="result-row" @click="copy(h.value)">
        <span class="label">{{ h.label }}</span><code>{{ h.value }}</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool { padding: 16px; overflow-y: auto; height: 100%; box-sizing: border-box; }
.toolbar { margin-bottom: 16px; }
.text-input {
  width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px;
}
.results { display: flex; flex-direction: column; gap: 6px; }
.result-row { display: flex; gap: 12px; padding: 8px 10px; border-radius: 6px; background: var(--btn-bg, #2a2a2a); cursor: pointer; }
.result-row:hover { background: var(--btn-hover, #3a3a3a); }
.label { width: 70px; color: var(--muted, #888); font-size: 12px; flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; word-break: break-all; }
</style>
