<script setup lang="ts">
import { ref, watch } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { FolderOpenIcon } from '@hugeicons/core-free-icons'
import { generateQrDataUrl, decodeQrFromImageData } from './logic'

const mode = ref<'generate' | 'read'>('generate')

const text = ref('https://example.com')
const qrUrl = ref('')
const genError = ref('')

async function generate() {
  if (!text.value) {
    qrUrl.value = ''
    genError.value = ''
    return
  }
  try {
    qrUrl.value = await generateQrDataUrl(text.value)
    genError.value = ''
  } catch (e) {
    genError.value = e instanceof Error ? e.message : String(e)
    qrUrl.value = ''
  }
}
watch(text, generate, { immediate: true })

const fileInput = ref<HTMLInputElement | null>(null)
const decodedText = ref('')
const readError = ref('')

function openFilePicker() {
  fileInput.value?.click()
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  readError.value = ''
  decodedText.value = ''
  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    canvas.width = bitmap.width
    canvas.height = bitmap.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const result = decodeQrFromImageData(imageData)
    if (result === null) readError.value = 'No QR code found in this image'
    else decodedText.value = result
  } catch (e) {
    readError.value = e instanceof Error ? e.message : String(e)
  }
}
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <div class="seg">
        <button :class="{ active: mode === 'generate' }" @click="mode = 'generate'">Generate</button>
        <button :class="{ active: mode === 'read' }" @click="mode = 'read'">Read</button>
      </div>
    </div>

    <div v-if="mode === 'generate'" class="content">
      <div class="row">
        <div class="input-col">
          <input v-model="text" class="text-input" placeholder="Text or URL to encode" spellcheck="false" />
          <div v-if="genError" class="error-bar">{{ genError }}</div>
        </div>
        <div class="qr-frame">
          <img v-if="qrUrl" :src="qrUrl" class="qr-image" alt="Generated QR code" />
        </div>
      </div>
    </div>

    <div v-else class="content">
      <button @click="openFilePicker"><HugeiconsIcon :icon="FolderOpenIcon" :size="14" /> Choose Image…</button>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileChange" />
      <div v-if="readError" class="error-bar">{{ readError }}</div>
      <div v-if="decodedText" class="result-row"><code>{{ decodedText }}</code></div>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid var(--border, #333); }
.seg { display: flex; border: 1px solid var(--border, #444); border-radius: 6px; overflow: hidden; }
.seg button { border: none; border-radius: 0; }
.seg button.active { background: var(--accent, #3a72ff); color: white; }
.content { padding: 20px; overflow-y: auto; flex: 1; }
.row { display: flex; align-items: flex-start; gap: 20px; }
.input-col { flex: 1; min-width: 0; }
.text-input {
  width: 100%; box-sizing: border-box; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd); font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px;
}
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 8px 10px; font-size: 12.5px; border-radius: 6px; margin-top: 12px; }
.qr-frame {
  flex-shrink: 0; width: 200px; height: 200px; border-radius: 10px; background: white;
  display: flex; align-items: center; justify-content: center; padding: 12px; box-sizing: border-box;
}
.qr-image { width: 100%; height: 100%; object-fit: contain; }
.result-row { padding: 10px; border-radius: 6px; background: var(--btn-bg, #2a2a2a); max-width: 500px; margin-top: 12px; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 13px; word-break: break-all; }
button {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 12px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); cursor: pointer;
}
button:hover { background: var(--btn-hover, #3a3a3a); }
</style>
