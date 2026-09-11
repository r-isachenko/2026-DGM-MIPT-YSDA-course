<script setup lang="ts">
import taxonomy from '../assets/taxonomy.svg'
import taxonomyAr from '../assets/taxonomy-ar.svg'
defineProps<{ autoregressive?: boolean }>()
</script>

<template>
  <img :src="autoregressive ? taxonomyAr : taxonomy">
</template>
