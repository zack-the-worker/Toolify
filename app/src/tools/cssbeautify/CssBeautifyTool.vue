<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyCss, minifyCss } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyCss" :minify="minifyCss" placeholder="Paste CSS here" />
</template>
