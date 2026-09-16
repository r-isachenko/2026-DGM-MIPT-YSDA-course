<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { arSample, arEvaluate } from '../lib/flow-models.mjs'
const { isPrintMode } = useNav()
const mode = ref('sample')
const step = ref(0)
const noise = [-1, .5, 1, -.5]
const observation = arSample(noise)
const reconstructed = arEvaluate(observation)
const input = computed(() => mode.value === 'sample' ? noise : observation)
const output = computed(() => mode.value === 'sample' ? observation : reconstructed)
const complete = computed(() => step.value === 4)
const active = computed(() => Math.min(step.value + 1, 4))
const directions = [
  { mode: 'sample', label: 'Sampling: sequential', formula: String.raw`\displaystyle {\color{#8854c0}x_j}=\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})+\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}}){\color{teal}z_j}` },
  { mode: 'evaluate', label: 'Density evaluation: parallel', formula: String.raw`\displaystyle {\color{teal}z_j}=\frac{{\color{#8854c0}x_j}-\mu_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})}{\sigma_{j,\btheta}({\color{#8854c0}\bx_{1:j-1}})}` },
]
function reset() { step.value = 0 }
function choose(value: string) { if (mode.value !== value) { mode.value = value; reset() } }
function next() { step.value = mode.value === 'sample' ? Math.min(4, step.value + 1) : 4 }
</script>
<template>
  <DemoPanel data-demo="ar-flow" :data-mode="mode" :data-step="step">
    <div class="ar-directions">
      <div v-for="direction in directions" :key="direction.mode" class="ar-direction" :class="{ active: isPrintMode || mode === direction.mode }" :data-direction="direction.mode">
        <h2>{{ direction.label }}</h2>
        <FlowMath :formula="direction.formula" />
      </div>
    </div>
    <div v-if="!isPrintMode" class="demo-controls">
      <button :aria-pressed="mode === 'sample'" @click="choose('sample')">Sampling</button>
      <button :aria-pressed="mode === 'evaluate'" @click="choose('evaluate')">Density evaluation</button>
      <button class="primary" :disabled="complete" @click="next">{{ mode === 'sample' ? 'Next coordinate' : 'Compute all' }}</button>
      <button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div class="ar-model"><FlowMath formula="\mu_{j,\btheta}(\bx_{1:j-1})=\sum_{i<j}x_i,\quad\sigma_{j,\btheta}=1" /><span class="demo-note">A fixed toy Gaussian AR flow</span></div>
    <template v-if="!isPrintMode">
      <div class="row-heading"><FlowMath :formula="mode === 'sample' ? '\\bz\\text{: all noise coordinates are known}' : '\\bx\\text{: all observed coordinates are known}'" /></div>
      <div class="coord-row">
        <div v-for="(v, j) in input" :key="j" class="coord known" :class="mode === 'sample' ? 'noise' : 'data'">
          <FlowMath :formula="`${mode === 'sample' ? 'z' : 'x'}_${j + 1}`" /><span>{{ v.toFixed(3) }}</span>
        </div>
      </div>
      <div class="flow-arrows" aria-hidden="true"><span v-for="j in 4" :key="j" :class="{ ready: mode === 'evaluate' || j <= step + 1 }">↓</span></div>
      <div class="coord-row">
        <div v-for="(v, j) in output" :key="j" class="coord result" :class="[{ pending: j >= step, current: mode === 'sample' && j === step }, mode === 'sample' ? 'data' : 'noise']" :data-known="j < step">
          <FlowMath :formula="`${mode === 'sample' ? 'x' : 'z'}_${j + 1}`" /><span>{{ j < step ? v.toFixed(3) : '?' }}</span>
        </div>
      </div>
      <div class="dependency-band">
        <svg v-if="mode === 'sample' && step > 0 && step < 4" class="prefix-arrows" viewBox="0 0 1164 34" role="img" aria-label="Previously computed coordinates feed the next output">
          <path v-for="j in step" :key="j" class="prefix-connection" :d="`M ${138 + (j - 1) * 296},0 V ${7 + j * 5} H ${138 + step * 296} V 0`" fill="none" stroke="#8854c0" stroke-width="2" />
          <path class="prefix-arrowhead" :d="`M ${132 + step * 296},6 l 6,-6 l 6,6`" fill="none" stroke="#8854c0" stroke-width="2" />
        </svg>
        <template v-if="mode === 'sample'">
          <FlowMath v-if="!complete" :formula="`x_${active}=z_${active}+\\sum_{i<${active}}x_i`" />
          <span v-if="!complete">{{ step === 0 ? 'The first coordinate needs no previous outputs.' : `The next coordinate uses ${step === 1 ? 'x₁' : `x₁, …, x${step === 2 ? '₂' : '₃'}`} already computed above.` }}</span>
          <span v-else>All four coordinates are available after four sequential steps.</span>
        </template>
        <template v-else><FlowMath formula="z_j=x_j-\sum_{i<j}x_i" /><span>Every prefix is observed. All four outputs can be computed together.</span></template>
      </div>
    </template>
    <div v-else class="ar-print">
      <div>
        <h2>Sampling: sequential</h2>
        <FlowMath formula="x_j=z_j+\sum_{i<j}x_i" />
        <div class="print-chain"><span v-for="(value, j) in observation" :key="j"><FlowMath :formula="`x_${j + 1}`" /><b>{{ value.toFixed(3) }}</b><small>step {{ j + 1 }}</small></span></div>
        <p>Each coordinate needs the previous outputs.</p>
      </div>
      <div>
        <h2>Density evaluation: parallel</h2>
        <FlowMath formula="z_j=x_j-\sum_{i<j}x_i" />
        <div class="print-chain"><span v-for="(value, j) in noise" :key="j"><FlowMath :formula="`z_${j + 1}`" /><b>{{ value.toFixed(3) }}</b><small>same step</small></span></div>
        <p>All prefixes are already available in the observed vector.</p>
      </div>
    </div>
    <div class="demo-takeaway">The dependency structure is unchanged. What differs is which values are already known.</div>
    <div class="demo-note ar-density"><FlowMath formula="\log\pt(\bx)=\log p(\bz)+\log|\det\bJ_\bff|" />; here the Jacobian has unit diagonal, so the log-determinant is zero.</div>
  </DemoPanel>
</template>
<style scoped>
.ar-directions { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 8px; }
.ar-direction { border-bottom: 2px solid #dce5eb; padding-bottom: 10px; }
.ar-direction h2 { margin: 0 0 4px; }
.ar-direction.active { border-bottom-color: #007f82; background: #eaf5f4; }
.demo-controls { margin-bottom: 10px; }
.ar-model { display: flex; gap: 30px; align-items: center; margin: 6px 0 8px; }
.row-heading { margin-bottom: 8px; }
.coord-row, .flow-arrows { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.coord { border: 2px solid; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; padding: 8px 22px; font-size: 27px; font-variant-numeric: tabular-nums; height: 52px; }
.noise { color: #007f82; border-color: #007f82; background: #eaf5f4; }
.data { color: #8854c0; border-color: #8854c0; background: #f5f0fa; }
.coord.pending { background: #f3f6f8; border-color: #d5e0e7; color: #718593; }
.coord.current { border-color: #e17838; }
.flow-arrows { height: 26px; font-size: 30px; line-height: 26px; text-align: center; color: #c4d0d9; }
.flow-arrows .ready { color: #007f82; }
.dependency-band { position: relative; height: 70px; padding-top: 24px; display: flex; gap: 30px; align-items: center; font-size: 21px; }
.prefix-arrows { position: absolute; top: 0; left: 0; width: 100%; height: 34px; }
.dependency-band > span:last-child { max-width: 670px; }
.ar-density { margin-top: 6px; }
.ar-print { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; margin-top: 20px; }
.ar-print > div { padding: 20px; border: 1px solid #dce5eb; border-radius: 6px; }
.print-chain { display: flex; gap: 12px; margin: 18px 0; }
.print-chain > span { flex: 1; display: flex; flex-direction: column; text-align: center; background: #f3f6f8; padding: 10px; gap: 5px; }
.print-chain b { font-variant-numeric: tabular-nums; font-weight: 400; }
.print-chain small { color: #587083; font-size: 16px; }
</style>
