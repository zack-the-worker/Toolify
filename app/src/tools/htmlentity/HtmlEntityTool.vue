<script setup lang="ts">
import TwoPaneTextTool from '../../components/TwoPaneTextTool.vue'
import { encodeHtmlEntities, decodeHtmlEntities } from './logic'

const modes = [
  { value: 'encode', label: 'Encode' },
  { value: 'decode', label: 'Decode' },
]

function transform(input: string, mode: string) {
  return mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input)
}
</script>

<template>
  <TwoPaneTextTool :modes="modes" :transform="transform" />
</template>
