<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyXml, minifyXml } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyXml" :minify="minifyXml" placeholder="Paste XML here" />
</template>
