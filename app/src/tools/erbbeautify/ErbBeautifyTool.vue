<script setup lang="ts">
import BeautifyMinifyTool from '../../components/BeautifyMinifyTool.vue'
import { beautifyErb, minifyErb } from './logic'
</script>

<template>
  <BeautifyMinifyTool :beautify="beautifyErb" :minify="minifyErb" placeholder="Paste ERB template here" />
</template>
