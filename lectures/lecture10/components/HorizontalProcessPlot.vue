<script setup lang="ts">
import { computed } from 'vue'
import { density, histogram, steps, T } from '../lib/process-demos.mjs'
const props=defineProps<{ trajectories:number[][], step:number, mode:string, compact?:boolean, reverse?:boolean }>()
const layout = computed(() => {
  if (props.compact) {
    if (props.mode === 'sde') return { width: 400, start: 38, end: 210, densityStart: 260, densityScale: 220 }
    return { width: 800, start: 38, end: 560, densityStart: 635, densityScale: 220 }
  }
  return { width: 1120, start: 55, end: 538, densityStart: 648, densityScale: 835 }
})
const y=(x:number)=>45+(9-x)/18*160
const tx=(j:number)=>layout.value.start+j/steps*(layout.value.end-layout.value.start)
const dx=(p:number)=>layout.value.densityStart+p*layout.value.densityScale
const time=computed(()=>T*(props.reverse?1-props.step/steps:props.step/steps))
const ticks=computed(()=>[0,.5,1,1.5,2])
const title=computed(()=>props.mode==='sde'?(props.reverse?'Reverse SDE':'SDE trajectories'):'PF-ODE trajectories')
const line=computed(()=>Array.from({length:181},(_,i)=>{const x=-9+i*.1;return `${i?'L':'M'}${dx(density(x,time.value))},${y(x)}`}).join(' '))
const bars=computed(()=>histogram(props.trajectories[props.step]))
const paths=computed(()=>Array.from({length:8},(_,i)=>props.trajectories.slice(0,props.step+1).map((row,j)=>`${j?'L':'M'}${tx(j)},${y(row[i])}`).join(' ')))
</script>
<template>
<svg :viewBox="`0 0 ${layout.width} 250`" role="img" :aria-label="`${mode} with horizontal time axis and current density`" data-horizontal-process>
<text :x="layout.start" y="21">{{title}}</text>
<text :x="layout.densityStart-15" y="21">{{compact?'Density pₜ':'Current density pₜ'}}</text>
<g v-for="x in [-8,-4,0,4,8]" :key="x"><line :x1="layout.start" :y1="y(x)" :x2="layout.end" :y2="y(x)" stroke="#edf1f4"/><text :x="layout.start-12" :y="y(x)+5" text-anchor="end">{{x}}</text></g>
<text x="9" y="37">x</text>
<line :x1="layout.start" y1="45" :x2="layout.start" y2="205" stroke="#bbced8"/><line :x1="layout.start" y1="205" :x2="layout.end" y2="205" stroke="#bbced8"/>
<path v-for="(d,i) in paths" :key="i" :d="d" fill="none" :stroke="i===0?'#b65b20':'#8854c0'" :stroke-width="i===0?2.7:1.2" :opacity="i===0?1:.65"/>
<line :x1="tx(step)" y1="42" :x2="tx(step)" y2="205" stroke="#587083" stroke-dasharray="4 4"/>
<circle v-for="i in 8" :key="`point-${i}`" :cx="tx(step)" :cy="y(trajectories[step][i-1])" :r="i===1?4:2.5" :fill="i===1?'#b65b20':'#8854c0'"/>
<text v-for="t in ticks" :key="t" :x="tx(t/T*steps)" y="230" text-anchor="middle">{{reverse?T-t:t}}</text><text :x="layout.end" y="248" text-anchor="end">time t →</text>
<rect v-for="(b,i) in bars" :key="i" :x="layout.densityStart" :y="y(b.x+b.w)" :width="dx(b.y)-layout.densityStart" :height="160/48-0.5" fill="#8854c0" opacity=".4"/>
<path :d="line" fill="none" stroke="#007f82" stroke-width="2.8"/><line :x1="layout.densityStart" y1="45" :x2="layout.densityStart" y2="205" stroke="#bbced8"/>
<text :x="layout.densityStart" y="230">t = {{time.toFixed(2)}}</text>
</svg>
</template>
