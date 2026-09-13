<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'
import macros from '../../theme/setup/macros.json'
const props = defineProps<{ formula: string }>()
const html = computed(() => katex.renderToString(props.formula, { macros: { ...macros }, strict: 'error', throwOnError: true }))
</script>
<template><span v-html="html" /></template>
