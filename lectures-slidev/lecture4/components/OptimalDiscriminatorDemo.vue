<script setup lang="ts">
import L4Math from './L4Math.vue'
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { ganState as state } from '../lib/gan-state'
import { ganPresets, ganDensityPath, ganDiscriminatorPath, optimalDiscriminator } from '../lib/gan-demo.mjs'

const { isPrintMode } = useNav()
const cases = computed(() => isPrintMode.value ? ganPresets : [{ label: 'Current generator', mean: state.mean }])
const plotWidth = computed(() => isPrintMode.value ? 286 : 760)
const ticks = computed(() => isPrintMode.value ? [-6, 0, 6] : [-6, -3, 0, 3, 6])
const matched = computed(() => Math.abs(state.mean) < 1e-10)
const xAt = (x: number) => 42 + (x + 6) / 12 * plotWidth.value
const isPreset = (mean: number) => Math.abs(state.mean - mean) < 1e-10
const meanFormula = (mean: number) => String.raw`\mu=${mean}`
const modelFormula = (mean: number) => String.raw`\pt(x)=\cN(${mean},1)`
const modelLabel = String.raw`\pt(x)=\cN(\mu,1)`
function choose(mean: number) { state.mean = mean }
</script>

<template>
  <DemoPanel class="gan-demo" :class="{ 'print-demo': isPrintMode }" data-demo="optimal-discriminator" :data-mean="state.mean" :data-matched="matched">
    <div v-if="!isPrintMode" class="demo-controls">
      <button v-for="preset in ganPresets" :key="preset.label" :aria-pressed="isPreset(preset.mean)" @click="choose(preset.mean)">{{ preset.label }}</button>
      <label><L4Math formula="\mu" /><input v-model.number="state.mean" type="range" min="-3" max="3" step="0.05" aria-label="Generator mean" /><output>{{ state.mean.toFixed(2) }}</output></label>
      <button class="demo-reset" @click="choose(ganPresets[0].mean)">Reset</button>
    </div>
    <div class="gan-body">
      <div class="cases">
        <div v-for="example in cases" :key="example.label" class="case">
          <div v-if="isPrintMode" class="case-title"><b>{{ example.label }}</b><L4Math :formula="meanFormula(example.mean)" /></div>
          <div class="legend"><span class="data"><L4Math formula="\pd(x)=\cN(0,1)" /></span><span class="model"><L4Math :formula="isPrintMode ? modelFormula(example.mean) : modelLabel" /></span></div>
          <svg :viewBox="`0 0 ${plotWidth + 64} 282`" class="gan-plots" role="img" :aria-label="`Data and generator densities above, ideal optimal discriminator below, generator mean ${example.mean}.`">
            <text x="4" y="16" class="axis-title">density</text>
            <line x1="42" y1="24" x2="42" y2="114" class="axis" />
            <line x1="42" y1="114" :x2="plotWidth + 42" y2="114" class="axis" />
            <text x="34" y="33" text-anchor="end">0.4</text><text x="34" y="120" text-anchor="end">0</text>
            <g transform="translate(42 0)">
              <path :d="ganDensityPath(example.mean, plotWidth)" fill="none" stroke="#8854c0" stroke-width="3" />
              <path :d="ganDensityPath(0, plotWidth)" fill="none" stroke="#17324d" stroke-width="3" stroke-dasharray="7 5" />
            </g>
            <text x="4" y="148" class="axis-title">D*</text>
            <line x1="42" y1="160" x2="42" y2="246" class="axis" />
            <line x1="42" y1="246" :x2="plotWidth + 42" y2="246" class="axis" />
            <line x1="42" y1="203" :x2="plotWidth + 42" y2="203" class="half-guide" />
            <text x="34" y="166" text-anchor="end">1</text><text x="34" y="209" text-anchor="end">0.5</text><text x="34" y="251" text-anchor="end">0</text>
            <path :d="ganDiscriminatorPath(example.mean, plotWidth)" transform="translate(42 0)" fill="none" stroke="#007f82" stroke-width="3.5" />
            <line v-if="Math.abs(example.mean) > 1e-10" :x1="xAt(example.mean / 2)" y1="160" :x2="xAt(example.mean / 2)" y2="246" stroke="#e17838" stroke-width="1.5" stroke-dasharray="3 4" />
            <template v-for="tick in ticks" :key="tick"><line :x1="xAt(tick)" y1="246" :x2="xAt(tick)" y2="251" class="axis" /><text :x="xAt(tick)" y="273" text-anchor="middle">{{ tick }}</text></template>
            <text :x="plotWidth + 63" y="273" text-anchor="end">x</text>
          </svg>
          <div v-if="isPrintMode" class="case-caption">{{ example.mean === 0 ? 'Equal densities: D* = 0.5 everywhere.' : `Equal densities at x = ${(example.mean / 2).toFixed(1)}.` }}</div>
        </div>
      </div>
      <div v-if="!isPrintMode" class="interpretation" aria-live="polite">
        <b>Ideal discriminator</b>
        <p>Higher values favor real data; lower values favor generated samples.</p>
        <div class="readout"><L4Math formula="D^*(0)" /><span class="demo-stat">{{ optimalDiscriminator(0, state.mean).toFixed(3) }}</span></div>
        <div class="readout"><L4Math formula="D^*(\mu)" /><span class="demo-stat">{{ optimalDiscriminator(state.mean, state.mean).toFixed(3) }}</span></div>
        <p class="demo-note">{{ matched ? 'The densities coincide. Every x receives probability 0.5.' : 'The orange line marks equal densities: D* = 0.5.' }}</p>
      </div>
    </div>
    <div class="demo-takeaway">Matching the generator to the data makes the optimal discriminator equal to 0.5 everywhere.</div>
  </DemoPanel>
</template>

<style scoped>
.gan-demo { max-width: 1150px; }
.demo-controls { margin-bottom: 10px; }
label { display: flex; align-items: center; gap: 12px; margin-left: 20px; }
input { width: 230px; min-height: 44px; accent-color: #007f82; }
output { width: 49px; font-size: 18px; font-variant-numeric: tabular-nums; }
.gan-body { display: grid; grid-template-columns: minmax(0, 824px) 1fr; gap: 22px; }
.cases { min-width: 0; }
.legend { display: flex; justify-content: center; gap: 44px; font-size: 18px; height: 28px; }
.data { color: #17324d; }
.model { color: #8854c0; }
.gan-plots { display: block; width: 100%; height: 282px; }
.axis { stroke: #bbced8; stroke-width: 1.2; }
.half-guide { stroke: #bbced8; stroke-dasharray: 5 5; }
svg text { font: 17px Arial, sans-serif; fill: #587083; }
.axis-title { fill: #17324d; }
.interpretation { border-left: 1px solid #dce5eb; padding: 8px 0 0 20px; font-size: 18px; }
.interpretation b { color: #007f82; font-size: 20px; }
.interpretation p { margin: 12px 0; line-height: 1.35; }
.readout { display: flex; align-items: center; justify-content: space-between; margin: 10px 0; }
.readout > .demo-stat { color: #007f82; }
.demo-takeaway { font-size: 19px; margin-top: 8px; padding: 10px 14px; }
.print-demo .gan-body { display: block; }
.print-demo .cases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.print-demo .case { border-top: 3px solid #007f82; padding-top: 7px; }
.case-title { display: flex; justify-content: space-between; align-items: center; height: 30px; margin-bottom: 6px; }
.case-title b { color: #007f82; font-size: 22px; }
.print-demo .legend { justify-content: space-between; gap: 6px; font-size: 16px; }
.case-caption { font-size: 17px; color: #587083; margin-top: 4px; }
.print-demo .demo-takeaway { margin-top: 9px; }
</style>
