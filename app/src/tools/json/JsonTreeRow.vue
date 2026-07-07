<script setup lang="ts">
import { computed } from 'vue'
import { HugeiconsIcon } from '@hugeicons/vue'
import { ArrowRight01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import type { JsonLine } from './types'
import { KIND_OBJECT, KIND_ARRAY, KIND_STRING, KIND_NUMBER, KIND_BOOL, KIND_NULL, KIND_CLOSE } from './types'

const props = defineProps<{
  line: JsonLine
  collapsed: boolean
}>()

const emit = defineEmits<{ toggle: []; contextmenu: [MouseEvent] }>()

const isContainer = computed(() => props.line.kind === KIND_OBJECT || props.line.kind === KIND_ARRAY)
const openBracket = computed(() => (props.line.kind === KIND_OBJECT ? '{' : '['))
const closeBracketForContainer = computed(() => (props.line.kind === KIND_OBJECT ? '}' : ']'))

const valueClass = computed(() => {
  switch (props.line.kind) {
    case KIND_STRING: return 'v-string'
    case KIND_NUMBER: return 'v-number'
    case KIND_BOOL: return 'v-bool'
    case KIND_NULL: return 'v-null'
    default: return ''
  }
})

const displayValue = computed(() => {
  const l = props.line
  if (l.kind === KIND_STRING) return JSON.stringify(l.value)
  if (l.kind === KIND_NULL) return 'null'
  return l.value ?? ''
})
</script>

<template>
  <div
    class="row"
    :style="{ paddingLeft: line.depth * 16 + 4 + 'px' }"
    @contextmenu.prevent="emit('contextmenu', $event)"
  >
    <span
      v-if="isContainer && line.subtreeSize > 0"
      class="toggle"
      @click="emit('toggle')"
    >
      <HugeiconsIcon :icon="collapsed ? ArrowRight01Icon : ArrowDown01Icon" :size="12" />
    </span>
    <span v-else class="toggle-spacer"></span>

    <span v-if="line.key !== null" class="key">"{{ line.key }}"<span class="colon">: </span></span>

    <template v-if="line.kind === KIND_CLOSE">
      <span class="bracket">{{ line.bracket }}</span>
    </template>
    <template v-else-if="isContainer">
      <span class="bracket">{{ openBracket }}</span>
      <span v-if="collapsed" class="collapsed-summary">
        {{ line.childrenCount }} {{ line.childrenCount === 1 ? 'item' : 'items' }}
        <span class="bracket">{{ closeBracketForContainer }}</span>
      </span>
    </template>
    <template v-else>
      <span :class="valueClass">{{ displayValue }}</span>
    </template>

    <span v-if="!line.isLast" class="comma">,</span>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  font-size: 12.5px;
  height: 100%;
  overflow: hidden;
}
.row:hover {
  background: var(--row-hover, rgba(255, 255, 255, 0.04));
}
.toggle {
  width: 14px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--muted, #888);
  user-select: none;
}
.toggle-spacer {
  width: 14px;
  flex-shrink: 0;
}
.key {
  color: var(--key-color, #9cdcfe);
  margin-right: 2px;
}
.colon {
  color: var(--muted, #888);
}
.bracket {
  color: var(--muted, #ccc);
}
.comma {
  color: var(--muted, #888);
}
.collapsed-summary {
  color: var(--muted, #888);
  margin-left: 4px;
  font-style: italic;
}
.v-string { color: var(--string-color, #ce9178); }
.v-number { color: var(--number-color, #b5cea8); }
.v-bool { color: var(--bool-color, #569cd6); }
.v-null { color: var(--null-color, #808080); font-style: italic; }
</style>
