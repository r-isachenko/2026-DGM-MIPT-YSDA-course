<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { divergences, forwardFit, normal, reverseFit, targetDensity } from '../lib/kl-demo.mjs'
const { isPrintMode } = useNav()
const mean = ref(0), sigma = ref(1)
const values = computed(() => divergences(mean.value, sigma.value))
const reverse = reverseFit()
function fit(which: string) {
  const value = which === 'forward' ? forwardFit : { ...reverse, mean: which === 'left' ? -reverse.mean : reverse.mean }
  mean.value = value.mean; sigma.value = value.sigma
}
function reset() { mean.value = 0; sigma.value = 1 }
function path(fn: (x: number) => number) {
  return Array.from({ length: 401 }, (_, i) => { const x = -6 + i * .03; return `${i ? 'L' : 'M'}${(30 + i / 400 * 660).toFixed(2)},${(218 - fn(x) * 145).toFixed(2)}` }).join(' ')
}
const targetPath = path(targetDensity)
const modelPath = computed(() => path(x => normal(x, mean.value, sigma.value)))
const printFits = [{ label: 'Forward KL optimum', ...forwardFit }, { label: 'Reverse KL minimum (right mode)', ...reverse }]
</script>
<template>
  <DemoPanel data-demo="kl">
    <div v-if="!isPrintMode" class="demo-controls">
      <button @click="fit('forward')">Fit forward KL</button>
      <button @click="fit('left')">Fit reverse KL: left</button>
      <button @click="fit('right')">Fit reverse KL: right</button>
      <button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div v-if="!isPrintMode" class="kl-live">
      <div>
        <svg viewBox="0 0 720 255" role="img" aria-label="Target mixture and adjustable Gaussian density">
          <line x1="30" y1="218" x2="690" y2="218" stroke="#a6b6c2" />
          <text v-for="x in [-6, -4, -2, 0, 2, 4, 6]" :key="x" :x="30 + (x + 6) / 12 * 660" y="240" text-anchor="middle">{{ x }}</text>
          <text x="30" y="17">density</text><text x="704" y="240">x</text>
          <path :d="targetPath" fill="none" stroke="#007f82" stroke-width="4" />
          <path :d="modelPath" fill="none" stroke="#8854c0" stroke-width="4" stroke-dasharray="10 5" />
        </svg>
        <div class="kl-legend"><span>━━ Target: two modes</span><span>┄┄ Model: one Gaussian</span></div>
      </div>
      <div class="kl-settings">
        <label>Mean μ <b>{{ mean.toFixed(2) }}</b><input aria-label="Gaussian mean" type="range" min="-3" max="3" step="any" v-model.number="mean" /></label>
        <label>Std. deviation σ <b>{{ sigma.toFixed(2) }}</b><input aria-label="Gaussian standard deviation" type="range" min="0.3" max="3" step="any" v-model.number="sigma" /></label>
        <div class="kl-values demo-stat" aria-live="polite"><div>Forward KL <b>{{ values.forward.toFixed(3) }}</b></div><div>Reverse KL <b>{{ values.reverse.toFixed(3) }}</b></div><small>Numerical integrals · nats</small></div>
      </div>
    </div>
    <div v-else class="kl-print">
      <div v-for="fit in printFits" :key="fit.label"><h2>{{ fit.label }}</h2>
        <svg viewBox="0 0 720 255" role="img" :aria-label="fit.label">
          <line x1="30" y1="218" x2="690" y2="218" stroke="#a6b6c2" />
          <text v-for="x in [-4, -2, 0, 2, 4]" :key="x" :x="30 + (x + 6) / 12 * 660" y="240" text-anchor="middle">{{ x }}</text>
          <path :d="targetPath" fill="none" stroke="#007f82" stroke-width="4" />
          <path :d="path(x => normal(x, fit.mean, fit.sigma))" fill="none" stroke="#8854c0" stroke-width="4" stroke-dasharray="10 5" />
        </svg>
        <div class="demo-note">μ = {{ fit.mean.toFixed(2) }}, σ = {{ fit.sigma.toFixed(2) }}<br>Forward KL {{ divergences(fit.mean,fit.sigma).forward.toFixed(3) }} · Reverse KL {{ divergences(fit.mean,fit.sigma).reverse.toFixed(3) }}</div>
      </div>
    </div>
    <div v-if="isPrintMode" class="kl-legend"><span>━━ Target: two modes</span><span>┄┄ Model: one Gaussian</span></div>
    <div class="kl-explanation"><div><b>Forward KL</b><br>Missing a target mode is expensive.</div><div><b>Reverse KL</b><br>Putting model mass in the low-density gap is expensive.</div></div>
    <div class="demo-takeaway">This difference comes from restricting the model to one Gaussian. If it could match the target exactly, both KLs would be zero.</div>
  </DemoPanel>
</template>
<style scoped>
.kl-live { display: grid; grid-template-columns: 740px 1fr; gap: 30px; }
.kl-live svg { width: 100%; height: 255px; }
svg text { font: 18px Arial, sans-serif; fill: #587083; }
.kl-legend { display: flex; justify-content: center; gap: 30px; font-size: 18px; }
.kl-legend span:first-child { color: #007f82; }.kl-legend span:last-child { color: #8854c0; }
.kl-settings label { display: block; margin-bottom: 14px; font-size: 18px; }
.kl-settings label b { float: right; }
.kl-settings input { width: 100%; height: 32px; accent-color: #8854c0; display: block; }
.kl-values { padding: 12px; background: #f2f6f8; }
.kl-values b { float: right; }.kl-values small { font-size: 15px; color: #587083; }
.kl-explanation { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 20px; }
.kl-print { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; padding: 12px 0; }
.kl-print svg { width: 100%; height: 205px; }
</style>
