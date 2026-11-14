<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { wienerState } from '../lib/demo-state'
import { colors, normalGenerator, path } from '../lib/dynamics-demos.mjs'
import '../lib/demos.css'

const props = defineProps<{ staticView?: boolean }>()
const { isPrintMode } = useNav()
const showFullPaths = computed(() => props.staticView || isPrintMode.value)
const duration = 5
const steps = 500
const dt = duration / steps
const incrementScale = Math.sqrt(dt)
const normal = normalGenerator(925)
const lineColors = [colors.teal, colors.purple, colors.orange, colors.ink, '#568444']

const paths = lineColors.map(() => {
  let value = 0
  const points = [[0, value]]
  for (let step = 1; step <= steps; step++) {
    value += incrementScale * normal()
    points.push([step * dt, value])
  }
  return points
})

const limit = Math.ceil(Math.max(...paths.flat().map(([, value]) => Math.abs(value))))
const px = (time: number) => 48 + 480 * time / duration
const py = (value: number) => 120 - 96 * value / limit
const step = computed(() => showFullPaths.value ? steps : Math.round(wienerState.time / dt))
const time = computed(() => step.value * dt)
const curves = computed(() => paths.map(points => ({
  d: path(points.slice(0, step.value + 1), px, py),
  y: py(points[step.value][1]),
})))
</script>

<template>
  <DemoPanel class="l9-demo wiener-paths" data-demo="wiener-paths">
    <svg viewBox="0 0 554 249" role="img" aria-label="Five sample paths of one-dimensional Brownian motion up to the selected time">
      <text x="7" y="15" font-style="italic">w(t)</text>
      <g v-for="value in [-limit, 0, limit]" :key="value">
        <line x1="48" x2="528" :y1="py(value)" :y2="py(value)" :stroke="colors.grid" />
        <text x="38" :y="py(value) + 5" text-anchor="end">{{ value }}</text>
      </g>
      <path d="M48 24 V216 H528" fill="none" :stroke="colors.muted" />
      <g v-for="tick in [0, 1, 2, 3, 4, 5]" :key="tick">
        <line :x1="px(tick)" :x2="px(tick)" y1="216" y2="220" :stroke="colors.muted" />
        <text :x="px(tick)" y="239" text-anchor="middle">{{ tick }}</text>
      </g>
      <text x="548" y="239" font-style="italic">t</text>
      <line v-if="!showFullPaths" :x1="px(time)" :x2="px(time)" y1="24" y2="216"
        :stroke="colors.muted" stroke-dasharray="4 5" />
      <g v-for="(curve, i) in curves" :key="i" :stroke="lineColors[i]">
        <path :d="curve.d" fill="none" stroke-width="1.9" stroke-linejoin="round" />
        <circle :cx="px(time)" :cy="curve.y" r="3.1" :fill="lineColors[i]" />
      </g>
    </svg>
    <div v-if="!showFullPaths" class="demo-controls">
      <label>Time <input v-model.number="wienerState.time" type="range"
        min="0" :max="duration" :step="dt" aria-label="Brownian motion time" />
        <output>{{ time.toFixed(2) }}</output>
      </label>
    </div>
  </DemoPanel>
</template>

<style scoped>
.wiener-paths .demo-controls { justify-content: center; margin: 4px 0 0; }
.wiener-paths input { width: 220px; }
</style>
