<script setup lang="ts">
import { ref, computed } from 'vue'
import { extractBase64FromDataUrl, isLikelyImageDataUrl } from './logic'

const mode = ref<'encode' | 'decode'>('encode')

// Encode
const fileInput = ref<HTMLInputElement | null>(null)
const encodedDataUrl = ref('')
const encodedBase64 = computed(() => extractBase64FromDataUrl(encodedDataUrl.value))

function openFilePicker() {
  fileInput.value?.click()
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  encodedDataUrl.value = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function copyBase64() {
  await navigator.clipboard.writeText(encodedBase64.value)
}

// Decode
const decodeInput = ref('')
const decodeError = ref('')
const decodedUrl = computed(() => {
  const raw = decodeInput.value.trim()
  if (!raw) {
    decodeError.value = ''
    return ''
  }
  const url = raw.startsWith('data:') ? raw : `data:image/png;base64,${raw}`
  if (!isLikelyImageDataUrl(url)) {
    decodeError.value = 'Does not look like image data'
    return ''
  }
  decodeError.value = ''
  return url
})
</script>

<template>
  <div class="tool">
    <div class="toolbar">
      <div class="seg">
        <button :class="{ active: mode === 'encode' }" @click="mode = 'encode'">Encode</button>
        <button :class="{ active: mode === 'decode' }" @click="mode = 'decode'">Decode</button>
      </div>
    </div>

    <div v-if="mode === 'encode'" class="content">
      <button @click="openFilePicker">Choose Image…</button>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="onFileChange" />
      <template v-if="encodedDataUrl">
        <img :src="encodedDataUrl" class="preview" alt="Selected image" />
        <div class="output-row">
          <textarea :value="encodedBase64" class="output" readonly spellcheck="false"></textarea>
          <button @click="copyBase64">Copy Base64</button>
        </div>
      </template>
    </div>

    <div v-else class="content">
      <textarea v-model="decodeInput" class="input" placeholder="Paste base64 or a data: URL" spellcheck="false"></textarea>
      <div v-if="decodeError" class="error-bar">{{ decodeError }}</div>
      <img v-if="decodedUrl" :src="decodedUrl" class="preview" alt="Decoded image" />
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.toolbar { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid var(--border, #333); }
.seg { display: flex; border: 1px solid var(--border, #444); border-radius: 6px; overflow: hidden; }
.seg button { border: none; border-radius: 0; }
.seg button.active { background: var(--accent, #3a72ff); color: white; }
.content { padding: 16px; overflow-y: auto; flex: 1; }
.preview { max-width: 280px; max-height: 200px; border-radius: 8px; background: white; padding: 6px; display: block; margin: 12px 0; }
.output-row { display: flex; gap: 8px; align-items: flex-start; }
.output {
  flex: 1; height: 100px; resize: vertical; border-radius: 6px; border: 1px solid var(--border, #444); padding: 8px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 11.5px; word-break: break-all;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.input {
  width: 100%; height: 100px; box-sizing: border-box; resize: vertical; border-radius: 6px; border: 1px solid var(--border, #444); padding: 8px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 8px 10px; font-size: 12.5px; border-radius: 6px; margin-top: 10px; max-width: 400px; }
button {
  font-size: 12px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a); color: var(--text, #ddd); cursor: pointer;
}
button:hover { background: var(--btn-hover, #3a3a3a); }
</style>
