<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useNav, useDrawings } from '@slidev/client'
import { codebook, vqInitialPoint, vqBounds, nearestCode, voronoiCells } from '../lib/vq-demo.mjs'
import { vqState as state } from '../lib/vq-state'

const { isPrintMode } = useNav()
const { drawingEnabled } = useDrawings()
const point = computed(() => isPrintMode.value ? vqInitialPoint : state)
const selected = computed(() => nearestCode(point.value))
const cells = voronoiCells()
const px = (x: number) => 60 + (x + 2) * 100
const py = (y: number) => 15 + (1.5 - y) * 100
const points = (cell: { x: number; y: number }[]) => cell.map(p => `${px(p.x)},${py(p.y)}`).join(' ')
const subscript = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈']
const fmt = (n: number) => (Math.abs(n) < .005 ? 0 : n).toFixed(2)
const dragging = ref<number | null>(null)
let captureElement: SVGCircleElement | null = null

function moveTo(x: number, y: number) {
  state.x = Math.max(vqBounds.xmin + .1, Math.min(vqBounds.xmax - .1, x))
  state.y = Math.max(vqBounds.ymin + .1, Math.min(vqBounds.ymax - .1, y))
}
function endDrag(event?: PointerEvent) {
  if (event && event.pointerId !== dragging.value) return
  const element = captureElement
  const pointerId = dragging.value
  dragging.value = null
  captureElement = null
  if (pointerId !== null && element?.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
}
function startDrag(event: PointerEvent) {
  if (drawingEnabled.value || isPrintMode.value || event.button !== 0 || dragging.value !== null) return
  event.preventDefault()
  event.stopPropagation()
  dragging.value = event.pointerId
  captureElement = event.currentTarget as SVGCircleElement
  captureElement.setPointerCapture(event.pointerId)
}
function moveDrag(event: PointerEvent) {
  if (drawingEnabled.value || dragging.value !== event.pointerId || !captureElement) return
  const svg = captureElement.ownerSVGElement
  const transform = svg?.getScreenCTM()
  if (!svg || !transform) return
  event.preventDefault()
  const cursor = svg.createSVGPoint()
  cursor.x = event.clientX
  cursor.y = event.clientY
  const local = cursor.matrixTransform(transform.inverse())
  moveTo((local.x - 60) / 100 - 2, 1.5 - (local.y - 15) / 100)
}
function moveKey(event: KeyboardEvent) {
  const directions: Record<string, [number, number]> = { ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, .05], ArrowDown: [0, -.05] }
  if (!(event.key in directions) && event.key !== 'Home') return
  event.preventDefault()
  if (drawingEnabled.value || isPrintMode.value) return
  if (event.key === 'Home') moveTo(vqInitialPoint.x, vqInitialPoint.y)
  else {
    const [dx, dy] = directions[event.key]
    moveTo(state.x + dx, state.y + dy)
  }
}
watch(drawingEnabled, enabled => { if (enabled) endDrag() })
watch(isPrintMode, printing => { if (printing) endDrag() })
onBeforeUnmount(() => endDrag())
</script>

<template>
  <div class="vq-demo" data-demo="vector-quantization" :data-x="point.x" :data-y="point.y" :data-selected="selected.index + 1" data-regions="true" @pointerdown.stop @touchstart.stop @click.stop @keydown.stop @keyup.stop>
    <svg class="vq-plane" viewBox="0 0 560 345" role="group" aria-label="Vector quantization: each Voronoi region maps to its nearest codebook entry." @pointermove="moveDrag" @pointerup="endDrag" @pointercancel="endDrag">
      <rect x="60" y="15" width="400" height="300" fill="white" stroke="#bbced8" />
      <g data-voronoi-regions>
        <polygon v-for="(cell, k) in cells" :key="k" :points="points(cell)" :fill="k === selected.index ? '#eaf4f3' : '#f7f9fa'" stroke="#a9bac7" stroke-width="1.3" />
      </g>
      <line x1="60" y1="165" x2="460" y2="165" stroke="#dbe3e9" />
      <line x1="260" y1="15" x2="260" y2="315" stroke="#dbe3e9" />
      <g v-for="tick in [-2, -1, 0, 1, 2]" :key="`x${tick}`"><line :x1="px(tick)" y1="315" :x2="px(tick)" y2="320" stroke="#587083" /><text :x="px(tick)" y="340" text-anchor="middle">{{ tick }}</text></g>
      <g v-for="tick in [-1, 0, 1]" :key="`y${tick}`"><line x1="55" :y1="py(tick)" x2="60" :y2="py(tick)" stroke="#587083" /><text x="45" :y="py(tick) + 6" text-anchor="end">{{ tick }}</text></g>
      <text x="485" y="340">z₁</text><text x="30" y="20">z₂</text>
      <line :x1="px(point.x)" :y1="py(point.y)" :x2="px(selected.code.x)" :y2="py(selected.code.y)" stroke="#007f82" stroke-width="3" />
      <g v-for="(code, k) in codebook" :key="k">
        <circle v-if="k === selected.index" :cx="px(code.x)" :cy="py(code.y)" r="14" fill="none" stroke="#007f82" stroke-width="2.5" />
        <circle :cx="px(code.x)" :cy="py(code.y)" r="7" :fill="k === selected.index ? '#007f82' : '#8854c0'" />
        <text :x="px(code.x) + 18" :y="py(code.y) - 13" :fill="k === selected.index ? '#007f82' : '#8854c0'">e{{ subscript[k] }}</text>
      </g>
      <circle class="encoder-handle" data-encoder-handle :cx="px(point.x)" :cy="py(point.y)" r="17" fill="transparent" :tabindex="isPrintMode ? -1 : 0" role="button" :aria-disabled="drawingEnabled || isPrintMode" :aria-label="`Point z at (${fmt(point.x)}, ${fmt(point.y)}), nearest code e${selected.index + 1}. Arrow keys move the point; Home resets it.`" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Home" :style="{ pointerEvents: isPrintMode || drawingEnabled ? 'none' : 'all' }" @pointerdown="startDrag" @lostpointercapture="endDrag" @keydown="moveKey" />
      <circle :cx="px(point.x)" :cy="py(point.y)" r="8" fill="#e17838" stroke="white" stroke-width="2" pointer-events="none" />
      <text :x="px(point.x) + 14" :y="py(point.y) - 14" fill="#ba5a22" pointer-events="none">z</text>
    </svg>
  </div>
</template>

<style scoped>
.vq-demo { width: 100%; }
.vq-plane { display: block; width: 100%; height: auto; max-height: 340px; }
.vq-plane text { font: 21px Arial, sans-serif; }
.vq-plane text:not([fill]) { fill: #587083; }
.encoder-handle { cursor: grab; touch-action: none; }
.encoder-handle:active { cursor: grabbing; }
.encoder-handle:focus-visible { outline: none; stroke: #e17838; stroke-width: 2; stroke-dasharray: 4 3; }
</style>
