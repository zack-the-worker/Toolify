<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    itemCount: number
    itemHeight: number
    overscan?: number
  }>(),
  { overscan: 12 },
)

const containerRef = ref<HTMLDivElement | null>(null)
const scrollTop = shallowRef(0)
const viewportHeight = shallowRef(0)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!containerRef.value) return
  viewportHeight.value = containerRef.value.clientHeight
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      viewportHeight.value = entry.contentRect.height
    }
  })
  resizeObserver.observe(containerRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function onScroll() {
  if (containerRef.value) scrollTop.value = containerRef.value.scrollTop
}

const totalHeight = computed(() => props.itemCount * props.itemHeight)

const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan),
)

const endIndex = computed(() =>
  Math.min(
    props.itemCount,
    Math.ceil((scrollTop.value + viewportHeight.value) / props.itemHeight) + props.overscan,
  ),
)

const offsetY = computed(() => startIndex.value * props.itemHeight)

const visibleRange = computed(() => {
  const arr: number[] = []
  for (let i = startIndex.value; i < endIndex.value; i++) arr.push(i)
  return arr
})

defineExpose({ scrollToIndex: (i: number) => {
  if (containerRef.value) containerRef.value.scrollTop = i * props.itemHeight
} })
</script>

<template>
  <div ref="containerRef" class="v-list" @scroll="onScroll">
    <div class="v-list-spacer" :style="{ height: totalHeight + 'px' }">
      <div class="v-list-window" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="i in visibleRange"
          :key="i"
          class="v-list-row"
          :style="{ height: itemHeight + 'px' }"
        >
          <slot :index="i" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
  position: relative;
}
.v-list-spacer {
  position: relative;
  width: 100%;
}
.v-list-window {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}
.v-list-row {
  width: 100%;
  box-sizing: border-box;
}
</style>
