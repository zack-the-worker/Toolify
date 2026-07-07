<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyLess, minifyLess } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyLess" :minify="minifyLess" placeholder="Paste LESS here" />
</template>
