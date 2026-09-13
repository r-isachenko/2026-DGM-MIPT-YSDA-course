<script setup lang="ts">
import taxonomy from '../assets/taxonomy.svg'
import taxonomyAr from '../assets/taxonomy-ar.svg'
import taxonomyNf from '../assets/taxonomy-nf.svg'
defineProps<{ autoregressive?: boolean, normalizingFlow?: boolean }>()
</script>

<template>
  <img :src="normalizingFlow ? taxonomyNf : autoregressive ? taxonomyAr : taxonomy" alt="Generative models taxonomy">
</template>
