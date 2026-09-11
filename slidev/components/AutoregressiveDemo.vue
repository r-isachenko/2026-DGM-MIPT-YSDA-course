<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { conditional, dataset, factors, seededRandom } from '../lib/binary-models.mjs'
const { isPrintMode } = useNav()
const data = dataset(3)
const mode = ref('sample')
const prefix = ref<number[]>([])
const chosen = ref<number[]>([])
const example = ref(0)
const random = seededRandom(41)
const finished = computed(() => prefix.value.length === 9)
const target = computed(() => data[example.value % data.length])
const probability = computed(() => finished.value ? null : conditional(data, prefix.value))
const pixels = computed(() => Array.from({ length: 9 }, (_, j) => mode.value === 'evaluate' ? target.value[j] : prefix.value[j] ?? null))
const logProbability = computed(() => chosen.value.reduce((sum, p) => sum + Math.log(p), 0))
function restart(value = mode.value) { mode.value = value; prefix.value = []; chosen.value = [] }
function switchMode(value: string) { if (value !== mode.value) restart(value) }
function next() {
  if (finished.value || probability.value === null) return
  const bit = mode.value === 'sample' ? +(random() < probability.value) : target.value[prefix.value.length]
  chosen.value.push(bit ? probability.value : 1 - probability.value)
  prefix.value.push(bit)
}
function nextExample() { example.value++; restart() }
const printImage = data[0]
const printFactors = factors(data, printImage)
const printLog = printFactors.reduce((sum, p) => sum + Math.log(p), 0)
</script>
<template>
  <DemoPanel data-demo="autoregressive">
    <div v-if="!isPrintMode" class="demo-controls">
      <div class="ar-mode" role="group" aria-label="Operation">
        <button :aria-pressed="mode === 'sample'" @click="switchMode('sample')">Generate</button>
        <button :aria-pressed="mode === 'evaluate'" @click="switchMode('evaluate')">Evaluate</button>
      </div>
      <button class="primary" :disabled="finished" @click="next">Next pixel</button>
      <button v-if="mode === 'evaluate'" @click="nextExample">Another image</button>
      <button v-else @click="restart()">Start over</button>
    </div>
    <div class="ar-main">
      <div class="ar-image">
        <BinaryImage :pixels="isPrintMode ? printImage : pixels" :side="3" :active="isPrintMode ? undefined : prefix.length" />
        <div class="demo-note">Raster order · white = 0 · dark = 1<br>Gray = not sampled</div>
      </div>
      <div class="ar-distribution">
        <template v-if="!isPrintMode">
          <h2>{{ finished ? 'Image complete' : `Next conditional: pixel ${prefix.length + 1}` }}</h2>
          <div class="ar-context">Context: {{ prefix.length ? prefix.join(' ') : 'empty' }}</div>
          <div v-if="!finished" class="probabilities">
            <div v-for="bit in [0, 1]" :key="bit" class="probability-row">
              <span>x = {{ bit }}</span><div class="probability-track"><div :style="{ width: `${(bit ? probability : 1 - probability) * 100}%` }" /></div>
              <b>{{ (bit ? probability : 1 - probability).toFixed(3) }}</b>
            </div>
          </div>
          <div v-else class="ar-finished">All nine conditional probabilities have been multiplied.</div>
          <p>{{ mode === 'sample' ? 'Draw the next pixel, then append it to the context.' : 'Read the observed pixel and record its conditional probability.' }}</p>
        </template>
        <template v-else>
          <h2>One model, two operations</h2>
          <p><b>Sample:</b> draw a pixel from its conditional distribution; append it to the context.</p>
          <p><b>Evaluate:</b> use the observed prefix; multiply the probabilities of the observed pixels.</p>
        </template>
      </div>
    </div>
    <div class="ar-factors" aria-label="Conditional probability factors">
      <div v-for="j in 9" :key="j" :class="{ current: !isPrintMode && prefix.length === j - 1 }">
        <span>pixel {{ j }}</span><b>{{ isPrintMode ? printFactors[j - 1].toFixed(3) : chosen[j - 1]?.toFixed(3) ?? '—' }}</b>
      </div>
    </div>
    <div class="ar-total demo-stat" aria-live="polite">
      <span>{{ isPrintMode || finished ? 'log p(image)' : 'log p(prefix)' }} = {{ (isPrintMode ? printLog : logProbability).toFixed(4) }}</span>
      <span>{{ isPrintMode || finished ? 'p(image)' : 'p(prefix)' }} = {{ Math.exp(isPrintMode ? printLog : logProbability).toFixed(5) }}</span>
    </div>
    <div class="demo-takeaway">Sampling needs the generated prefix. Evaluation uses a prefix that is already known.</div>
    <div class="demo-note">32 synthetic 3 × 3 stripe images. Exact empirical conditionals; no neural network.</div>
  </DemoPanel>
</template>
<style scoped>
.ar-mode { display: flex; margin-right: 14px; }
.ar-mode button:first-child { border-radius: 6px 0 0 6px; }
.ar-mode button:last-child { border-radius: 0 6px 6px 0; border-left: 0; }
.ar-main { display: grid; grid-template-columns: 280px 1fr; gap: 32px; height: 210px; }
.ar-image > .binary-image { width: 144px; height: 144px; margin: 0 auto 8px; }
.ar-image { text-align: center; }
.ar-context { font: 20px Menlo, monospace; margin: 12px 0; }
.ar-distribution p { font-size: 20px; }
.probability-row { display: grid; grid-template-columns: 65px 1fr 65px; gap: 18px; align-items: center; margin: 9px 0; }
.probability-track { height: 24px; background: #e4ecef; border-radius: 3px; overflow: hidden; }
.probability-track > div { height: 100%; background: #007f82; }
.ar-finished { min-height: 70px; padding: 15px; background: #eaf4f3; }
.ar-factors { display: grid; grid-template-columns: repeat(9, 1fr); gap: 8px; margin-top: 10px; }
.ar-factors > div { background: #f2f6f8; padding: 8px; text-align: center; border: 2px solid transparent; }
.ar-factors > div.current { border-color: #e17838; }
.ar-factors span { display: block; font-size: 15px; color: #587083; }
.ar-factors b { font-size: 21px; font-variant-numeric: tabular-nums; }
.ar-total { display: flex; justify-content: space-between; padding: 10px 0 0; }
.demo-note { margin-top: 8px; }
</style>
