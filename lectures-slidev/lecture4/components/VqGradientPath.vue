<script setup lang="ts">
import L4Math from './L4Math.vue'
defineProps<{ backward?: boolean }>()
</script>

<template>
  <div class="vq-gradient-path" :data-backward="!!backward">
    <svg viewBox="0 0 1100 155" role="img" :aria-label="backward ? 'Forward quantization with a straight-through gradient copied from decoder input to encoder output.' : 'Encoder output passes through nearest-neighbor quantization to the decoder.'">
      <defs>
        <marker id="vq-forward-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#587083" /></marker>
        <marker id="vq-backward-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#007f82" /></marker>
      </defs>
      <g stroke="#587083" stroke-width="2.5" marker-end="url(#vq-forward-arrow)">
        <line x1="230" y1="40" x2="310" y2="40" /><line x1="370" y1="40" x2="448" y2="40" /><line x1="652" y1="40" x2="732" y2="40" /><line x1="790" y1="40" x2="870" y2="40" />
      </g>
      <rect x="50" y="13" width="180" height="54" rx="5" fill="#f3f6f8" stroke="#bbced8" /><text x="140" y="47" text-anchor="middle">Encoder</text>
      <rect x="450" y="13" width="200" height="54" rx="5" fill="#eaf4f3" stroke="#007f82" /><text x="550" y="47" text-anchor="middle">Quantization</text>
      <rect x="870" y="13" width="180" height="54" rx="5" fill="#f3f6f8" stroke="#bbced8" /><text x="960" y="47" text-anchor="middle">Decoder</text>
      <foreignObject x="310" y="22" width="65" height="42"><div class="math-node encoder"><L4Math formula="\bz_e" /></div></foreignObject>
      <foreignObject x="730" y="22" width="65" height="42"><div class="math-node code"><L4Math formula="\bz_q" /></div></foreignObject>
      <g :style="{ opacity: backward ? 1 : 0 }" :aria-hidden="!backward" stroke="#007f82" stroke-width="2.5" fill="none" marker-end="url(#vq-backward-arrow)">
        <path d="M 960 74 V 101 H 780" /><path d="M 750 101 H 350" stroke-dasharray="7 4" /><path d="M 320 101 H 140 V 74" />
      </g>
      <foreignObject :style="{ opacity: backward ? 1 : 0 }" :aria-hidden="!backward" x="310" y="108" width="490" height="47"><div class="gradient-label"><span>Copy gradient:</span> <L4Math formula="\frac{\partial\bz_q}{\partial\bz_e}\approx\bI" /></div></foreignObject>
    </svg>
  </div>
</template>

<style scoped>
.vq-gradient-path { width: 100%; height: 155px; margin: 10px auto; }
svg { width: 100%; height: 155px; display: block; }
svg text { fill: #17324d; font: 22px Arial, sans-serif; }
.math-node { font-size: 23px; text-align: center; }
.encoder { color: #ba5a22; }
.code { color: #007f82; }
.gradient-label { color: #007f82; font-size: 19px; display: flex; align-items: center; justify-content: center; gap: 10px; }
</style>
