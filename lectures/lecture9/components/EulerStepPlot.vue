<script setup lang="ts">
defineProps<{ heun?: boolean }>()
// For x' = x starting at x(0) = 1 with h = 1, Euler gives 2 and Heun gives 2.5.
const x = (t: number) => 55 + 270 * t
const y = (value: number) => 225 - 100 * (value - 1)
const curve = Array.from({ length: 81 }, (_, i) => {
  const t = i / 80 * 1.1
  return `${i ? 'L' : 'M'}${x(t)},${y(Math.exp(t))}`
}).join(' ')
</script>
<template>
  <div class="euler-geometry">
    <div class="geometry-label">{{ heun ? 'One step of Heun’s method' : 'One step: follow the tangent' }}</div>
    <svg viewBox="0 0 520 280" role="img" :aria-label="heun ? 'Heun first predicts the Euler endpoint, then uses the mean slope to reach a corrected endpoint closer to the exact curve.' : 'A scalar ODE solution curves away from the Euler tangent over one time step; the endpoint gap is the local error.'">
      <path d="M35 245H480 M55 250V20" fill="none" stroke="#bbced8" stroke-width="1.5" />
      <text x="18" y="27">x</text><text x="455" y="270">time</text>
      <line :x1="x(1)" :x2="x(1)" y1="48" y2="245" stroke="#bbced8" stroke-dasharray="4 4" />
      <path :d="curve" fill="none" stroke="#17324d" stroke-width="3" />
      <line :x1="x(0)" :y1="y(1)" :x2="x(1)" :y2="y(2)" stroke="#8854c0" stroke-width="3" />
      <circle :cx="x(0)" :cy="y(1)" r="5" fill="#17324d" />
      <circle :cx="x(1)" :cy="y(2)" r="5" fill="#8854c0" />
      <circle :cx="x(1)" :cy="y(Math.E)" r="5" fill="white" stroke="#17324d" stroke-width="3" />
      <path v-if="!heun" :d="`M${x(1)+17} ${y(Math.E)}h8v${y(2)-y(Math.E)}h-8`" fill="none" stroke="#e17838" stroke-width="2" />
      <text :x="x(1)+35" :y="y(Math.E)+5">Exact</text>
      <text :x="x(1)+35" :y="y(2)+6" class="euler-label">{{ heun ? 'Euler predictor' : 'Euler' }}</text>
      <g v-if="heun" v-click="1">
        <!-- The short dashed segment has the field slope at the predictor (2). -->
        <line :x1="x(0.8)" :y1="y(1.6)" :x2="x(1.1)" :y2="y(2.2)" stroke="#007f82" stroke-width="2" stroke-dasharray="5 4" />
        <line :x1="x(0)" :y1="y(1)" :x2="x(1)" :y2="y(2.5)" stroke="#007f82" stroke-width="3" />
        <circle :cx="x(1)" :cy="y(2.5)" r="5" fill="#007f82" />
        <text :x="x(1)+35" :y="y(2.5)+7" class="heun-label">Heun</text>
      </g>
      <text v-else :x="x(1)+35" :y="(y(Math.E)+y(2))/2+5" class="error-label">local error</text>
      <text x="46" y="270">t</text><text :x="x(1)-19" y="270">t + h</text>
      <text x="117" y="225" class="euler-label">{{ heun ? 'initial velocity' : 'constant velocity' }}</text>
    </svg>
  </div>
</template>
<style scoped>
.euler-geometry .heun-label{fill:#007f82}
.geometry-label{font-size:22px;font-weight:650;color:#17324d;text-align:center;margin-bottom:8px}.euler-geometry svg{width:100%;height:270px;display:block}.euler-geometry text{font:18px Arial;fill:#587083}.euler-geometry .euler-label{fill:#8854c0}.euler-geometry .error-label{fill:#b66024}
</style>
