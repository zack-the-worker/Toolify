<script setup lang="ts">
import { ref, shallowRef, computed, watch } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { HugeiconsIcon } from '@hugeicons/vue'
import { Cancel01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons'
import VirtualList from '../../components/VirtualList.vue'
import ContextMenu from '../../components/ContextMenu.vue'
import type { ContextMenuItem } from '../../components/ContextMenu.vue'
import JsonTreeRow from './JsonTreeRow.vue'
import { useJsonTree, buildPath } from './useJsonTree'
import type { FlattenResult, FormatResult, JsonError, PathPart } from './types'
import { KIND_CLOSE, KIND_NULL, KIND_OBJECT, KIND_ARRAY } from './types'
import { SAMPLE_JSON } from './sample'

const rawInput = shallowRef('')
const sourceLabel = ref('')
const viewMode = ref<'tree' | 'text'>('tree')
const minify = ref(false)
const indent = ref(2)
const processing = ref(false)
const errorMsg = ref('')
const errorPos = ref<{ line: number; column: number } | null>(null)
const corrections = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const { lines, visibleIndices, setLines, toggle, isCollapsed, expandAll, collapseAll } = useJsonTree()

const textLines = shallowRef<string[]>([])

const byteSize = computed(() => new Blob([rawInput.value]).size)
const byteSizeLabel = computed(() => {
  const b = byteSize.value
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / (1024 * 1024)).toFixed(2)} MB`
})

let debounceHandle: ReturnType<typeof setTimeout> | undefined

function scheduleProcess() {
  clearTimeout(debounceHandle)
  const size = rawInput.value.length
  const delay = size > 1_000_000 ? 500 : 250
  debounceHandle = setTimeout(process, delay)
}

async function process() {
  if (!rawInput.value.trim()) {
    setLines([])
    textLines.value = []
    errorMsg.value = ''
    errorPos.value = null
    corrections.value = []
    return
  }
  processing.value = true
  errorMsg.value = ''
  errorPos.value = null
  corrections.value = []
  try {
    if (viewMode.value === 'tree') {
      const result = await invoke<FlattenResult>('json_parse_flatten', { input: rawInput.value })
      setLines(result.lines)
      corrections.value = result.corrections
    } else {
      const result = await invoke<FormatResult>('json_format', {
        input: rawInput.value,
        indent: indent.value,
        minify: minify.value,
      })
      textLines.value = result.text.split('\n')
      corrections.value = result.corrections
    }
  } catch (e) {
    const err = e as JsonError
    errorMsg.value = typeof err === 'string' ? err : err.message
    if (typeof err === 'object' && err.line !== undefined) {
      errorPos.value = { line: err.line, column: err.column }
    }
    setLines([])
    textLines.value = []
  } finally {
    processing.value = false
  }
}

watch(rawInput, scheduleProcess)
watch([viewMode, minify, indent], process)

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  sourceLabel.value = file.name
  processing.value = true
  const text = await file.text()
  rawInput.value = text
  target.value = ''
}

function openFilePicker() {
  fileInput.value?.click()
}

async function pasteFromClipboard() {
  sourceLabel.value = ''
  rawInput.value = await navigator.clipboard.readText()
}

function loadSample() {
  sourceLabel.value = 'sample'
  rawInput.value = SAMPLE_JSON
}

async function copyOutput() {
  if (viewMode.value === 'text') {
    await navigator.clipboard.writeText(textLines.value.join('\n'))
  } else {
    await navigator.clipboard.writeText(rawInput.value)
  }
}

function clearAll() {
  rawInput.value = ''
  sourceLabel.value = ''
  corrections.value = []
  clearQuery()
}

// --- Tree row context menu (copy path / key / value) --------------------

const ctxMenu = shallowRef<{ x: number; y: number; items: ContextMenuItem[] } | null>(null)

function onRowContextMenu(e: MouseEvent, flatIndex: number) {
  const line = lines.value[flatIndex]
  if (!line || line.kind === KIND_CLOSE) return
  const { parts, display } = buildPath(lines.value, flatIndex)
  const isContainer = line.kind === KIND_OBJECT || line.kind === KIND_ARRAY

  const items: ContextMenuItem[] = [
    { label: 'Copy Path', action: () => navigator.clipboard.writeText(display) },
    {
      label: 'Copy Key',
      disabled: line.key === null,
      action: () => navigator.clipboard.writeText(line.key ?? ''),
    },
    {
      label: isContainer ? 'Copy Value (subtree)' : 'Copy Value',
      action: () => copyLineValue(line, parts, isContainer),
    },
  ]
  ctxMenu.value = { x: e.clientX, y: e.clientY, items }
}

async function copyLineValue(
  line: { kind: number; value: string | null },
  parts: PathPart[],
  isContainer: boolean,
) {
  if (isContainer) {
    const subtree = await invoke<string>('json_get_subtree', { input: rawInput.value, path: parts })
    await navigator.clipboard.writeText(subtree)
  } else {
    await navigator.clipboard.writeText(line.kind === KIND_NULL ? 'null' : line.value ?? '')
  }
}

// --- JSONPath query bar ---------------------------------------------------

const queryPath = ref('')
const queryResult = ref<string | null>(null)
const queryError = ref('')

async function runQuery() {
  if (!queryPath.value.trim()) {
    queryResult.value = null
    queryError.value = ''
    return
  }
  try {
    queryResult.value = await invoke<string>('json_query', { input: rawInput.value, path: queryPath.value })
    queryError.value = ''
  } catch (e) {
    queryError.value = (e as JsonError).message ?? String(e)
    queryResult.value = null
  }
}

function clearQuery() {
  queryPath.value = ''
  queryResult.value = null
  queryError.value = ''
}
</script>

<template>
  <div class="json-tool">
    <div class="toolbar">
      <button @click="openFilePicker">Open File…</button>
      <input ref="fileInput" type="file" accept=".json,application/json,text/plain" hidden @change="onFileChange" />
      <button @click="pasteFromClipboard">Clipboard</button>
      <button @click="loadSample">Sample</button>
      <div class="seg">
        <button :class="{ active: viewMode === 'tree' }" @click="viewMode = 'tree'">Tree</button>
        <button :class="{ active: viewMode === 'text' }" @click="viewMode = 'text'">Text</button>
      </div>
      <template v-if="viewMode === 'text'">
        <label class="chk"><input type="checkbox" v-model="minify" /> Minify</label>
        <label v-if="!minify" class="chk">
          Indent
          <select v-model.number="indent">
            <option :value="2">2 spaces</option>
            <option :value="4">4 spaces</option>
          </select>
        </label>
      </template>
      <template v-else>
        <button @click="expandAll">Expand All</button>
        <button @click="collapseAll">Collapse All</button>
      </template>
      <div class="spacer"></div>
      <span class="badge" v-if="byteSize > 0">{{ byteSizeLabel }}<template v-if="sourceLabel"> · {{ sourceLabel }}</template></span>
      <span class="badge processing" v-if="processing">Processing…</span>
      <button @click="copyOutput" :disabled="!rawInput">Copy</button>
      <button @click="clearAll" :disabled="!rawInput">Clear</button>
    </div>

    <div v-if="errorMsg" class="error-bar">
      Invalid JSON: {{ errorMsg }}
      <template v-if="errorPos"> (line {{ errorPos.line }}, column {{ errorPos.column }})</template>
    </div>

    <div v-if="corrections.length" class="correction-bar">
      <HugeiconsIcon :icon="CheckmarkCircle02Icon" :size="14" />
      <span>
        This JSON was invalid, but we auto-corrected it: {{ corrections.join('; ') }}.
      </span>
    </div>

    <div class="body">
      <textarea
        v-model="rawInput"
        class="input-area"
        placeholder="Paste JSON here, or Open File…"
        spellcheck="false"
      ></textarea>

      <div class="output-area">
        <div v-if="lines.length === 0 && textLines.length === 0" class="empty-hint">
          {{ errorMsg ? '' : 'Output will appear here' }}
        </div>
        <VirtualList v-else-if="viewMode === 'tree'" :item-count="visibleIndices.length" :item-height="20">
          <template #default="{ index }">
            <JsonTreeRow
              :line="lines[visibleIndices[index]]"
              :collapsed="isCollapsed(visibleIndices[index])"
              @toggle="toggle(visibleIndices[index])"
              @contextmenu="onRowContextMenu($event, visibleIndices[index])"
            />
          </template>
        </VirtualList>
        <VirtualList v-else :item-count="textLines.length" :item-height="18">
          <template #default="{ index }">
            <div class="text-line">{{ textLines[index] }}</div>
          </template>
        </VirtualList>
      </div>
    </div>

    <div v-if="queryResult !== null || queryError" class="query-result-panel">
      <button class="query-close" @click="clearQuery"><HugeiconsIcon :icon="Cancel01Icon" :size="14" /></button>
      <pre v-if="queryResult !== null" class="query-result-text">{{ queryResult }}</pre>
      <div v-else class="query-error-text">{{ queryError }}</div>
    </div>
    <div class="query-bar">
      <input
        v-model="queryPath"
        class="query-input"
        placeholder="JSON Path: (e.g., $.store.book[*].author)"
        spellcheck="false"
        @keyup.enter="runQuery"
      />
      <button @click="runQuery" :disabled="!rawInput">Run</button>
    </div>

    <ContextMenu
      v-if="ctxMenu"
      :x="ctxMenu.x"
      :y="ctxMenu.y"
      :items="ctxMenu.items"
      @close="ctxMenu = null"
    />
  </div>
</template>

<style scoped>
.json-tool {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid var(--border, #333);
  flex-wrap: wrap;
}
.seg {
  display: flex;
  border: 1px solid var(--border, #444);
  border-radius: 6px;
  overflow: hidden;
}
.seg button {
  border: none;
  border-radius: 0;
}
.seg button.active {
  background: var(--accent, #3a72ff);
  color: white;
}
.spacer {
  flex: 1;
}
.badge {
  font-size: 12px;
  color: var(--muted, #888);
}
.badge.processing {
  color: var(--accent, #3a72ff);
}
.chk {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.error-bar {
  background: #4a1f1f;
  color: #ff9a9a;
  padding: 6px 10px;
  font-size: 12px;
  font-family: monospace;
}
.correction-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1f3a2a;
  color: #7ee787;
  padding: 6px 10px;
  font-size: 12px;
}
.body {
  flex: 1;
  min-height: 0;
  display: flex;
}
.input-area {
  flex: 0 0 38%;
  resize: none;
  border: none;
  border-right: 1px solid var(--border, #333);
  outline: none;
  padding: 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  background: var(--input-bg, #1e1e1e);
  color: var(--text, #ddd);
}
.output-area {
  flex: 1;
  min-height: 0;
  min-width: 0;
}
.empty-hint {
  padding: 10px;
  color: var(--muted, #666);
  font-size: 12.5px;
}
.text-line {
  white-space: pre;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  padding-left: 8px;
}
.query-result-panel {
  position: relative;
  max-height: 220px;
  overflow-y: auto;
  border-top: 1px solid var(--border, #333);
  background: var(--input-bg, #1e1e1e);
  padding: 8px 10px;
}
.query-result-text {
  margin: 0;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  color: var(--string-color, #ce9178);
  white-space: pre-wrap;
  word-break: break-word;
}
.query-error-text {
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  color: #ff9a9a;
}
.query-close {
  position: sticky;
  float: right;
  top: 0;
  border: none;
  background: transparent;
  color: var(--muted, #888);
  cursor: pointer;
  padding: 2px 4px;
}
.query-bar {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid var(--border, #333);
}
.query-input {
  flex: 1;
  border-radius: 6px;
  border: 1px solid var(--border, #444);
  background: var(--input-bg, #1e1e1e);
  color: var(--text, #ddd);
  padding: 6px 10px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  outline: none;
}
button {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--border, #444);
  background: var(--btn-bg, #2a2a2a);
  color: var(--text, #ddd);
  cursor: pointer;
}
button:hover:not(:disabled) {
  background: var(--btn-hover, #3a3a3a);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
