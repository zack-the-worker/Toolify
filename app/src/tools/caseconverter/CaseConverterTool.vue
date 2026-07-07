<script setup lang="ts">
import TwoPaneTextTool from '../../components/TwoPaneTextTool.vue'
import { convertCase, type CaseMode } from './logic'

const modes: { value: CaseMode; label: string }[] = [
  { value: 'camel', label: 'camelCase' },
  { value: 'pascal', label: 'PascalCase' },
  { value: 'snake', label: 'snake_case' },
  { value: 'kebab', label: 'kebab-case' },
  { value: 'constant', label: 'CONSTANT_CASE' },
  { value: 'title', label: 'Title Case' },
  { value: 'lower', label: 'lower case' },
  { value: 'upper', label: 'UPPER CASE' },
]

function transform(input: string, mode: string) {
  return convertCase(input, mode as CaseMode)
}
</script>

<template>
  <TwoPaneTextTool :modes="modes" :transform="transform" />
</template>
