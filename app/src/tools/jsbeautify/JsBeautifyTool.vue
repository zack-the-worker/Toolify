<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyJs, minifyJs } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyJs" :minify="minifyJs" placeholder="Paste JavaScript here" />
</template>
