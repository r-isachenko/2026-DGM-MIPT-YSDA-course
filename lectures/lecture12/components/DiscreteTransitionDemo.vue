<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { tokens, transition, tokenDistribution, retention, sampleChain, beta } from '../lib/demos.mjs'
import { discreteState as state } from '../lib/demo-state'
const props = defineProps<{ mode: 'uniform' | 'absorbing' }>()
const { isPrintMode } = useNav()
const t = computed(() => isPrintMode.value ? 4 : state.t)
const start = computed(() => isPrintMode.value ? 0 : state.start)
const matrix = computed(() => transition(props.mode, retention(t.value)))
const distribution = computed(() => tokenDistribution(props.mode, t.value, start.value))
const chain = computed(() => sampleChain(props.mode, start.value))
const color = (p: number) => `rgba(0,127,130,${.05+.7*p})`
function reset() { state.t = 4; state.start = 0 }
</script>
<template>
<DemoPanel data-demo="discrete-transition" :data-mode="mode" :data-t="t" :data-start="start" :data-probabilities="distribution.join(',')">
  <div v-if="!isPrintMode" class="demo-controls">
    <label>t <input aria-label="Discrete time" type="range" min="0" max="20" step="1" v-model.number="state.t"/><output>{{t}}</output></label>
    <button @click="state.t=Math.min(20,state.t+1)" :disabled="t===20">Step</button>
    <span>Clean token</span><button v-for="(token,i) in tokens.slice(0,3)" :key="token" :aria-pressed="start===i" @click="state.start=i">{{token}}</button>
    <span class="demo-note">β = {{beta}} · K = 4</span><button class="demo-reset" @click="reset">Reset</button>
  </div>
  <div v-else class="print-context">Clean token A · β = 0.25 · K = 4 · matrix at t = 4; distributions at t = 0, 4, 20.</div>
  <div class="plots">
    <svg viewBox="0 0 480 240" role="img" aria-label="Cumulative transition matrix; columns are clean states, rows are current states">
      <text x="238" y="20" text-anchor="middle">Q<tspan baseline-shift="sub" font-size="70%">1:t</tspan> · columns: initial state</text>
      <g v-for="(row,i) in matrix" :key="i">
        <text x="88" :y="79+38*i" text-anchor="end">{{tokens[i]}}</text>
        <g v-for="(p,j) in row" :key="j">
          <rect :x="105+70*j" :y="53+38*i" width="68" height="36" :fill="color(p)" :stroke="j===start?'#8854c0':'white'" :stroke-width="j===start?2:1"/>
          <text :x="139+70*j" :y="78+38*i" text-anchor="middle" :style="{fill:p>.7?'white':'#17324d'}">{{p.toFixed(2)}}</text>
        </g>
      </g>
      <text v-for="(token,j) in tokens" :key="token" :x="139+70*j" y="46" text-anchor="middle">{{token}}</text>
      <text x="238" y="224" text-anchor="middle">Highlighted column = q(xₜ | x₀)</text>
    </svg>
    <svg viewBox="0 0 590 240" role="img" aria-label="Exact categorical probabilities">
      <text x="300" y="20" text-anchor="middle">{{isPrintMode?'Probability · 0 → 4 → 20 steps':`Exact probabilities · t = ${t}`}}</text>
      <g v-for="(token,i) in tokens" :key="token">
        <template v-if="!isPrintMode">
          <rect :x="60+130*i" :y="175-130*distribution[i]" width="70" :height="130*distribution[i]" :fill="i===start?'#8854c0':'#007f82'"/>
          <text :x="95+130*i" :y="165-130*distribution[i]" text-anchor="middle">{{distribution[i].toFixed(3)}}</text>
        </template>
        <template v-else>
          <rect v-for="(time,j) in [0,4,20]" :key="time" :x="50+135*i+25*j" :y="175-130*tokenDistribution(mode,time,0)[i]" width="22" :height="130*tokenDistribution(mode,time,0)[i]" :fill="['#bbced8','#8854c0','#007f82'][j]"/>
        </template>
        <text :x="isPrintMode?86+135*i:95+130*i" y="200" text-anchor="middle">{{token}}</text>
      </g>
      <line x1="40" y1="175" x2="575" y2="175" stroke="#bbced8"/>
      <text x="300" y="224" text-anchor="middle">{{isPrintMode?'Gray: 0 · purple: 4 · teal: 20':`ᾱₜ = ${retention(t).toFixed(3)} · total probability = 1`}}</text>
    </svg>
  </div>
  <div class="demo-note" v-if="!isPrintMode">One sampled chain (fixed noise): {{chain.slice(0,Math.min(t,7)+1).map(i=>tokens[i]).join(' → ')}}{{t>7 ? ` → … → ${tokens[chain[t]]}` : ''}}</div>
  <div class="demo-note" v-else>{{mode==='uniform'?'Limit: 0.25 per state, including the original token.':'Limit: all probability at [MASK]; once masked, a sampled token stays masked.'}}</div>
</DemoPanel>
</template>
<style scoped>
.plots{display:grid;grid-template-columns:480px 1fr;gap:15px}.plots svg{width:100%;height:240px}.plots text{font:18px Arial;fill:#587083}.demo-controls{margin:0 0 5px;gap:10px}.demo-controls label{display:flex;gap:10px;align-items:center}.demo-controls input{width:210px}.demo-controls output{width:30px;font-variant-numeric:tabular-nums}.print-context{height:49px;padding-top:10px;color:#587083;font-size:18px}.demo-note{margin-top:4px}
</style>
