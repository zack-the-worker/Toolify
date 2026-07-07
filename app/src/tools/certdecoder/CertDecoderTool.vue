<script setup lang="ts">
import { ref, watch } from 'vue'
import { invoke } from '@tauri-apps/api/core'

interface CertificateInfo {
  subject: string
  issuer: string
  serialNumber: string
  signatureAlgorithm: string
  notBefore: string
  notAfter: string
  publicKeyAlgorithm: string
  publicKeyBits: number | null
  version: number
  isCa: boolean
}

const input = ref('')
const info = ref<CertificateInfo | null>(null)
const error = ref('')

async function process() {
  if (!input.value.trim()) {
    info.value = null
    error.value = ''
    return
  }
  try {
    info.value = await invoke<CertificateInfo>('decode_certificate', { pemInput: input.value })
    error.value = ''
  } catch (e) {
    error.value = typeof e === 'string' ? e : (e as { message?: string }).message ?? String(e)
    info.value = null
  }
}
watch(input, process)
</script>

<template>
  <div class="tool">
    <div class="body">
      <textarea
        v-model="input"
        class="input-area"
        placeholder="Paste a PEM-encoded X.509 certificate (-----BEGIN CERTIFICATE-----)"
        spellcheck="false"
      ></textarea>
      <div class="output-area">
        <div v-if="error" class="error-bar">{{ error }}</div>
        <template v-if="info">
          <div class="row"><span class="label">Subject</span><code>{{ info.subject }}</code></div>
          <div class="row"><span class="label">Issuer</span><code>{{ info.issuer }}</code></div>
          <div class="row"><span class="label">Serial Number</span><code>{{ info.serialNumber }}</code></div>
          <div class="row"><span class="label">Signature Algorithm</span><code>{{ info.signatureAlgorithm }}</code></div>
          <div class="row"><span class="label">Valid From</span><code>{{ info.notBefore }}</code></div>
          <div class="row"><span class="label">Valid To</span><code>{{ info.notAfter }}</code></div>
          <div class="row"><span class="label">Public Key</span><code>{{ info.publicKeyAlgorithm }}<template v-if="info.publicKeyBits"> ({{ info.publicKeyBits }} bits)</template></code></div>
          <div class="row"><span class="label">Version</span><code>v{{ info.version + 1 }}</code></div>
          <div class="row"><span class="label">CA Certificate</span><code>{{ info.isCa ? 'Yes' : 'No' }}</code></div>
        </template>
      </div>
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
.output-area { flex: 1; padding: 12px; overflow-y: auto; }
.row { display: flex; gap: 12px; padding: 8px 10px; border-radius: 6px; margin-bottom: 4px; }
.row:nth-child(odd) { background: var(--btn-bg, #2a2a2a); }
.label { width: 150px; color: var(--muted, #888); font-size: 12px; flex-shrink: 0; }
code { font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; word-break: break-all; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 8px 10px; font-size: 12.5px; border-radius: 6px; margin-bottom: 12px; }
</style>
