<script setup lang="ts">
import { computed } from 'vue'
import { colors as c, gaussian, path, stationaryCache, stationaryVariance, langevinConfig, histogram } from '../lib/dynamics-demos.mjs'
const props=defineProps<{mode: string, step: number, plotId: string, wide: boolean}>()
const points=computed(()=>stationaryCache[props.mode][props.step])
const variance=computed(()=>stationaryVariance(props.mode,props.step*langevinConfig.dt))
const plotWidth = computed(() => props.wide ? 540 : 360)
const px = (x: number) => 42 + (x + 6) * plotWidth.value / 12
const py = (p: number) => 300 - 100 * p
const density=(v: number)=>path(Array.from({length:401},(_,i)=>{const x=-6+12*i/400;return [x,gaussian(x,v)]}),px,py)
</script>
<template>
  <svg :viewBox="`0 0 ${plotWidth + 80} 340`" role="img" :aria-label="`${mode}: particles, empirical histogram, exact density, and target density`">
    <defs><clipPath :id="plotId"><rect x="42" y="25" :width="plotWidth" height="280" /></clipPath></defs>
    <text x="42" y="20">Particles</text><g :clip-path="`url(#${plotId})`"><circle v-for="(x,i) in points.slice(0,120)" :key="i" :cx="px(x)" :cy="40+(i%5)*7" r="2.3" :fill="c.teal" opacity=".5" /><circle :cx="px(points[0])" cy="54" r="5" :fill="c.orange" stroke="white" stroke-width="1.5" />
      <rect v-for="bin in histogram(points)" :key="bin.x" :x="px(bin.x)" :y="py(bin.density)" :width="bin.width * plotWidth / 12 - .5" :height="bin.density*100" fill="#8854c040" />
      <path :d="density(1)" fill="none" :stroke="c.muted" stroke-width="2.5" stroke-dasharray="6 4" /><path :d="density(variance)" fill="none" :stroke="c.teal" stroke-width="2.8" />
    </g>
    <line x1="42" y1="300" :x2="px(6)" y2="300" stroke="#bbced8" /><line x1="42" y1="100" x2="42" y2="300" stroke="#bbced8" />
    <text v-for="x in [-6,-3,0,3,6]" :key="x" :x="px(x)" y="326" text-anchor="middle">{{ x }}</text><text :x="px(6) + 19" y="326">x</text>
    <text v-for="p in [0,1,2]" :key="p" x="32" :y="py(p)+6" text-anchor="end">{{ p }}</text>
  </svg>
</template>
