<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import L8Math from './L8Math.vue'
import { colors, curvePath, densityAt, gammaPresets } from '../lib/guidance-demos.mjs'
import { densityState as state } from '../lib/demo-state'
const { isPrintMode } = useNav()
const cases = computed(() => (isPrintMode.value ? gammaPresets : [state.gamma]).map(gamma => ({ gamma, ...densityAt(gamma, isPrintMode.value ? 1 : state.label) })))
const width = computed(() => isPrintMode.value ? 224 : 748), height = computed(() => isPrintMode.value ? 180 : 253)
const name = (gamma: number) => gamma === 0 ? 'Unconditional' : gamma === 1 ? 'Conditional' : 'Extra guidance'
function reset() { state.gamma = 1; state.label = 1 }
</script>
<template>
  <DemoPanel data-demo="guidance-density" :data-gamma="state.gamma" :data-label="state.label" :class="{'print-demo':isPrintMode}">
    <div class="control-space">
      <div v-if="!isPrintMode" class="demo-controls">
        <span>Target class</span><button v-for="label in [0,1]" :key="label" @click="state.label=label" :aria-pressed="state.label===label">{{ label===0 ? 'A' : 'B' }}</button>
        <label><L8Math formula="\gamma" /><input v-model.number="state.gamma" aria-label="Density guidance scale" type="range" min="0" max="7" step=".1" /><output>{{ state.gamma.toFixed(1) }}</output></label>
        <button v-for="gamma in gammaPresets" :key="gamma" @click="state.gamma=gamma" :aria-pressed="state.gamma===gamma">{{ gamma }}</button>
        <button class="demo-reset" @click="reset">Reset</button>
      </div>
      <div v-else class="print-context">Same one-dimensional toy and target class B; only γ changes.</div>
    </div>
    <div class="legend"><span :style="{color:colors.unconditional}"><L8Math formula="q(x_t)" /></span><span :style="{color:colors.classifier}"><L8Math formula="q(x_t|y)" /> · dashed</span><span :style="{color:colors.guided}"><L8Math formula="q_\gamma(x_t|y)" /></span></div>
    <div class="density-body">
      <div class="cases">
        <div v-for="example in cases" :key="example.gamma" class="case">
          <div v-if="isPrintMode" class="case-title"><b>γ = {{ example.gamma }}</b><span>{{ name(example.gamma) }}</span></div>
          <svg :viewBox="`0 0 ${width+62} ${height+47}`" class="density-plot" role="img" :aria-label="`Unconditional, conditional and normalized scaled densities at gamma ${example.gamma}`">
            <line x1="42" y1="14" x2="42" :y2="height+14" stroke="#bbced8" /><line x1="42" :y1="height+14" :x2="width+42" :y2="height+14" stroke="#bbced8" />
            <g v-for="value in [0,.3,.6,.9]" :key="value"><text x="34" :y="14+height*(1-value/.95)+6" text-anchor="end">{{ value.toFixed(1) }}</text></g>
            <g transform="translate(42 14)"><path :d="curvePath(example.points,'unconditional',width,height)" fill="none" :stroke="colors.unconditional" stroke-width="2.5" /><path :d="curvePath(example.points,'conditional',width,height)" fill="none" :stroke="colors.classifier" stroke-width="2.5" stroke-dasharray="6 4" /><path :d="curvePath(example.points,'guided',width,height)" fill="none" :stroke="colors.guided" stroke-width="3.5" /></g>
            <g v-for="x in [-4,-2,0,2,4]" :key="x"><text :x="42+(x+5)/10*width" :y="height+40" text-anchor="middle">{{ x }}</text></g>
            <text :x="width+57" :y="height+40" text-anchor="end">xₜ</text>
          </svg>
        </div>
      </div>
      <div v-if="!isPrintMode" class="interpretation">
        <div><strong>γ = 0</strong><span>Unconditional density.</span></div>
        <div><strong>γ = 1</strong><span>Conditional density.</span></div>
        <div><strong>γ &gt; 1</strong><span>Amplify regions favored by the classifier.</span></div>
        <div class="demo-note normalization">The density is normalized for every γ.</div>
      </div>
    </div>
    <div class="demo-takeaway">Increasing γ shifts mass toward regions with higher classifier confidence.</div>
    <div class="demo-note bottom-note">A 1D Gaussian-mixture example at a fixed noise level. This plot describes a density at that level.</div>
  </DemoPanel>
</template>
<style scoped>
.control-space{height:50px}
.demo-controls{gap:9px}
.demo-controls>span{font-size:18px}
label{display:flex;align-items:center;gap:10px;margin-left:12px}
input{width:190px;min-height:44px;accent-color:#007f82}
output{width:36px;font-variant-numeric:tabular-nums}
.print-context{text-align:center;padding-top:10px;color:#587083}
.legend{display:flex;justify-content:center;gap:50px;font-size:20px;height:30px}
.density-body{display:grid;grid-template-columns:810px 1fr;gap:25px}
.density-plot{display:block;width:100%;height:300px}
.density-plot text{font:18px Arial;fill:#587083}
.interpretation{border-left:1px solid #dce5eb;padding:10px 0 0 20px;font-size:19px}
.interpretation>div{margin-top:14px}
.interpretation strong,.interpretation span{display:block}
.interpretation span{margin-top:4px}
.normalization{line-height:1.35}
.demo-takeaway{margin-top:12px;padding:10px 16px}
.bottom-note{margin-top:9px}
.print-demo .density-body{display:block;margin-top:13px}
.print-demo .cases{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.print-demo .density-plot{height:227px}
.case-title{display:flex;flex-direction:column;gap:5px;text-align:center;margin-bottom:6px}
.case-title b{color:#b58a25;font-size:22px}
.case-title span{color:#587083;font-size:18px}
.print-demo .demo-takeaway{margin-top:20px}

</style>
