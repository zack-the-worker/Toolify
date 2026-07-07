<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { CheckmarkCircle02Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { decodeJwt, verifyHs256 } from './logic'

const token = ref('')
const secret = ref('')
const verifyResult = ref<'unknown' | 'valid' | 'invalid'>('unknown')

const decoded = computed(() => {
  if (!token.value.trim()) return null
  try {
    return decodeJwt(token.value.trim())
  } catch {
    return null
  }
})

const error = computed(() => (token.value.trim() && !decoded.value ? 'Not a valid JWT' : ''))

watch([token, secret], async () => {
  verifyResult.value = 'unknown'
  if (!decoded.value || !secret.value) return
  if (decoded.value.header.alg !== 'HS256') return
  try {
    const ok = await verifyHs256(token.value.trim(), secret.value)
    verifyResult.value = ok ? 'valid' : 'invalid'
  } catch {
    verifyResult.value = 'unknown'
  }
})
</script>

<template>
  <div class="tool">
    <div class="body">
      <textarea v-model="token" class="input-area" placeholder="Paste a JWT" spellcheck="false"></textarea>
      <div class="output-area">
        <div v-if="error" class="error-bar">{{ error }}</div>
        <template v-if="decoded">
          <div class="section">
            <h3>Header</h3>
            <pre class="json-block">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
          </div>
          <div class="section">
            <h3>Payload</h3>
            <pre class="json-block">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
          </div>
          <div class="section">
            <h3>Verify Signature (HS256)</h3>
            <input v-model="secret" class="secret-input" placeholder="Secret" spellcheck="false" />
            <div v-if="secret" class="verify-badge" :class="verifyResult">
              <template v-if="verifyResult === 'valid'">
                <HugeiconsIcon :icon="CheckmarkCircle02Icon" :size="14" /> Signature valid
              </template>
              <template v-else-if="verifyResult === 'invalid'">
                <HugeiconsIcon :icon="Cancel01Icon" :size="14" /> Signature invalid
              </template>
              <template v-else>Checking…</template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; height: 100%; }
.body { flex: 1; display: flex; min-height: 0; }
.input-area {
  flex: 0 0 40%; resize: none; border: none; border-right: 1px solid var(--border, #333); outline: none; padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px;
  background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
}
.output-area { flex: 1; overflow-y: auto; padding: 12px; }
.section { margin-bottom: 16px; }
h3 { font-size: 12px; color: var(--muted, #888); text-transform: uppercase; letter-spacing: 0.04em; margin: 0 0 6px; }
.json-block {
  margin: 0; padding: 10px; border-radius: 6px; background: var(--btn-bg, #2a2a2a);
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; white-space: pre-wrap; word-break: break-word;
}
.secret-input {
  width: 100%; max-width: 320px; box-sizing: border-box; padding: 6px 8px; border-radius: 6px;
  border: 1px solid var(--border, #444); background: var(--input-bg, #1e1e1e); color: var(--text, #ddd);
  font-family: 'SF Mono', Menlo, Consolas, monospace; font-size: 12.5px; margin-bottom: 8px;
}
.verify-badge { display: flex; align-items: center; gap: 4px; font-size: 12.5px; padding: 4px 0; }
.verify-badge.valid { color: #7ee787; }
.verify-badge.invalid { color: #ff9a9a; }
.error-bar { background: #4a1f1f; color: #ff9a9a; padding: 6px 10px; font-size: 12px; border-radius: 6px; margin-bottom: 12px; }
</style>
