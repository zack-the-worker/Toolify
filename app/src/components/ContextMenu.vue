<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface ContextMenuItem {
  label: string
  action: () => void
  disabled?: boolean
}

const props = defineProps<{
  x: number
  y: number
  items: ContextMenuItem[]
}>()

const emit = defineEmits<{ close: [] }>()
const menuRef = ref<HTMLDivElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) emit('close')
}

onMounted(() => {
  document.addEventListener('mousedown', onDocClick, true)
  document.addEventListener('contextmenu', onDocClick, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick, true)
  document.removeEventListener('contextmenu', onDocClick, true)
})

function run(item: ContextMenuItem) {
  if (item.disabled) return
  item.action()
  emit('close')
}
</script>

<template>
  <div ref="menuRef" class="ctx-menu" :style="{ left: x + 'px', top: y + 'px' }">
    <button v-for="(item, i) in props.items" :key="i" :disabled="item.disabled" @click="run(item)">
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
.ctx-menu {
  position: fixed;
  z-index: 1000;
  background: var(--btn-bg, #2a2a2a);
  border: 1px solid var(--border, #444);
  border-radius: 8px;
  padding: 4px;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
}
.ctx-menu button {
  all: unset;
  padding: 6px 10px;
  font-size: 12.5px;
  border-radius: 5px;
  cursor: pointer;
  color: var(--text, #ddd);
}
.ctx-menu button:hover:not(:disabled) {
  background: var(--btn-hover, #3a3a3a);
}
.ctx-menu button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
