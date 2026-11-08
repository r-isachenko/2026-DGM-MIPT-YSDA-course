<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import L9Math from './L9Math.vue'
import RotationPlot from './RotationPlot.vue'
import { solverState as state } from '../lib/demo-state'
import { solveRotation, colors as c } from '../lib/dynamics-demos.mjs'
import '../lib/demos.css'
const { isPrintMode } = useNav()
const steps = computed(() => isPrintMode.value ? 8 : state.steps)
const count = computed(() => isPrintMode.value ? 8 : state.count)
const solution = computed(() => solveRotation(steps.value, count.value))
function choose(n: number) {
  const complete = state.count === state.steps
  state.count = complete ? n : Math.min(state.count, n)
  state.steps = n
}
function reset() { state.steps = 8; state.count = 1 }
</script>
<template>
  <DemoPanel class="l9-demo solver-demo" data-demo="ode-solver" :data-steps="state.steps" :data-count="state.count">
    <div v-if="!isPrintMode" class="demo-controls l9-controls">
      <span>Steps over [0, 3]</span><button v-for="n in [4,8,16,32]" :key="n" :aria-pressed="state.steps===n" @click="choose(n)">{{ n }}</button>
      <button class="primary" @click="state.count++" :disabled="state.count===state.steps">One step</button><button @click="state.count=state.steps">Complete</button>
      <span>h = {{ solution.h.toFixed(3) }}</span><button class="demo-reset" @click="reset">Reset</button>
    </div>
    <div v-else class="print-context">8 steps on [0, 3] · h = 0.375</div>
    <div class="solver-body">
      <div class="solver-theory"><slot /></div>
      <div class="solver-plot">
        <div class="example"><L9Math formula="\bv(\bx)=(x_2,-x_1),\quad\bx(0)=(-1,0)" /></div>
        <div class="l9-legend"><span :style="{color:c.ink}">┄ Exact</span><span :style="{color:c.purple}">━ Euler</span><span :style="{color:c.teal}">━ Heun</span></div>
        <RotationPlot :steps="steps" :count="count" />
        <table class="solver-readout">
          <caption>Step {{ count }} / {{ steps }} · t = {{ (solution.h * count).toFixed(3) }}</caption>
          <thead><tr><th>Method</th><th>Distance to exact point</th><th>Total NFE</th></tr></thead>
          <tbody>
            <tr><td>Euler</td><td>{{ solution.eulerError.toPrecision(3) }}</td><td>{{ solution.eulerNfe }}</td></tr>
            <tr><td>Heun</td><td>{{ solution.heunError.toPrecision(3) }}</td><td>{{ solution.heunNfe }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </DemoPanel>
</template>
<style scoped>
.solver-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
.solver-theory :deep(table) { margin: 24px 0; }
.solver-plot :deep(svg) { height: 240px; }
.example, .print-context { text-align: center; }
.print-context { margin: 12px 0 14px; min-height: 44px; color: #587083; }
.solver-readout { font-variant-numeric: tabular-nums; }
.solver-readout caption { color: #587083; margin-bottom: 4px; }
.solver-readout th, .solver-readout td { padding: 4px 8px; }
.solver-readout th:nth-child(n+2), .solver-readout td:nth-child(n+2) { text-align: right; }
</style>
