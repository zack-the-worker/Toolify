<script setup lang="ts">
import TwoPaneTextTool from '../../components/TwoPaneTextTool.vue'
import { escapeBackslash, unescapeBackslash } from './logic'

const modes = [
  { value: 'escape', label: 'Escape' },
  { value: 'unescape', label: 'Unescape' },
]

function transform(input: string, mode: string) {
  return mode === 'escape' ? escapeBackslash(input) : unescapeBackslash(input)
}
</script>

<template>
  <TwoPaneTextTool :modes="modes" :transform="transform" />
</template>
