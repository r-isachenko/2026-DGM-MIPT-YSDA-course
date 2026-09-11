<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { seededRandom } from '../lib/binary-models.mjs'
const { isPrintMode } = useNav()
// Fixed categorical source, shaped like the original illustration. Every size
// uses a prefix of the same seeded observations; sampling the fitted model uses
// a separate random stream and never changes those observations.
const weights = [0, 1, 3, 9, 18, 30, 37, 31, 17, 12, 10, 7, 4, 3, 1, 0, 3, 8, 6, 9, 10, 11, 10, 8, 13, 6, 6, 10, 5, 13, 4, 5, 3, 2, 2, 3, 1, 1, 0, 1]
const weightSum = weights.reduce((sum, n) => sum + n, 0)
const dataRandom = seededRandom(2026)
const observations = Array.from({ length: 10000 }, () => {
  let draw = dataRandom() * weightSum
  return weights.findIndex(n => (draw -= n) < 0)
})
const sizes = [10, 100, 1000, 10000]
const size = ref(1000)
const total = computed(() => isPrintMode.value ? 1000 : size.value)
const counts = computed(() => {
  const bins = Array(weights.length).fill(0)
  for (const k of observations.slice(0, total.value)) bins[k]++
  return bins
})
// Keep the same vertical scale at every sample size.
const yMax = Math.max(...sizes.map(n => {
  const bins = Array(weights.length).fill(0)
  for (const k of observations.slice(0, n)) bins[k]++
  return Math.max(...bins) / n
}))
const axisMax = Math.ceil(yMax / .1) * .1
const yScale = 105 / axisMax
const selected = ref<number | null>(null)
const active = computed(() => isPrintMode.value ? null : selected.value)
let random = seededRandom(41)
function sample() {
  let draw = random() * total.value
  selected.value = counts.value.findIndex(n => (draw -= n) < 0)
}
function chooseSize(n: number) { size.value = n; selected.value = null; random = seededRandom(41) }
function reset() { chooseSize(1000) }
</script>
<template>
  <DemoPanel data-demo="histogram" :data-sample-size="total" class="compact-histogram">
    <svg viewBox="0 0 320 152" role="img" aria-label="Empirical categorical distribution; orange marks the sampled category">
      <line x1="34" y1="122" x2="314" y2="122" stroke="#9eafbd" />
      <line x1="34" y1="12" x2="34" y2="122" stroke="#9eafbd" />
      <text v-for="p in [0, axisMax / 2, axisMax]" :key="p" x="28" :y="126 - p * yScale" text-anchor="end">{{ p.toFixed(2) }}</text>
      <rect v-for="(n, k) in counts" :key="k" :data-count="n" :x="35 + k * 6.9" :y="122 - n / total * yScale" width="6.9" :height="n / total * yScale" :fill="k === active ? '#e17838' : '#007f82'" />
      <text v-for="k in [5, 10, 20, 30, 40]" :key="k" :x="35 + (k - .5) * 6.9" y="139" text-anchor="middle">{{ k }}</text>
      <text x="308" y="151">x</text><text x="35" y="10">p(x)</text>
    </svg>
    <div class="histogram-readout" aria-live="polite">
      <span v-if="active !== null">x = {{ active + 1 }} · {{ counts[active] }} / {{ total }} = {{ (counts[active] / total).toFixed(3) }}</span>
      <span v-else>n = {{ total }} observations</span>
    </div>
    <div class="demo-controls histogram-controls size-controls" :style="{ visibility: isPrintMode ? 'hidden' : 'visible' }" role="group" aria-label="Number of observations">
      <button v-for="n in sizes" :key="n" :aria-pressed="total === n" :class="{ primary: total === n }" @click="chooseSize(n)">{{ n }}</button>
    </div>
    <div class="demo-controls histogram-controls" :style="{ visibility: isPrintMode ? 'hidden' : 'visible' }">
      <button class="primary" @click="sample">Sample</button>
      <button @click="reset">Reset</button>
    </div>
  </DemoPanel>
</template>
<style scoped>
.compact-histogram { width: 100%; }
.compact-histogram svg { display: block; width: 100%; height: 145px; }
.compact-histogram svg text { font: 13px Arial, sans-serif; fill: #587083; }
.histogram-readout { height: 23px; text-align: center; font-size: 15px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.histogram-controls { justify-content: center; margin: 0; gap: 8px; }
.histogram-controls button { padding: 6px 13px; font-size: 16px; }
.size-controls { gap: 4px; margin-bottom: 4px; }
.size-controls button { padding: 4px 8px; font-size: 14px; }
</style>
