<script setup lang="ts">
import { computed } from 'vue'
import { linearMap } from '../lib/flow-models.mjs'
const props = withDefaults(defineProps<{
  points?: number[][]; square?: boolean; stretch?: number; shear?: number;
  color?: string; label: string; range?: number; highlighted?: number;
  previousPoints?: number[][]; fixedAxis?: number
}>(), { stretch: 1, shear: 0, color: '#007f82', range: 2, highlighted: -1 })
const px = (x: number) => 150 + x * 125 / props.range
const py = (y: number) => 150 - y * 125 / props.range
const ticks = computed(() => Array.from({ length: 2 * Math.floor(props.range) + 1 }, (_, i) => i - Math.floor(props.range)))
const polygon = computed(() => [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]].map(p => linearMap(p, props.stretch, props.shear)).map(([x, y]) => `${px(x)},${py(y)}`).join(' '))
const grid = computed(() => [-.5, -.25, 0, .25, .5].flatMap(t => [[[t, -.5], [t, .5]], [[-.5, t], [.5, t]]]).map(line => line.map(p => linearMap(p, props.stretch, props.shear))))
</script>
<template>
  <svg viewBox="0 0 300 300" role="img" :aria-label="label">
    <line v-for="t in ticks" :key="`h${t}`" x1="18" :y1="py(t)" x2="282" :y2="py(t)" :stroke="t === 0 ? '#9aadb9' : '#e7edf1'" />
    <line v-for="t in ticks" :key="`v${t}`" :x1="px(t)" y1="18" :x2="px(t)" y2="282" :stroke="t === 0 ? '#9aadb9' : '#e7edf1'" />
    <template v-if="square">
      <rect :x="px(-.5)" :y="py(.5)" :width="125 / range" :height="125 / range" fill="none" stroke="#aabac5" stroke-dasharray="4 4" />
      <polygon :points="polygon" :fill="color" fill-opacity=".15" :stroke="color" stroke-width="2.5" />
      <line v-for="(line, i) in grid" :key="i" :x1="px(line[0][0])" :y1="py(line[0][1])" :x2="px(line[1][0])" :y2="py(line[1][1])" :stroke="color" stroke-opacity=".45" />
    </template>
    <template v-else>
      <template v-if="previousPoints && points">
        <line v-if="fixedAxis === 0" class="fixed-coordinate-guide" :x1="px(previousPoints[0][0])" y1="18" :x2="px(previousPoints[0][0])" y2="282" stroke="#e17838" stroke-dasharray="5 5" stroke-width="1.5" />
        <line v-if="fixedAxis === 1" class="fixed-coordinate-guide" x1="18" :y1="py(previousPoints[0][1])" x2="282" :y2="py(previousPoints[0][1])" stroke="#e17838" stroke-dasharray="5 5" stroke-width="1.5" />
        <template v-for="i in [0, 8, 18, 30, 55, 80, 125, 159]" :key="`motion${i}`">
          <line v-if="previousPoints[i] && points[i]" class="motion-trail" :x1="px(previousPoints[i][0])" :y1="py(previousPoints[i][1])" :x2="px(points[i][0])" :y2="py(points[i][1])" stroke="#e17838" :stroke-width="i === 0 ? 2.5 : 1.3" :stroke-opacity="i === 0 ? 1 : .6" />
          <circle v-if="previousPoints[i]" class="flow-origin" :cx="px(previousPoints[i][0])" :cy="py(previousPoints[i][1])" :r="i === 0 ? 5.5 : 3.5" fill="white" stroke="#e17838" stroke-width="1.4" />
        </template>
      </template>
      <circle v-for="(p, i) in points" :key="i" class="flow-point" :cx="px(p[0])" :cy="py(p[1])" r="2.9" :fill="color" fill-opacity=".65" />
      <circle v-if="highlighted >= 0 && points?.[highlighted]" class="flow-highlight" :cx="px(points[highlighted][0])" :cy="py(points[highlighted][1])" r="5.5" fill="#e17838" stroke="white" stroke-width="1.5" />
    </template>
    <text v-for="t in ticks.filter(t => t !== 0)" :key="t" :x="px(t)" y="296" text-anchor="middle">{{ t }}</text>
    <text v-for="t in ticks.filter(t => t !== 0)" :key="`y${t}`" x="8" :y="py(t) + 4" text-anchor="middle">{{ t }}</text>
  </svg>
</template>
<style scoped>
svg { display: block; width: 100%; height: 270px; overflow: visible; }
text { font: 13px Arial, sans-serif; fill: #587083; }
polygon, circle, line { transition: all 350ms ease; }
@media (prefers-reduced-motion: reduce), print { polygon, circle, line { transition: none; } }
</style>
