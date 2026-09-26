<script setup lang="ts">
import L4Math from './L4Math.vue'
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { priorState as state } from '../lib/prior-state'
import { encoderMeans, conditionalDensity, aggregatedDensity, priorDensity, priorDensityPath, priorExamples } from '../lib/prior-demo.mjs'

const { isPrintMode } = useNav()
const active = computed(() => priorExamples.find(example => example.mode === state.mode)!)
const examples = computed(() => isPrintMode.value ? priorExamples : [active.value])
const colors = ['#e17838', '#597daf', '#83a045']
const fmt = (value: number) => (Math.abs(value) < .0005 ? 0 : value).toFixed(3)
const barWidth = (value: number) => `${value / 1.6 * 100}%`
function choose(mode: 'gaussian' | 'matched') { state.mode = mode }
</script>

<template>
  <DemoPanel class="marginal-demo" :class="{ 'print-demo': isPrintMode }" data-demo="marginal-kl"
    :data-mode="state.mode" :data-mi="active.mutualInformation" :data-marginal-kl="active.marginalKL" :data-conditional-kl="active.conditionalKL">
    <div v-if="!isPrintMode" class="demo-controls">
      <button @click="choose('gaussian')" :aria-pressed="state.mode === 'gaussian'">Gaussian prior</button>
      <button @click="choose('matched')" :aria-pressed="state.mode === 'matched'">Matched prior</button>
      <span class="fixed-encoder">Encoder stays fixed</span>
      <button class="demo-reset" @click="choose('gaussian')">Reset</button>
    </div>
    <div class="model"><L4Math formula="q_{\bphi}(z|\bx_i)=\cN(\mu_i,0.65^2),\quad (\mu_1,\mu_2,\mu_3)=(-2,0,2),\quad \pd(\bx_i)=1/3" /></div>
    <div class="examples">
      <div v-for="example in examples" :key="example.mode" class="example" :data-prior-case="example.mode">
        <div class="plot">
          <div class="legend">
            <span class="conditional-legend"><i v-for="color in colors" :key="color" :style="{ background: color }" />Conditionals</span>
            <span class="aggregate-legend"><i />Aggregated posterior</span>
            <span class="prior-legend"><i />Prior</span>
          </div>
          <svg viewBox="0 0 548 180" role="img" :aria-label="`Fixed conditional and aggregated posteriors with ${example.label.toLowerCase()}`">
            <g transform="translate(24 8)">
              <line x1="0" y1="136" x2="492" y2="136" stroke="#bbced8" />
              <template v-for="tick in [-4, -2, 0, 2, 4]" :key="tick"><line :x1="(tick+4.5)/9*492" y1="136" :x2="(tick+4.5)/9*492" y2="141" stroke="#587083" /><text :x="(tick+4.5)/9*492" y="161" text-anchor="middle">{{ tick }}</text></template>
              <path v-for="(_, index) in encoderMeans" :key="index" :d="priorDensityPath(z => conditionalDensity(z, index))" fill="none" :stroke="colors[index]" stroke-width="2" />
              <path :d="priorDensityPath(aggregatedDensity)" fill="none" stroke="#17324d" stroke-width="4" />
              <path :d="priorDensityPath(z => priorDensity(z, example.mode))" fill="none" stroke="#8854c0" stroke-width="3" stroke-dasharray="8 5" />
              <text x="0" y="14">density</text><text x="516" y="160" text-anchor="end">z</text>
            </g>
          </svg>
          <div class="prior-caption"><L4Math :formula="example.mode === 'gaussian' ? 'p(z)=\\cN(0,1)' : 'p(z)=\\qagg(z)=\\frac13\\sum_{i=1}^3 q_{\\bphi}(z|\\bx_i)'" /></div>
        </div>
        <div class="terms" aria-live="polite" aria-atomic="true">
          <div v-if="isPrintMode" class="case-title">{{ example.label }}</div>
          <div class="term marginal"><span>Marginal KL</span><b>{{ fmt(example.marginalKL) }}</b><div class="bar-track"><span :style="{ width: barWidth(example.marginalKL) }" /></div></div>
          <div class="term mutual"><span>Mutual information</span><b>{{ fmt(example.mutualInformation) }}</b><div class="bar-track"><span :style="{ width: barWidth(example.mutualInformation) }" /></div></div>
          <div class="term conditional"><span>Mean conditional KL</span><b>{{ fmt(example.conditionalKL) }}</b><div class="bar-track"><span class="mi-part" :style="{ width: barWidth(example.mutualInformation) }" /><span class="marginal-part" :style="{ width: barWidth(example.marginalKL) }" /></div></div>
          <div class="units">All values in nats; all bars use the same scale.</div>
        </div>
      </div>
    </div>
    <div class="demo-takeaway"><template v-if="isPrintMode || state.mode === 'matched'">Matching the prior removes <strong class="marginal">Marginal KL</strong>.<br v-if="!isPrintMode" /><span v-else>&nbsp;</span>The <strong class="mutual">mutual information</strong> and encoder remain unchanged.</template><template v-else>Can matching the prior make the entire conditional KL disappear?<br /><span class="demo-note">Switch the prior while keeping the encoder fixed.</span></template></div>
  </DemoPanel>
</template>

<style scoped>
.marginal-demo { max-height: 440px; }
.demo-controls { margin-bottom: 9px; }
.fixed-encoder { margin-left: 10px; color: #587083; font-size: 18px; }
.model { font-size: 18px; margin: 4px 0 12px; text-align: center; }
.example { display: grid; grid-template-columns: 1.15fr 1fr; gap: 30px; }
.legend { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 15px; white-space: nowrap; }
.legend span { display: flex; align-items: center; gap: 4px; }
.legend i { display: inline-block; width: 16px; height: 3px; }
.conditional-legend i { width: 8px; }
.aggregate-legend i { background: #17324d; }
.prior-legend i { background: #8854c0; }
.plot svg { display: block; width: 100%; height: 185px; }
svg text { font: 18px Arial, sans-serif; fill: currentColor; }
.prior-caption { text-align: center; font-size: 19px; margin-top: -2px; }
.terms { padding-top: 1px; }
.term { display: grid; grid-template-columns: 1fr auto; column-gap: 12px; row-gap: 5px; margin-bottom: 13px; font-size: 20px; }
.term b { font-variant-numeric: tabular-nums; }
.bar-track { display: flex; grid-column: 1 / -1; width: 100%; height: 13px; background: #f0f3f5; border-radius: 2px; overflow: hidden; }
.bar-track > span { display: block; height: 100%; }
.marginal { color: #8854c0; }
.mutual { color: #007f82; }
.marginal .bar-track > span, .bar-track > .marginal-part { background: #8854c0; }
.mutual .bar-track > span, .bar-track > .mi-part { background: #007f82; }
.units { color: #587083; font-size: 16px; }
.demo-takeaway { margin-top: 15px; padding: 10px 16px; font-size: 20px; }
.print-demo .model { margin-bottom: 12px; }
.print-demo .examples { display: grid; grid-template-columns: 1fr 1fr; gap: 34px; }
.print-demo .example { display: block; }
.print-demo .plot svg { height: 140px; }
.print-demo .prior-caption { font-size: 17px; min-height: 30px; }
.print-demo .terms { margin-top: 7px; }
.print-demo .case-title { display: none; }
.print-demo .term { font-size: 18px; margin-bottom: 6px; row-gap: 3px; }
.print-demo .bar-track { height: 8px; }
.print-demo .units { font-size: 15px; }
.print-demo .demo-takeaway { margin-top: 12px; }
</style>
