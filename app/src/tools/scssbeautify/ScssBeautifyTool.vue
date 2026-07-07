<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyScss, minifyScss } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyScss" :minify="minifyScss" placeholder="Paste SCSS here" />
</template>
