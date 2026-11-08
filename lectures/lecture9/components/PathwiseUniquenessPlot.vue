<script setup lang="ts">
import { colors, normalGenerator, path } from '../lib/dynamics-demos.mjs'

defineProps<{ shared?: boolean }>()

const px = (t: number) => 48 + 454 * t
const py = (x: number) => 95 - 37 * x

// Exact grid values for x(t) = x(0) + t/2 + w(t).
function solutionCurve(seed: number, initial = 0) {
  const normal = normalGenerator(seed)
  const steps = 128
  const dt = 1 / steps
  const points = [[0, initial]]
  let w = 0
  for (let k = 1; k <= steps; k++) {
    const t = k * dt
    w += Math.sqrt(dt) * normal()
    points.push([t, initial + t / 2 + w])
  }
  return path(points, px, py)
}

const first = solutionCurve(29)
const independent = solutionCurve(28)
const shifted = solutionCurve(29, -1)
const yellow = '#c79500'
</script>

<template>
  <svg class="trajectory-plot" viewBox="0 0 540 205" role="img"
    :aria-label="shared ? 'Teal starts at zero and yellow at minus one. The same Brownian increments keep the two solutions one unit apart.' : 'The solid and dashed solutions start together and separate under different Brownian paths.'">
    <g v-for="tick in [-2, 0, 2]" :key="tick">
      <line x1="48" x2="502" :y1="py(tick)" :y2="py(tick)" :stroke="colors.grid" />
      <text x="37" :y="py(tick) + 5" text-anchor="end">{{ tick }}</text>
    </g>
    <path d="M48 21 V169 H502" fill="none" :stroke="colors.muted" />
    <text x="3" y="16">x(t)</text>
    <g v-for="tick in [0, 0.5, 1]" :key="tick">
      <line :x1="px(tick)" :x2="px(tick)" y1="169" y2="174" :stroke="colors.muted" />
      <text :x="px(tick)" y="193" text-anchor="middle">{{ tick }}</text>
    </g>
    <text x="525" y="193">t</text>
    <g fill="none" stroke-linejoin="round">
      <path :d="first" :stroke="colors.teal" stroke-width="4.8" />
      <path :d="shared ? shifted : independent" :stroke="shared ? yellow : colors.orange" :stroke-width="shared ? 3.5 : 2.6" stroke-dasharray="8 5" />
    </g>
    <circle :cx="px(0)" :cy="py(0)" r="4" :fill="shared ? colors.teal : colors.ink" />
    <g v-if="shared">
      <circle :cx="px(0)" :cy="py(-1)" r="4" :fill="yellow" />
      <text x="37" :y="py(-1) + 5" text-anchor="end">−1</text>
    </g>
  </svg>
</template>

<style scoped>
.trajectory-plot { display: block; width: 100%; height: 205px; }
.trajectory-plot text { font: 18px Arial, sans-serif; fill: #587083; }
</style>
