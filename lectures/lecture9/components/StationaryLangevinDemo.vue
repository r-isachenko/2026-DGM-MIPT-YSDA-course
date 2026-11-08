<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useNav } from '@slidev/client'
import L9Math from './L9Math.vue'
import StationaryPlot from './StationaryPlot.vue'
import { stationaryState as state } from '../lib/demo-state'
import { stationaryVariance, langevinModes, langevinConfig } from '../lib/dynamics-demos.mjs'
import '../lib/demos.css'
const {isPrintMode,currentSlideNo}=useNav(),running=ref(false)
let timer: ReturnType<typeof setInterval>|undefined
function pause(){clearInterval(timer);timer=undefined;running.value=false}
function step(){state.step=Math.min(langevinConfig.maxSteps,state.step+1);if(state.step===langevinConfig.maxSteps)pause()}
function run(){if(running.value)return pause();running.value=true;timer=setInterval(step,40)}
function choose(mode: string){pause();state.mode=mode;state.step=0}
function reset(){choose('Both')}
watch(currentSlideNo,pause);onBeforeUnmount(pause)
const cases=computed(()=>(isPrintMode.value?langevinModes:[state.mode]).map(mode=>({mode,step:isPrintMode.value?120:state.step})))
const formulas: Record<string,string>={'Drift only':'dx=-\\tfrac12 x\\,dt','Diffusion only':'dx=dw','Both':'dx=-\\tfrac12 x\\,dt+dw'}
const captions: Record<string, string> = {
  'Drift only': 'Drift pulls particles toward zero, narrowing the density.',
  'Diffusion only': 'Random steps spread the particles out, widening the density.',
  'Both': 'Drift balances diffusion, so particles move while the density stays fixed.',
}
</script>
<template>
  <DemoPanel class="l9-demo stationary-demo" data-demo="stationary-langevin" :class="{'print-demo':isPrintMode}" :data-mode="state.mode" :data-step="state.step" :data-running="running">
    <div class="l9-formula">
      <L9Math formula="p_0(x)=p_*(x)=\cN(0,1)" />
      <L9Math v-if="isPrintMode" formula="\qquad t=3" />
    </div>

    <div v-if="!isPrintMode" class="demo-controls l9-controls">
      <button v-for="mode in langevinModes" :key="mode" :aria-pressed="state.mode===mode" @click="choose(mode)">{{ mode }}</button>
      <label>Time
        <input v-model.number="state.step" type="range" min="0" :max="langevinConfig.maxSteps" step="1" aria-label="Langevin time step" @input="pause" />
        <output>{{ (state.step * langevinConfig.dt).toFixed(2) }}</output>
      </label>
      <button class="primary" :disabled="state.step===langevinConfig.maxSteps" @click="run">{{ running ? 'Pause' : 'Run' }}</button>
      <button :disabled="running || state.step===langevinConfig.maxSteps" @click="step">Step</button>
      <button @click="reset">Reset</button>
    </div>

    <div class="stationary-cases">
      <div v-for="item in cases" :key="item.mode">
        <div class="l9-heading">
          <span v-if="isPrintMode">{{ item.mode }} · </span><L9Math :formula="formulas[item.mode]" />
          <span v-if="!isPrintMode" class="variance">Variance {{ stationaryVariance(item.mode, item.step * langevinConfig.dt).toFixed(2) }}</span>
        </div>
        <StationaryPlot :mode="item.mode" :step="item.step" :wide="!isPrintMode"
          :plot-id="`stationary-${item.mode.replaceAll(' ','-')}-${isPrintMode?'print':'live'}`" />
        <div v-if="isPrintMode" class="variance">Variance {{ stationaryVariance(item.mode, item.step * langevinConfig.dt).toFixed(2) }}</div>
        <p class="caption">{{ captions[item.mode] }}</p>
      </div>
    </div>

    <div class="l9-legend">
      <span><i class="histogram"></i>Histogram</span>
      <span><i class="density"></i>Exact density</span>
      <span><i class="target"></i>Target density</span>
    </div>
  </DemoPanel>
</template>
<style scoped>
.stationary-demo .l9-controls { justify-content: center; }
.l9-controls input { width: 130px; }
.stationary-cases :deep(svg) { height: 320px; }
.variance { text-align: center; font-variant-numeric: tabular-nums; }
.l9-heading .variance { margin-left: 24px; color: #587083; font-weight: 400; }
.stationary-demo .caption { margin: 4px 0 0; text-align: center; }
.stationary-demo .l9-legend { margin-top: 12px; color: #587083; }
.l9-legend span { display: inline-flex; align-items: center; gap: 7px; }
.l9-legend i { width: 22px; }
.histogram { height: 10px; background: #8854c040; }
.density { border-top: 3px solid #007f82; }
.target { border-top: 2px dashed #587083; }
.print-demo .stationary-cases { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
.print-demo .stationary-cases :deep(svg) { height: 284px; }
</style>
