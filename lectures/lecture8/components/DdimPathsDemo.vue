<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { ddimState as state } from '../lib/ddim-demo-state'
import { conditionalPaths, ddimConfig, ddimStep, predictor } from '../lib/ddim-demo.mjs'
import L8Math from './L8Math.vue'
import DdimPathPlot from './DdimPathPlot.vue'

const { isPrintMode } = useNav()
const transition = ddimStep(ddimConfig.initialX, ddimConfig.initialU, .1)
const newPrediction = predictor(transition.to.x, transition.to.u)
const candidates = conditionalPaths(ddimConfig.initialX, ddimConfig.initialU)
const current = computed(() => state.mode === 'sampling' && state.stage >= 3 ? transition.to : transition.from)
const prediction = computed(() => state.mode === 'sampling' && state.stage === 4 ? newPrediction : transition.prediction)
const probabilities = computed(() => state.known === 'unknown' ? candidates.map((p:any) => p.weight) : state.known === 'minus' ? [1,0] : [0,1])
const fmt = (x:number) => (Math.abs(x) < .0005 ? 0 : x).toFixed(3)
const fmtClean = (x:number) => x.toFixed(4)
const percent = (x:number) => (100*x).toFixed(1)+'%'
const stages = [
  { title: '1. Predict', text: 'Only xₜ is observed. The denoiser estimates the missing noise and clean data.', action: 'Build the path', takeaway: 'The denoiser estimates missing quantities; it does not reveal which true origin was used.' },
  { title: '2. Fix the path', text: 'Hold both estimates fixed. Changing the noise level changes only their weights.', action: 'Choose lower noise', takeaway: 'Within this step, keep the estimates fixed. Only the signal and noise weights change.' },
  { title: '3. Choose lower noise', text: 'At uₛ = 0.10, this path gives exactly one next state. The open circle previews it.', action: 'Move to this point', takeaway: 'A chosen lower noise level intersects this path at one point: the next state is determined.' },
  { title: '4. Move', text: 'Move to the previewed point. Keep the same estimates throughout this transition.', action: 'Predict again', takeaway: 'The point moved; the estimates stayed fixed. This transition used no fresh random draw.' },
  { title: '5. Predict again', text: 'Now call the denoiser at the new state. The new estimates define the next local path.', action: 'Replay step', takeaway: 'Now recompute from the new state. Repeat these same operations for the next step.' },
]
const stage = computed(() => stages[state.stage])
const pairLabel = computed(() => state.stage === 0 ? 'Predicted pair' : state.stage === 4 ? 'New predicted pair' : 'Same pair, held fixed')
const stepFormula = '\\begin{aligned}x_s&=\\sqrt{0.90}\\,\\hat x_0\\\\&\\quad+\\sqrt{0.10}\\,\\hat\\epsilon='+fmt(transition.to.x)+'\\end{aligned}'
const numericStep = 'x_s\\approx\\sqrt{0.90}\\cdot'+fmtClean(transition.prediction.clean)+'+\\sqrt{0.10}\\cdot'+fmt(transition.prediction.noise)+'\\approx'+fmt(transition.to.x)
const printPair = '(\\hat x_0,\\hat\\epsilon)\\approx('+fmtClean(transition.prediction.clean)+','+fmt(transition.prediction.noise)+')'
function mode(value:'forward'|'sampling') { state.mode = value; state.stage = 0 }
function advance() { state.stage = (state.stage + 1) % stages.length }
function back() { state.stage = Math.max(0, state.stage - 1) }
function reset() { Object.assign(state, { mode: 'forward', known: 'unknown', stage: 0 }) }
</script>

<template>
  <DemoPanel data-demo="ddim-paths" :data-mode="state.mode" :data-known="state.known" :data-stage="state.stage" :data-current-u="current.u" :data-current-x="current.x" :data-clean="prediction.clean" :data-noise="prediction.noise" :data-probabilities="probabilities.join(',')" :data-next-x="transition.to.x" :data-next-u="transition.to.u">
    <div class="context-line">Same training marginals; different transitions. <L8Math formula="u=1-\bar\alpha" /></div>
    <template v-if="!isPrintMode">
      <div class="demo-controls main-controls">
        <button :aria-pressed="state.mode==='forward'" @click="mode('forward')">Forward paths</button>
        <button :aria-pressed="state.mode==='sampling'" @click="mode('sampling')">How DDIM moves</button>
        <button class="demo-reset" @click="reset">Reset</button>
      </div>
      <div class="live-body">
        <div>
          <DdimPathPlot :mode="state.mode" :known="state.known" :stage="state.stage" />
          <div v-if="state.mode==='forward'" class="plot-legend"><span class="a-key">━ A: x₀ = −1</span><span class="b-key">┄ B: x₀ = +1</span><span class="current-key">● Current observation</span></div>
          <div v-else class="plot-legend"><span class="current-key">● Current state</span><span class="guide-key">{{ state.stage===0 ? '● Clean estimate' : '┄ Path from the estimates' }}</span><span v-if="state.stage===2" class="guide-key">○ Next state</span><span v-if="state.stage>=3">━ Completed step</span></div>
        </div>
        <div class="readouts" v-if="state.mode==='forward'">
          <div class="readout-heading">What do we know?</div>
          <div class="demo-controls history-controls">
            <button :aria-pressed="state.known==='unknown'" @click="state.known='unknown'">Only xₜ</button>
            <button :aria-pressed="state.known==='minus'" @click="state.known='minus'">Also x₀ = −1</button>
            <button :aria-pressed="state.known==='plus'" @click="state.known='plus'">Also x₀ = +1</button>
          </div>
          <div class="next-heading">Next-state probabilities</div>
          <div class="probability-row"><span>A</span><output>{{ percent(probabilities[0]) }}</output></div>
          <div class="probability-row"><span>B</span><output>{{ percent(probabilities[1]) }}</output></div>
          <div class="demo-note">The current observation stays fixed.</div>
        </div>
        <div class="walkthrough" v-else aria-live="polite">
          <div class="readout-heading">{{ stage.title }} <span class="stage-count">{{ state.stage+1 }} / 5</span></div>
          <div class="stage-description">{{ stage.text }}</div>
          <div class="stage-equation">
            <L8Math v-if="state.stage===0" formula="\begin{aligned}\hat\epsilon&=\epsilon_{\btheta,t}(x_t)\\[3pt]\hat x_0&=\frac{x_t-\sqrt{u_t}\,\hat\epsilon}{\sqrt{1-u_t}}\end{aligned}" />
            <L8Math v-else-if="state.stage===1" formula="\begin{aligned}x(u)&=\sqrt{1-u}\,\hat x_0\\&\quad+\sqrt{u}\,\hat\epsilon\end{aligned}" />
            <L8Math v-else-if="state.stage<=3" :formula="stepFormula" />
            <L8Math v-else formula="\begin{aligned}\hat\epsilon&=\epsilon_{\btheta,s}(x_s)\\[3pt]\hat x_0&=\frac{x_s-\sqrt{u_s}\,\hat\epsilon}{\sqrt{1-u_s}}\end{aligned}" />
          </div>
          <div class="pair-label demo-note">{{ pairLabel }}</div>
          <div class="prediction-row"><span><L8Math formula="\hat x_0" /> ≈ <output>{{fmtClean(prediction.clean)}}</output></span><span><L8Math formula="\hat\epsilon" /> ≈ <output>{{fmt(prediction.noise)}}</output></span></div>
          <div class="demo-controls step-controls"><button :disabled="state.stage===0" @click="back">Back</button><button class="primary" data-advance @click="advance">{{ stage.action }}</button></div>
        </div>
      </div>
      <div class="demo-takeaway" aria-live="polite">{{ state.mode==='forward' ? 'Knowing the past changes the next-state distribution: the forward path is non-Markovian.' : stage.takeaway }}</div>
    </template>
    <div v-else class="print-body">
      <section>
        <h2>Forward: reveal the clean origin</h2>
        <DdimPathPlot mode="forward" known="unknown" :width="552" :height="258" />
        <div class="plot-legend print-legend"><span class="current-key">● Current observation</span></div>
        <div class="print-values">Only xₜ: A {{percent(candidates[0].weight)}}, B {{percent(candidates[1].weight)}}.<br>Knowing x₀ selects one continuation.</div>
      </section>
      <section>
        <h2>DDIM: one step with a fixed pair</h2>
        <DdimPathPlot mode="sampling" :stage="3" :width="552" :height="258" />
        <div class="plot-legend print-legend"><span class="guide-key">┄ Fixed estimated path</span><span>━ Completed step</span></div>
        <div class="print-values">Keep <L8Math :formula="printPair" /> fixed.<br><L8Math :formula="numericStep" /></div>
      </section>
      <div class="demo-takeaway print-takeaway">Predict a pair → fix the path → choose lower noise → move without fresh noise → predict again.</div>
    </div>
    <div class="demo-note toy-note">Equal-probability data x₀ = ±1. Analytic MSE denoiser; no training. Start at an intermediate noise level.</div>
  </DemoPanel>
</template>

<style scoped>
.context-line{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.main-controls{margin-bottom:8px;gap:10px}
output{font-variant-numeric:tabular-nums}
.live-body{display:grid;grid-template-columns:760px 1fr;gap:24px;min-height:335px}
.plot-legend{display:flex;justify-content:center;gap:20px;font-size:18px;min-height:25px;color:#587083}
.a-key{color:#264c70}.b-key{color:#8854c0}.guide-key{color:#007f82}
.current-key{color:#e17838}
.readouts{padding-top:22px}
.readout-heading{font-weight:600;color:#007f82;margin-bottom:12px}
.history-controls{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:0 0 14px}
.history-controls button:first-child{grid-column:1/-1}
.history-controls button{text-align:left;min-height:44px;padding:6px 12px}
.next-heading{margin-top:10px;margin-bottom:5px}
.probability-row{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:5px 0}
.probability-row output,.prediction-row output{color:#007f82}
.readouts>.demo-note{margin-top:12px}
.walkthrough{display:flex;flex-direction:column;height:335px;padding-top:8px}
.stage-count{float:right;font-size:17px;font-weight:400;color:#587083}
.stage-description{min-height:81px}
.stage-equation{display:flex;align-items:center;min-height:84px;margin:4px 0 8px}
.prediction-row{display:flex;justify-content:space-between;gap:12px;margin:4px 0 12px;font-size:22px}
.step-controls{margin-top:auto;margin-bottom:0}
.demo-takeaway{margin-top:12px}
.toy-note{margin-top:8px}
.print-body{display:grid;grid-template-columns:1fr 1fr;gap:16px 32px;margin-top:20px}
.print-body h2{margin-bottom:10px}
.print-values{font-size:20px;line-height:1.45;margin-top:7px}
.print-legend{gap:14px;min-height:22px}
.print-takeaway{grid-column:1/-1;margin-top:0}
</style>
