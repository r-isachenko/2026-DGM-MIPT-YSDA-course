<script setup lang="ts">
import taxonomy from '../assets/taxonomy.svg'
import taxonomyAr from '../assets/taxonomy-ar.svg'
import taxonomyNf from '../assets/taxonomy-nf.svg'
import taxonomyVae from '../assets/taxonomy-vae.svg'
import taxonomyGan from '../assets/taxonomy-gan.svg'
import taxonomySm from '../assets/taxonomy-sm.svg'
import taxonomyDdpm from '../assets/taxonomy-ddpm.svg'
defineProps<{ autoregressive?: boolean, normalizingFlow?: boolean, variationalAutoencoder?: boolean, generativeAdversarialNetwork?: boolean, scoreMatching?: boolean, denoisingDiffusion?: boolean }>()
</script>

<template>
  <img :src="denoisingDiffusion ? taxonomyDdpm : scoreMatching ? taxonomySm : generativeAdversarialNetwork ? taxonomyGan : variationalAutoencoder ? taxonomyVae : normalizingFlow ? taxonomyNf : autoregressive ? taxonomyAr : taxonomy" alt="Generative models taxonomy">
</template>
