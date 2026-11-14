<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import L11Math from './L11Math.vue'
import { denoiser, denoiserStep, cleanCenters } from '../lib/denoiser.mjs'
import { denoiserState as state } from '../lib/demo-state'
const {isPrintMode}=useNav()
const current=computed(()=>isPrintMode.value?{x:[0,2.4],sigma:2.5,ratio:.5,history:[[0,2.4]],n:0}:state)
const d=computed(()=>denoiser(current.value.x,current.value.sigma)),next=computed(()=>denoiserStep(current.value.x,current.value.sigma,current.value.sigma*current.value.ratio))
const px=(x:number)=>300+x*62,py=(y:number)=>210-y*62
const presets=[{name:'Between modes',x:[0,2.4]},{name:'Near left',x:[-3,1.5]},{name:'Near right',x:[3,2]}]
function reset(x=[0,2.4]){Object.assign(state,{x:[...x],sigma:2.5,ratio:.5,history:[[...x]],n:0})}
function step(){if(state.sigma<=0||state.n>=12)return;state.x=[...next.value];state.history.push([...state.x]);state.sigma*=state.ratio;state.n++}
const path=computed(()=>current.value.history.map((p,i)=>`${i?'L':'M'}${px(p[0])},${py(p[1])}`).join(' '))
</script>
<template>
<DemoPanel class="denoiser-demo" data-demo="denoiser-step" :data-sigma="state.sigma" :data-ratio="state.ratio" :data-n="state.n" :data-x="state.x.join(',')">
<div class="formula"><L11Math formula="\bx_{\mathrm{next}}=r\bx+(1-r)D_{\btheta}(\bx,\sigma),\qquad r=\sigma_{\mathrm{next}}/\sigma" /></div>
<div v-if="!isPrintMode" class="demo-controls"><button v-for="p in presets" :key="p.name" @click="reset(p.x)">{{p.name}}</button><label>r <input type="range" min="0" max=".9" step=".05" v-model.number="state.ratio" aria-label="Noise ratio"/><output>{{state.ratio.toFixed(2)}}</output></label><button class="primary" @click="step" :disabled="state.sigma===0||state.n===12">Step</button><button class="demo-reset" @click="reset()">Reset</button></div>
<div v-else class="print-label">One Euler step: σ = 2.5 → 1.25. The next state lies halfway to the current denoiser prediction.</div>
<div class="denoiser-body"><svg viewBox="0 0 600 350" role="img" aria-label="An Euler step towards the denoiser prediction">
<ellipse v-for="(m,i) in cleanCenters" :key="i" :cx="px(m[0])" :cy="py(m[1])" rx="43" ry="43" fill="#eaf4f3" stroke="#bbced8"/>
<circle v-for="(m,i) in cleanCenters" :key="`center-${i}`" :cx="px(m[0])" :cy="py(m[1])" r="5" fill="#587083"/>
<text x="28" y="330">Shaded: clean-data modes</text>
<path :d="path" fill="none" stroke="#b65b20" stroke-width="2"/>
<line :x1="px(current.x[0])" :y1="py(current.x[1])" :x2="px(d[0])" :y2="py(d[1])" stroke="#8854c0" stroke-width="2" stroke-dasharray="6 5"/>
<line :x1="px(current.x[0])" :y1="py(current.x[1])" :x2="px(next[0])" :y2="py(next[1])" stroke="#007f82" stroke-width="4"/>
<circle :cx="px(current.x[0])" :cy="py(current.x[1])" r="7" fill="#b65b20"/><text :x="px(current.x[0])-20" :y="py(current.x[1])-20">x</text>
<circle :cx="px(d[0])" :cy="py(d[1])" r="7" fill="#8854c0"/><text v-if="current.sigma>0" :x="px(d[0])+12" :y="py(d[1])+23">D(x, σ)</text>
<circle v-if="current.sigma>0" :cx="px(next[0])" :cy="py(next[1])" r="6" fill="#007f82"/><text v-if="current.sigma>0" :x="px(next[0])+12" :y="py(next[1])-5">x next</text>
</svg><div class="readouts"><div>Noise level <b>{{current.sigma.toPrecision(3)}} → {{(current.sigma*current.ratio).toPrecision(3)}}</b></div><p>Move partway towards the current prediction.</p><p>After each step, recompute the denoiser at the new point and noise level.</p><p>For r = 0, the final step returns the current prediction.</p></div></div>
<div class="demo-takeaway">An Euler sampling step interpolates towards the denoiser prediction. DDIM will give the same update in noise coordinates.</div>
<div class="demo-note">Exact conditional mean for a smooth two-Gaussian toy. The conditional mean can lie between modes.</div>
</DemoPanel>
</template>
<style scoped>
.formula { text-align: center; min-height: 36px; }
.demo-controls { gap: 12px; margin: 10px 0 14px; }
label { display: flex; align-items: center; gap: 10px; }
.demo-controls input { width: 110px; min-height: 44px; accent-color: #007f82; }
output { min-width: 44px; font-variant-numeric: tabular-nums; }
.denoiser-body { display: grid; grid-template-columns: 1.3fr 1fr; gap: 30px; }
.denoiser-body svg { display: block; width: 100%; height: 280px; }
svg text { font: 18px Arial; fill: #587083; }
.readouts { padding-top: 20px; line-height: 1.5; }
.readouts b { display: block; color: #007f82; }
.readouts p { margin: 12px 0; }
.print-label { text-align: center; color: #587083; margin: 14px 0; }
.demo-note { text-align: center; margin-top: 10px; }
</style>
