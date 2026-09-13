<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { noiseCloud, coupling, couplingLogDet } from '../lib/flow-models.mjs'
const { isPrintMode } = useNav()
const step = ref(0)
const strength = ref(1)
const amount = computed(() => isPrintMode.value ? 1 : strength.value)
const shown = computed(() => isPrintMode.value ? 2 : step.value)
const base = noiseCloud()
const first = computed(() => base.map(p => coupling(p, 1, amount.value)))
const second = computed(() => first.value.map(p => coupling(p, 0, amount.value)))
const clouds = computed(() => [base, first.value, second.value])
const selectedLogDet = computed(() => shown.value === 0 ? 0 : couplingLogDet(base[0], 1, amount.value) + (shown.value === 2 ? couplingLogDet(first.value[0], 0, amount.value) : 0))
const axis = computed(() => shown.value === 2 ? 0 : 1)
const condition = computed(() => axis.value === 1 ? 'z_1' : 'y_2')
const activeJacobian = computed(() => axis.value === 1 ? '\\frac{\\partial\\by}{\\partial\\bz}=\\begin{pmatrix}1&0\\\\ *&\\sigma(z_1)\\end{pmatrix}' : '\\frac{\\partial\\bx}{\\partial\\by}=\\begin{pmatrix}\\sigma(y_2)&*\\\\0&1\\end{pmatrix}')
function reset() { step.value = 0; strength.value = 1 }
</script>
<template>
  <DemoPanel data-demo="coupling" :data-step="shown" :data-strength="amount" :data-log-det="selectedLogDet">
    <div v-if="!isPrintMode" class="demo-controls">
      <button class="primary" :disabled="step === 2" @click="step++">Apply layer {{ Math.min(step + 1, 2) }}</button>
      <button :disabled="step === 0" @click="step--">Invert last layer</button>
      <label>Strength <FlowMath formula="\lambda" /><input type="range" aria-label="Coupling strength" min="0" max="1" step="0.1" v-model.number="strength" /><output>{{ strength.toFixed(1) }}</output></label>
      <button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div class="coupling-planes">
      <div v-for="(cloud, k) in clouds" :key="k" class="coupling-card" :class="{ upcoming: k > shown, active: k === shown }">
        <h2>{{ ['Base noise', 'Layer 1: vertical motion', 'Layer 2: horizontal motion'][k] }}</h2>
        <div class="plane-wrap">
          <FlowPlane :points="k <= shown ? cloud : clouds[shown]" :previous-points="k > 0 && k <= shown ? clouds[k - 1] : undefined" :fixed-axis="k === 1 ? 0 : 1" :range="3.4" :color="k > shown ? '#aabac5' : k === 2 ? '#8854c0' : '#007f82'" :label="['Base Gaussian cloud', 'Vertical motion preserves the horizontal coordinate', 'Horizontal motion preserves the vertical coordinate'][k]" :highlighted="0" />
          <span v-if="k > shown" class="pending-label">Apply the next layer</span>
        </div>
        <FlowMath :formula="['\\bz\\sim\\cN(0,0.65^2\\bI)', 'y_1=z_1,\\quad y_2=\\sigma(z_1)z_2+\\mu(z_1)', 'x_2=y_2,\\quad x_1=\\sigma(y_2)y_1+\\mu(y_2)'][k]" />
      </div>
    </div>
    <div class="coupling-functions"><FlowMath :formula="`\\sigma(t)=e^{0.4\\lambda\\tanh(t)},\\quad\\mu(t)=0.8\\lambda\\tanh(t),\\quad\\lambda=${amount.toFixed(1)}`" /><span class="demo-note">Dashed: fixed coordinate. Hollow: previous position.</span></div>
    <div class="coupling-detail" aria-live="polite">
      <template v-if="isPrintMode">
        <FlowMath formula="\frac{\partial\by}{\partial\bz}=\begin{pmatrix}1&0\\ *&\sigma(z_1)\end{pmatrix}" />
        <FlowMath formula="\frac{\partial\bx}{\partial\by}=\begin{pmatrix}\sigma(y_2)&*\\0&1\end{pmatrix}" />
        <span>Triangular Jacobians.<br>Positive, explicit scales.</span>
      </template>
      <template v-else>
        <FlowMath :formula="activeJacobian" />
        <FlowMath :formula="`\\det\\bJ_{\\mathrm{layer}}=\\sigma(${condition})>0`" />
        <span class="demo-note">Orange point, applied layers:<br><FlowMath :formula="`\\log|\\det\\bJ_{\\mathrm{gen}}|=${selectedLogDet.toFixed(3)}`" /></span>
      </template>
    </div>
    <div class="demo-takeaway">The conditioner stays fixed: undo the shift, divide by the scale. For density evaluation, negate the generative log-determinant.</div>
  </DemoPanel>
</template>
<style scoped>
label { display: flex; align-items: center; gap: 12px; margin-left: 18px; }
input { accent-color: #007f82; width: 150px; min-height: 44px; }
output { min-width: 34px; font-variant-numeric: tabular-nums; }
.coupling-planes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.coupling-card { border-top: 3px solid #dce5eb; padding-top: 10px; text-align: center; }
.coupling-card.active { border-color: #007f82; }
.coupling-card h2 { font-size: 20px; margin: 0; }
.coupling-card > span { font-size: 17px; }
.plane-wrap { position: relative; }
.plane-wrap :deep(svg) { height: 210px; }
.pending-label { position: absolute; left: 0; right: 0; bottom: 28px; color: #587083; font-size: 16px; background: white; }
.coupling-functions { display: flex; gap: 22px; align-items: center; justify-content: center; margin: 15px 0 8px; font-size: 19px; }
.coupling-detail { display: flex; justify-content: space-around; align-items: center; height: 76px; gap: 20px; font-size: 20px; }
.demo-takeaway { margin-top: 8px; font-size: 19px; }
</style>
