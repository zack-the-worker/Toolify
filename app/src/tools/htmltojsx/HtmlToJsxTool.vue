<script setup lang="ts">
import TwoPaneTextTool from '../../components/TwoPaneTextTool.vue'
import { htmlToJsx } from './logic'

function transform(input: string) {
  return htmlToJsx(input)
}
</script>

<template>
  <TwoPaneTextTool :transform="transform" inputPlaceholder="Paste HTML here" outputPlaceholder="JSX" />
</template>
