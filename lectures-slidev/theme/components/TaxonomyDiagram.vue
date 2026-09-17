<script setup lang="ts">
import taxonomy from '../assets/taxonomy.svg'
import taxonomyAr from '../assets/taxonomy-ar.svg'
import taxonomyNf from '../assets/taxonomy-nf.svg'
import taxonomyVae from '../assets/taxonomy-vae.svg'
import taxonomyGan from '../assets/taxonomy-gan.svg'
import taxonomySm from '../assets/taxonomy-sm.svg'
import taxonomyDdpm from '../assets/taxonomy-ddpm.svg'
import taxonomyOde from '../assets/taxonomy-ode.svg'
import taxonomySde from '../assets/taxonomy-sde.svg'
import taxonomyFm from '../assets/taxonomy-fm.svg'
import taxonomyDd from '../assets/taxonomy-dd.svg'
import taxonomyAbsorb from '../assets/taxonomy-absorb.svg'
defineProps<{ autoregressive?: boolean, normalizingFlow?: boolean, variationalAutoencoder?: boolean, generativeAdversarialNetwork?: boolean, scoreMatching?: boolean, denoisingDiffusion?: boolean, continuousNormalizingFlow?: boolean, sdeBasedDiffusion?: boolean, flowMatching?: boolean, discreteDiffusion?: boolean, absorbingDiffusion?: boolean }>()
</script>

<template>
  <img :src="absorbingDiffusion ? taxonomyAbsorb : discreteDiffusion ? taxonomyDd : flowMatching ? taxonomyFm : sdeBasedDiffusion ? taxonomySde : continuousNormalizingFlow ? taxonomyOde : denoisingDiffusion ? taxonomyDdpm : scoreMatching ? taxonomySm : generativeAdversarialNetwork ? taxonomyGan : variationalAutoencoder ? taxonomyVae : normalizingFlow ? taxonomyNf : autoregressive ? taxonomyAr : taxonomy" alt="Generative models taxonomy">
</template>
