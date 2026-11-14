<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useNav } from '@slidev/client'
import HorizontalProcessPlot from './HorizontalProcessPlot.vue'
import L10Math from './L10Math.vue'
import { simulation, steps, T } from '../lib/process-demos.mjs'
import { forwardState, reverseState } from '../lib/demo-state'
import '../lib/demos.css'
const props=defineProps<{reverse?:boolean}>(),state=props.reverse?reverseState:forwardState
if(!['sde','pf'].includes(state.mode))state.mode='sde'
const {isPrintMode,currentSlideNo}=useNav(),running=ref(false)
let timer:ReturnType<typeof setInterval>|undefined
function pause(){clearInterval(timer);timer=undefined;running.value=false}
function step(){state.step=Math.min(steps,state.step+1);if(state.step===steps)pause()}
function run(){if(running.value)return pause();running.value=true;timer=setInterval(step,65)}
function reset(){pause();state.step=0;state.seed=42;state.mode='sde'}
watch(currentSlideNo,pause);onBeforeUnmount(pause)
const current=computed(()=>isPrintMode.value?(props.reverse?steps:40):state.step)
const data=computed(()=>simulation(!!props.reverse,isPrintMode.value?42:state.seed))
const formula=computed(()=>{
  if(!props.reverse)return String.raw`dx=\sqrt{2}\,dw,\qquad dx=-s(x,t)\,dt,\qquad s(x,t)=\partial_x\log p_t(x).`
  const mode=isPrintMode.value?'sde':state.mode
  const drift=mode==='sde'?'2\\bs(\\bx,2-\\tau)d\\tau+':'\\bs(\\bx,2-\\tau)d\\tau'
  return (isPrintMode.value?'\\text{Reverse SDE:}\\quad ':'')+'d\\bx='+drift+(mode==='pf'?'':'\\sqrt{2}d\\bw')+',\\quad t=2-\\tau'
})
const cases=computed(()=>props.reverse?[{key:'sde',name:'Reverse SDE'},{key:'pf',name:'PF-ODE'}]:[{key:'sde',name:'Forward SDE'},{key:'pf',name:'Probability flow ODE'}])
</script>
<template>
<DemoPanel class="l10-demo" :data-demo="reverse?'reverse-process':'probability-path'" :data-step="state.step" :data-seed="state.seed" :data-running="running" :data-mode="state.mode">
<div class="formula"><L10Math :formula="formula" /></div>
<div v-if="!isPrintMode" class="demo-controls"><button v-for="item in cases" :key="item.key" :aria-pressed="state.mode===item.key" @click="state.mode=item.key">{{ !reverse&&item.key==='sde'?'SDE':item.key==='pf'?'PF-ODE':item.name }}</button><label>Time <input type="range" min="0" :max="steps" step="1" v-model.number="state.step" @input="pause" aria-label="Process time"/><output>{{ (reverse?T*(1-current/steps):T*current/steps).toFixed(2) }}</output></label><button class="primary" @click="run" :disabled="state.step===steps">{{running?'Pause':'Run'}}</button><button @click="step" :disabled="running||state.step===steps">Step</button><button @click="pause();state.seed++">New noise</button><button class="demo-reset" @click="reset">Reset</button></div>
<div v-else class="print-label">{{ reverse?'From the same terminal samples at t = 2 back to t = 0.':'Same initial samples, shown from t = 0 to t = 1.33.' }}</div>
<div class="l10-legend"><span style="color:#8854c0">▥ Sample histogram</span><span style="color:#007f82">━ Target density pₜ</span><span style="color:#b65b20">━ Highlighted particle</span></div>
<div v-if="isPrintMode" class="panels">
  <HorizontalProcessPlot v-for="item in cases" :key="item.key" :trajectories="data[item.key]" :step="current" :mode="item.key" :reverse="reverse" compact />
</div>
<div v-else class="horizontal-live"><HorizontalProcessPlot :trajectories="data[state.mode]" :step="current" :mode="state.mode" :reverse="reverse" /></div>
<div class="demo-takeaway">{{reverse?'Reverse SDE and PF-ODE follow the same densities back to data, with different particle trajectories.':'The same density at every time does not require the same particle trajectories.'}}</div>
<div v-if="reverse" class="demo-note">Exact reverse conditional transitions; PF-ODE via quantiles. Reverse SDE does not retrace individual forward paths.</div>
</DemoPanel>
</template>
<style scoped>
.panels svg{height:230px}
.l10-demo .panels { grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); }
.horizontal-live svg{height:250px}
.l10-demo .demo-controls input{width:145px}
</style>
