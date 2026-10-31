<script setup lang="ts">
import { computed, useId } from 'vue'
import { conditionalPaths, ddimConfig, ddimStep, predictor, samplePath, sharedNoisePath } from '../lib/ddim-demo.mjs'

const props = withDefaults(defineProps<{
  mode: 'forward' | 'sampling'
  known?: 'unknown' | 'minus' | 'plus'
  startX?: number
  stage?: number
  width?: number
  height?: number
}>(), { known: 'unknown', startX: ddimConfig.initialX, stage: 0, width: 760, height: 310 })
const id = 'ddim-plot-' + useId().replace(/[^a-z0-9-]/gi, '')
const frame = computed(() => ({ left: 58, right: props.width-22, top: 28, bottom: props.height-58 }))
const px = (u: number) => frame.value.left+8+u*(frame.value.right-frame.value.left-16)
const py = (x: number) => {
  const span = ddimConfig.bounds.xmax - ddimConfig.bounds.xmin
  const offset = x - ddimConfig.bounds.xmin
  const fraction = offset / span
  const height = frame.value.bottom - frame.value.top - 16
  const pixels = fraction * height
  return frame.value.bottom - 8 - pixels
}
const path = (points: {u:number,x:number}[]) => points.map((p,i) => `${i?'L':'M'}${px(p.u).toFixed(3)},${py(p.x).toFixed(3)}`).join(' ')
const candidates = computed(() => conditionalPaths(props.startX,ddimConfig.initialU).map((p:any,i:number) => ({
  ...p, name: i===0?'A':'B', key: i===0?'minus':'plus', color: i===0?'#264c70':'#8854c0',
  d: path(samplePath(p.clean,p.noise)), future: sharedNoisePath(p.clean,p.noise,ddimConfig.futureU),
})))
const transition = computed(() => ddimStep(props.startX,ddimConfig.initialU,.1))
const current = computed(() => props.mode==='sampling' && props.stage>=3 ? transition.value.to : transition.value.from)
const prediction = computed(() => props.stage===4 ? predictor(transition.value.to.x,transition.value.to.u) : transition.value.prediction)
const guide = computed(() => path(samplePath(prediction.value.clean,prediction.value.noise,0,props.stage===4?transition.value.to.u:transition.value.from.u)))
const realized = computed(() => path(samplePath(transition.value.prediction.clean,transition.value.prediction.noise,transition.value.from.u,transition.value.to.u,61)))
const visible = (key:string) => props.known==='unknown'||props.known===key
const fmt = (x:number) => (Math.abs(x)<.005?0:x).toFixed(2)
const fmtPrediction = (x:number) => x.toFixed(3)
const arrowFrom = computed(() => props.mode==='forward' ? ddimConfig.initialU+.025 : transition.value.from.u)
const arrowTo = computed(() => props.mode==='forward' ? ddimConfig.futureU-.025 : transition.value.to.u)
</script>

<template>
  <svg class="ddim-plot" :viewBox="`0 0 ${width} ${height}`" :width="width" :height="height" role="img" :aria-label="mode==='forward'?'Two shared-noise paths through the same observation, conditioned on different clean states':'One DDIM transition: estimate, fix a path, preview, move, then predict again'">
    <defs>
      <clipPath :id="id+'-clip'"><rect :x="frame.left" :y="frame.top" :width="frame.right-frame.left" :height="frame.bottom-frame.top" /></clipPath>
      <marker :id="id+'-arrow'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#587083" /></marker>
    </defs>
    <rect :x="frame.left" :y="frame.top" :width="frame.right-frame.left" :height="frame.bottom-frame.top" fill="white" stroke="#bbced8" />
    <line :x1="frame.left" :x2="frame.right" :y1="py(0)" :y2="py(0)" stroke="#dce5eb" />
    <text :x="frame.left" y="19">State x</text>
    <text v-for="x in [-2,0,2]" :key="x" :x="frame.left-10" :y="py(x)+6" text-anchor="end">{{ x }}</text>
    <text v-for="u in [0,.5,1]" :key="u" :x="px(u)" :y="height-34" text-anchor="middle">{{ u }}</text>
    <text :x="(frame.left+frame.right)/2" :y="height-7" text-anchor="middle">Noise variance u</text>
    <line :x1="px(ddimConfig.initialU)" :x2="px(ddimConfig.initialU)" :y1="frame.top" :y2="frame.bottom" stroke="#b5c8d3" />
    <g v-if="mode==='forward'">
      <line :x1="px(ddimConfig.futureU)" :x2="px(ddimConfig.futureU)" :y1="frame.top" :y2="frame.bottom" stroke="#dce5eb" />
      <text :x="px(ddimConfig.initialU)" y="19" text-anchor="middle">Current</text>
      <text :x="px(ddimConfig.futureU)" y="19" text-anchor="middle">Next</text>
      <g v-for="p in candidates" :key="p.key" :opacity="visible(p.key)?1:.16">
        <path :d="p.d" fill="none" :stroke="p.color" stroke-width="2.6" :stroke-dasharray="p.key==='plus'?'7 4':undefined" :clip-path="`url(#${id}-clip)`" />
        <circle :cx="px(0)" :cy="py(p.clean)" r="5" :fill="p.color" />
        <text :x="px(0)+10" :y="py(p.clean)+(p.clean>0?-10:24)">{{ p.name }}: x₀ = {{ p.clean }}</text>
        <circle v-if="p.key==='minus'" :data-future-origin="p.key" :cx="px(ddimConfig.futureU)" :cy="py(p.future)" r="6" :fill="p.color" />
        <rect v-else :data-future-origin="p.key" :x="px(ddimConfig.futureU)-5" :y="py(p.future)-5" width="10" height="10" :fill="p.color" />
        <text :x="px(ddimConfig.futureU)-10" :y="py(p.future)+(p.key==='minus'?-12:26)" text-anchor="end">{{ p.name }}: {{ fmt(p.future) }}</text>
      </g>
    </g>
    <g v-else>
      <g v-if="stage===0" opacity=".4">
        <g v-for="p in candidates" :key="p.key">
          <path :d="path(samplePath(p.clean,p.noise,0,ddimConfig.initialU))" fill="none" :stroke="p.color" stroke-width="2" stroke-dasharray="3 5" />
          <circle :cx="px(0)" :cy="py(p.clean)" r="5" :fill="p.color" />
          <text :x="px(0)+10" :y="py(p.clean)+(p.clean>0?-12:24)">{{ p.name }}: x₀ = {{ p.clean }}</text>
        </g>
      </g>
      <line v-if="stage>=2" :x1="px(transition.to.u)" :x2="px(transition.to.u)" :y1="frame.top" :y2="frame.bottom" stroke="#007f82" stroke-dasharray="3 5" />
      <text v-if="stage>=2" :x="px(transition.to.u)" :y="height-34" text-anchor="middle" class="estimate-text">0.10</text>
      <path v-if="stage>=1" data-current-guide :d="guide" fill="none" stroke="#007f82" stroke-width="2.8" stroke-dasharray="8 5" :clip-path="`url(#${id}-clip)`" />
      <path v-if="stage>=3" data-realized-path :d="realized" fill="none" stroke="#17324d" stroke-width="3.3" />
      <circle v-if="stage>=3" data-start-state :cx="px(transition.from.u)" :cy="py(transition.from.x)" r="5" fill="white" stroke="#17324d" stroke-width="2" />
      <text v-if="stage>=3" :x="px(transition.from.u)+12" :y="py(transition.from.x)-13">xₜ = {{fmtPrediction(transition.from.x)}}</text>
      <circle data-estimated-origin :cx="px(0)" :cy="py(prediction.clean)" r="5.5" fill="#007f82" />
      <text :x="px(0)+10" :y="py(prediction.clean)-18" class="estimate-text">x̂₀ ≈ {{prediction.clean.toFixed(4)}}</text>
      <circle v-if="stage===2" data-next-state :cx="px(transition.to.u)" :cy="py(transition.to.x)" r="7" fill="white" stroke="#007f82" stroke-width="2.5" />
      <text v-if="stage>=2" :x="px(transition.to.u)+12" :y="py(transition.to.x)+27">xₛ = {{fmtPrediction(transition.to.x)}}</text>
    </g>
    <circle data-current-state :cx="px(current.u)" :cy="py(current.x)" r="6.5" fill="#e17838" stroke="white" stroke-width="1.5" />
    <text v-if="mode==='forward'" :x="px(current.u)+12" :y="py(current.x)-13">xₜ</text>
    <text v-else-if="stage<3" :x="px(current.u)+12" :y="py(current.x)-13">xₜ = {{fmtPrediction(current.x)}}</text>
    <line v-if="mode==='forward' || stage>=2" :x1="px(arrowFrom)" :x2="px(arrowTo)" :y1="frame.bottom-15" :y2="frame.bottom-15" stroke="#587083" stroke-width="1.5" :marker-end="`url(#${id}-arrow)`" />
  </svg>
</template>

<style scoped>
.ddim-plot{display:block;max-width:100%;overflow:visible}
.ddim-plot text{font:18px Arial;fill:#587083}
.ddim-plot text.estimate-text{fill:#007f82;paint-order:stroke fill;stroke:white;stroke-width:5px;stroke-linejoin:round}
</style>
