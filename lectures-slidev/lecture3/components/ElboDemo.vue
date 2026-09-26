<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { elboState as state } from '../lib/demo-state'
import { posterior, logEvidence, elboPresets, elboTerms, densityPath } from '../lib/variational.mjs'
const { isPrintMode } = useNav()
const terms = computed(() => elboTerms(state.mean, state.sigma))
const colors = ['#8854c0', '#e17838', '#007f82']
function choose(preset: { mean: number; sigma: number }) { state.mean = preset.mean; state.sigma = preset.sigma }
const isPreset = (p: { mean: number; sigma: number }) => Math.abs(state.mean - p.mean) < 1e-10 && Math.abs(state.sigma - p.sigma) < 1e-10
const fmt = (value: number) => (Math.abs(value) < .0005 ? 0 : value).toFixed(3)
</script>
<template>
  <DemoPanel class="elbo-demo" data-demo="elbo" :data-mean="state.mean" :data-sigma="state.sigma" :data-gap="terms.gap" :data-elbo="terms.elbo" :data-evidence="logEvidence">
    <div v-if="!isPrintMode" class="demo-controls">
      <button v-for="p in elboPresets" :key="p.label" @click="choose(p)" :aria-pressed="isPreset(p)">{{ p.label }}</button>
      <button class="demo-reset" @click="choose(elboPresets[0])">Reset</button>
      <label><L3Math formula="\mu_q" /><input aria-label="Variational mean" type="range" min="-1" max="2" step="0.05" v-model.number="state.mean" /><output>{{ state.mean.toFixed(2) }}</output></label>
      <label><L3Math formula="\sigma_q" /><input aria-label="Variational standard deviation" type="range" min="0.45" max="1.4" step="0.025" v-model.number="state.sigma" /><output>{{ state.sigma.toFixed(2) }}</output></label>
    </div>
    <div class="plot-grid">
    <div>
    <div class="legend"><span class="true"><L3Math formula="p(z|x)=\cN(1,1/2)" /></span><span v-if="!isPrintMode" class="approx"><L3Math formula="q(z)=\cN(\mu_q,\sigma_q^2)" /></span></div>
    <svg class="density" viewBox="0 0 530 160" role="img" aria-label="True posterior and variational Gaussian probability densities">
      <g transform="translate(24 6)">
        <line x1="0" y1="122" x2="485" y2="122" stroke="#bbced8" />
        <template v-for="tick in [-3, -2, -1, 0, 1, 2, 3]" :key="tick"><line :x1="(tick+4)/8*485" y1="122" :x2="(tick+4)/8*485" y2="127" stroke="#587083" /><text :x="(tick+4)/8*485" y="145" text-anchor="middle">{{ tick }}</text></template>
        <path :d="densityPath(posterior.mean, posterior.sigma, 4, 485, 124, 122)" fill="none" stroke="#17324d" stroke-width="3" stroke-dasharray="6 4" />
        <template v-if="isPrintMode"><path v-for="(p,i) in elboPresets" :key="p.label" :d="densityPath(p.mean,p.sigma,4,485,124,122)" fill="none" :stroke="colors[i]" stroke-width="2.5" :stroke-dasharray="i===2?'2 5':undefined" /></template>
        <path v-else :d="densityPath(state.mean,state.sigma,4,485,124,122)" fill="none" stroke="#8854c0" stroke-width="3" />
        <text x="504" y="144" text-anchor="end">z</text><text x="0" y="16">density</text>
      </g>
    </svg>
    </div>
    <div>
    <div class="model"><L3Math formula="p(z)=\cN(0,1),\quad p(x|z)=\cN(z,1),\quad x=2" /></div>
    <template v-if="!isPrintMode">
      <svg class="bound" viewBox="0 0 530 120" role="img" aria-label="Fixed log evidence and ELBO separated by the KL gap">
        <line x1="12" y1="22" x2="260" y2="22" stroke="#17324d" stroke-width="2.5" data-evidence-line />
        <line x1="12" :y1="22+18*terms.gap" x2="260" :y2="22+18*terms.gap" stroke="#007f82" stroke-width="3" />
        <line x1="240" y1="22" x2="240" :y2="22+18*terms.gap" stroke="#8854c0" stroke-width="2" />
        <text x="280" y="24">log p(x) = {{ fmt(logEvidence) }}</text>
        <text x="280" y="58" fill="#007f82">ELBO = {{ fmt(terms.elbo) }}</text>
        <text x="280" y="92" fill="#8854c0">KL gap = {{ fmt(terms.gap) }}</text>
      </svg>
    </template>
    <div v-else class="print-examples">
      <div v-for="(p,i) in elboPresets" :key="p.label" :style="{ '--case-color': colors[i] }">
        <b>{{ p.label }}</b>
        <L3Math :formula="`\\mu_q=${p.mean},\\quad\\sigma_q=${p.sigma.toFixed(3)}`" />
        <span>ELBO {{ fmt(elboTerms(p.mean,p.sigma).elbo) }}</span><span>KL {{ fmt(elboTerms(p.mean,p.sigma).gap) }}</span>
      </div>
    </div>
    <div class="demo-note">
      <template v-if="isPrintMode">log p(x) = {{ fmt(logEvidence) }} stays fixed. The exact posterior closes the gap.</template>
      <template v-else>Moving q changes the bound; log p(x) stays fixed.<br />Logarithms use base e (nats).</template>
    </div>
    </div>
    </div>
  </DemoPanel>
</template>
<style scoped>
.plot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 6px; }
.model { font-size: 18px; margin-bottom: 10px; }
.demo-controls { gap: 10px; margin-bottom: 6px; }
.demo-reset { margin-left: 0; margin-right: 25px; }
.demo-controls button { padding: 7px 13px; }
.sliders { justify-content: space-between; }
label { display: flex; align-items: center; gap: 9px; margin-left: 12px; }
input { width: 155px; min-height: 44px; accent-color: #007f82; }
output { width: 40px; font-size: 18px; font-variant-numeric: tabular-nums; }
.legend { display: flex; justify-content: space-between; font-size: 18px; margin: 4px 0; }
.approx { color: #8854c0; }
.density { width: 100%; height: 148px; }
.bound { width: 100%; height: 110px; margin-top: 3px; }
svg text { font: 18px Arial, sans-serif; }
svg text:not([fill]) { fill: currentColor; }
.print-examples { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 8px 0; }
.print-examples > div { display: flex; flex-direction: column; gap: 5px; border-top: 3px solid var(--case-color); padding-top: 6px; font-size: 18px; }
.print-examples b { color: var(--case-color); font-size: 22px; }
.print-examples :deep(.katex) { font-size: 17px; }
.demo-note { min-height: 40px; font-size: 17px; }
</style>
