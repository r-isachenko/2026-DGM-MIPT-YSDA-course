<script setup lang="ts">
function releasePointerFocus(event: MouseEvent) {
  if (event.detail > 0 && event.target instanceof Element) (event.target.closest('button') as HTMLElement)?.blur()
}
</script>
<template>
  <section class="demo-panel" @pointerdown.stop @touchstart.stop @click.stop="releasePointerFocus" @keydown.stop @keyup.stop>
    <slot />
  </section>
</template>
<style>
.demo-panel { font-size: 20px; line-height: 1.35; }
.demo-controls { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; min-height: 44px; }
/* These slides use zoom=1. Remove that redundant stacking context so only the
   controls can sit above Slidev's sibling drawing canvas; plots remain writable. */
.slidev-page:has(.interactive-slide, .histogram-interactive) { scale: none; }
.demo-controls, .kl-settings input { position: relative; z-index: 1; }
.demo-panel button { padding: 8px 15px; min-height: 44px; border: 1px solid #bbced8; border-radius: 6px; background: white; font: inherit; touch-action: manipulation; }
.demo-panel button:hover { background: #f0f7f8; }
.demo-panel button[aria-pressed="true"], .demo-panel button.primary { background: #007f82; border-color: #007f82; color: white; }
.demo-panel button:disabled { opacity: .4; }
.demo-panel button:focus-visible, .demo-panel input:focus-visible { outline: 3px solid #e17838; outline-offset: 3px; }
.demo-panel .demo-reset { margin-left: auto; }
.demo-note { font-size: 17px; color: #587083; }
.demo-takeaway { padding: 12px 16px; background: #eaf4f3; border-left: 4px solid #007f82; margin-top: 16px; }
.demo-panel .sample-strip { display: flex; gap: 12px; align-items: center; min-height: 66px; }
.demo-panel .sample-strip .binary-image { width: 48px; height: 48px; }
.demo-panel .sample-card { padding: 7px; background: #f3f6f8; border-radius: 6px; }
.demo-panel .sample-card.broken { box-shadow: inset 0 0 0 2px #e17838; }
.demo-panel .demo-stat { font-variant-numeric: tabular-nums; }
.interactive-slide.slidev-layout h1 { margin-bottom: 18px; }
.interactive-slide.slidev-layout > .katex-display { margin: 8px 0 18px; font-size: 22px; }
@media print { .demo-controls, .demo-live-only { display: none !important; } }
</style>
