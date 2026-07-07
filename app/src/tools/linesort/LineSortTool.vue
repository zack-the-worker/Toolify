<script setup lang="ts">
import TwoPaneTextTool from '../../components/TwoPaneTextTool.vue'
import { processLines, type LineMode } from './logic'

const modes: { value: LineMode; label: string }[] = [
  { value: 'sortAsc', label: 'Sort A→Z' },
  { value: 'sortDesc', label: 'Sort Z→A' },
  { value: 'dedupe', label: 'Dedupe' },
  { value: 'sortDedupe', label: 'Sort + Dedupe' },
  { value: 'reverse', label: 'Reverse' },
  { value: 'removeBlank', label: 'Remove Blank' },
  { value: 'shuffle', label: 'Shuffle' },
]

function transform(input: string, mode: string) {
  return processLines(input, mode as LineMode)
}
</script>

<template>
  <TwoPaneTextTool :modes="modes" :transform="transform" inputPlaceholder="One item per line" />
</template>
