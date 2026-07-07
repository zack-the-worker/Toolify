<script setup lang="ts">
import TwoPaneTextTool from '../../components/TwoPaneTextTool.vue'
import { asciiToHex, hexToAscii } from './logic'

const modes = [
  { value: 'toHex', label: 'ASCII → Hex' },
  { value: 'toAscii', label: 'Hex → ASCII' },
]

function transform(input: string, mode: string) {
  return mode === 'toHex' ? asciiToHex(input) : hexToAscii(input)
}
</script>

<template>
  <TwoPaneTextTool :modes="modes" :transform="transform" />
</template>
