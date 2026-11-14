<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { transport, transportPoints } from '../lib/transport.mjs'
import { transportState as state } from '../lib/demo-state'
const {isPrintMode}=useNav(),t=computed(()=>isPrintMode.value?.5:state.t)
const modes=['Direct','Detour','Rotation'],px=(x:number)=>200+x*38,py=(y:number)=>150-y*38
const path=(z:number[],mode:string,end=1)=>Array.from({length:61},(_,i)=>{const p=transport(z,end*i/60,mode);return `${i?'L':'M'}${px(p[0])},${py(p[1])}`}).join(' ')
const arrow=(z:number[],mode:string)=>{const h=1e-4,a=transport(z,t.value-h,mode),b=transport(z,t.value+h,mode),p=transport(z,t.value,mode);return {x:px(p[0]),y:py(p[1]),ex:px(p[0]+.09*(b[0]-a[0])/(2*h)),ey:py(p[1]+.09*(b[1]-a[1])/(2*h))}}
const ellipse=(time:number,mode:string)=>Array.from({length:81},(_,i)=>{const a=2*Math.PI*i/80,p=transport([1.5*Math.cos(a),1.5*Math.sin(a)],time,mode);return `${i?'L':'M'}${px(p[0])},${py(p[1])}`}).join(' ')+'Z'
</script>
<template>
<DemoPanel class="transport-demo" data-demo="transport-paths" :data-t="state.t">
<div v-if="!isPrintMode" class="demo-controls"><label>Time <input type="range" min="0" max="1" step=".01" v-model.number="state.t" aria-label="Transport time"/><output>{{t.toFixed(2)}}</output></label><button v-for="v in [0,.25,.5,.75,1]" :key="v" @click="state.t=v">{{v}}</button><button class="demo-reset" @click="state.t=.5">Reset</button></div>
<div v-else class="print-label">All three flows at t = 0.5. Dashed contours mark the common endpoint densities.</div>
<div class="panels"><div v-for="mode in modes" :key="mode"><div class="mode-name">{{mode}}</div><svg viewBox="0 0 400 300" role="img" :aria-label="`${mode} flow with fixed endpoint distributions`">
<defs><marker :id="`velocity-${mode}-${isPrintMode}`" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="#17324d"/></marker></defs>
<path v-for="time in [0,1]" :key="time" :d="ellipse(time,mode)" fill="none" stroke="#9cabb4" stroke-dasharray="5 5"/>
<path :d="ellipse(t,mode)" fill="#eaf4f3" stroke="#007f82" stroke-width="1.5"/>
<path v-for="(z,i) in transportPoints.slice(0,5)" :key="`path-${i}`" :d="path(z,mode)" fill="none" stroke="#8854c0" opacity=".55"/>
<circle v-for="(z,i) in transportPoints" :key="i" :cx="px(transport(z,t,mode)[0])" :cy="py(transport(z,t,mode)[1])" r="2.3" fill="#007f82" opacity=".65"/>
<line v-for="(z,i) in transportPoints.slice(0,5)" :key="`velocity-${i}`" :x1="arrow(z,mode).x" :y1="arrow(z,mode).y" :x2="arrow(z,mode).ex" :y2="arrow(z,mode).ey" stroke="#17324d" stroke-width="1.6" :marker-end="`url(#velocity-${mode}-${isPrintMode})`"/>
<circle :cx="px(transport(transportPoints[0],t,mode)[0])" :cy="py(transport(transportPoints[0],t,mode)[1])" r="5" fill="#b65b20"/>
<text :x="px(-2)" y="275" text-anchor="middle">p₀ · noise</text><text :x="px(2)" y="275" text-anchor="middle">p₁ · data</text>
</svg></div></div>
<div class="demo-takeaway">Many velocity fields connect the same endpoints. Choose a path with a tractable training objective.</div>
<div class="demo-note">Intermediate densities may differ. Purple: trajectories; arrows: velocities; orange: one shared particle.</div>
</DemoPanel>
</template>

<style scoped>
.demo-controls { gap: 12px; margin: 10px 0 14px; }
label { display: flex; align-items: center; gap: 10px; }
input { width: 170px; min-height: 44px; accent-color: #007f82; }
output { min-width: 44px; font-variant-numeric: tabular-nums; }
.panels { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.mode-name { text-align: center; font-weight: 650; color: #17324d; margin-bottom: 6px; }
.panels svg { display: block; width: 100%; height: 250px; }
svg text { font: 18px Arial; fill: #587083; }
.demo-note { text-align: center; margin-top: 10px; }
.print-label { text-align: center; color: #587083; margin: 14px 0; }
</style>
