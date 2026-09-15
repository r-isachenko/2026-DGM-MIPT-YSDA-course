<script setup lang="ts">
import taxonomy from '../assets/taxonomy.svg'
import taxonomyAr from '../assets/taxonomy-ar.svg'
import taxonomyNf from '../assets/taxonomy-nf.svg'
import taxonomyVae from '../assets/taxonomy-vae.svg'
defineProps<{ autoregressive?: boolean, normalizingFlow?: boolean, variationalAutoencoder?: boolean }>()
</script>

<template>
  <img :src="variationalAutoencoder ? taxonomyVae : normalizingFlow ? taxonomyNf : autoregressive ? taxonomyAr : taxonomy" alt="Generative models taxonomy">
</template>
