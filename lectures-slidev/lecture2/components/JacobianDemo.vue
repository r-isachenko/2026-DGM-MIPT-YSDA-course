<script setup lang="ts">
import { ref } from 'vue'
import { useNav } from '@slidev/client'
const { isPrintMode } = useNav()
const stretch = ref(1)
const shear = ref(0)
function preset(a: number, b: number) { stretch.value = a; shear.value = b }
const examples = [{ title: 'Identity', a: 1, b: 0 }, { title: 'Shear', a: 1, b: 1 }, { title: 'Stretch', a: 2, b: 0 }]
</script>
<template>
  <DemoPanel data-demo="jacobian" :data-determinant="stretch" :data-shear="shear">
    <div v-if="!isPrintMode" class="demo-controls">
      <button @click="preset(1, 0)" :aria-pressed="stretch === 1 && shear === 0">Identity</button>
      <button @click="preset(1, 1)" :aria-pressed="stretch === 1 && shear === 1">Shear</button>
      <button @click="preset(2, 0)" :aria-pressed="stretch === 2 && shear === 0">Stretch</button>
      <button class="demo-reset" @click="preset(1, 0)">Reset</button>
      <div class="jac-sliders">
      <label>Stretch <FlowMath formula="a" /><input aria-label="Stretch" type="range" min="0.5" max="2" step="0.1" v-model.number="stretch" /><output>{{ stretch.toFixed(1) }}</output></label>
      <label>Shear <FlowMath formula="b" /><input aria-label="Shear" type="range" min="-1" max="1" step="0.1" v-model.number="shear" /><output>{{ shear.toFixed(1) }}</output></label>
      </div>
    </div>
    <div v-if="isPrintMode" class="jac-panels print-panels">
      <div v-for="example in examples" :key="example.title">
        <h2>{{ example.title }}</h2>
        <FlowPlane square :range="1.6" :stretch="example.a" :shear="example.b" :label="example.title" />
        <FlowMath :formula="`|\\det\\bJ|=${example.a}`" />
      </div>
    </div>
    <div v-else class="jac-panels">
      <div>
        <h2>Original unit square</h2>
        <FlowPlane square :range="1.6" color="#8854c0" label="Original unit square with area one" />
        <FlowMath formula="\bx=(x_1,x_2)" />
      </div>
      <div>
        <h2>Transformed square</h2>
        <FlowPlane square :range="1.6" :stretch="stretch" :shear="shear" label="Transformed square; determinant equals area ratio" />
        <FlowMath formula="\bz=(z_1,z_2)" />
      </div>
    </div>
    <div class="jac-readout" aria-live="polite"><FlowMath formula="\bz=\bJ\bx,\quad\bJ=\begin{pmatrix}a&b\\0&1\end{pmatrix}" /><span v-if="!isPrintMode"><FlowMath formula="|\det\bJ|=" /> {{ stretch.toFixed(1) }}</span></div>
    <div class="demo-note">{{ isPrintMode ? 'Shear preserves area; stretching by 2 doubles it.' : 'Horizontal: coordinate 1. Vertical: coordinate 2. Dashed: original.' }}</div>
    <div class="demo-takeaway"><FlowMath formula="p(\bz)=p(\bx)/|\det\bJ|" /> — probability mass is preserved.</div>
  </DemoPanel>
</template>
<style scoped>
.demo-controls { gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
.jac-sliders { display: flex; width: 100%; justify-content: space-between; }
.demo-controls button { padding: 8px 12px; font-size: 18px; }
label { display: flex; align-items: center; gap: 7px; font-size: 17px; }
input { width: 110px; accent-color: #007f82; min-height: 44px; }
output { width: 30px; font-variant-numeric: tabular-nums; }
.jac-panels { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-width: 560px; margin-inline: auto; text-align: center; }
.jac-panels :deep(svg) { height: 180px; }
.jac-panels h2 { font-size: 22px; }
.jac-readout { display: flex; justify-content: space-around; align-items: center; min-height: 64px; margin: 8px 0; font-variant-numeric: tabular-nums; }
.print-panels { grid-template-columns: repeat(3, 1fr); max-width: 600px; margin-top: 28px; }
.demo-takeaway { margin-top: 12px; }
</style>
<style>
.jacobian-combined { display: grid; grid-template-columns: 480px minmax(0, 1fr); gap: 28px; }
.jacobian-theory .katex-display { text-align: left; }
.jacobian-theory .katex-display > .katex { text-align: left; }
.jacobian-theory > div:last-child { margin-top: 18px; }
</style>
