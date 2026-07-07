<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyHtml, minifyHtml } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyHtml" :minify="minifyHtml" placeholder="Paste HTML here" />
</template>
