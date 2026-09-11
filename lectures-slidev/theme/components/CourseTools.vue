<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { configs, useNav, useDrawings, onDrawingUpdate } from '@slidev/client'
const { currentSlideNo, total, isPresenter, isPrintMode, next, prev } = useNav()
const { brush, drawingEnabled, drawingMode, drawingPinned, drauu, drawingState, canUndo, canRedo, canClear, clear, loadCanvas } = useDrawings()
const message = ref('')
const fileInput = ref<HTMLInputElement>()
const visible = computed(() => !isPrintMode.value && (isPresenter.value || new URLSearchParams(location.search).has('tools')))
const colors = ['#17324d', '#007f82', '#8b3fb0', '#e44747']
function releasePointerFocus(event: MouseEvent) {
  // Slidev suspends shortcuts while a button is focused; retain focus for keyboard activation.
  if (event.detail === 0 || !(event.target instanceof Element)) return
  event.target.closest('button')?.blur()
}
function pen() { drawingPinned.value = false; drawingMode.value = 'stylus'; drawingEnabled.value = !drawingEnabled.value }
function color(value: string) { brush.value.color = value; drawingMode.value = 'stylus'; drawingEnabled.value = true }
function save() {
  const session = { version: 1, deck: configs.title, slides: total.value, canvas: [configs.canvasWidth, configs.canvasWidth / configs.aspectRatio], savedAt: new Date().toISOString(), drawings: { ...drawingState, [currentSlideNo.value]: drauu.dump() } }
  const url = URL.createObjectURL(new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a'); link.href = url; link.download = `dgm-${configs.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}-notes-${session.savedAt.replace(/[:.]/g, '-')}.json`; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  message.value = 'Session saved'
}
async function restore(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    if (file.size > 10_000_000) throw new Error('Session is too large')
    const data = JSON.parse(await file.text())
    if (data.version !== 1 || data.deck !== configs.title || data.slides !== total.value || !data.drawings || typeof data.drawings !== 'object') throw new Error('Session belongs to a different deck')
    const allowedTags = new Set(['svg', 'g', 'path', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'circle'])
    const allowedAttrs = new Set(['xmlns', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'fill-opacity', 'stroke-opacity', 'transform', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'points', 'data-id', 'data-drauu_index'])
    for (const [key, svg] of Object.entries(data.drawings)) {
      if (!/^\d+$/.test(key) || +key < 1 || +key > total.value || typeof svg !== 'string') throw new Error('Invalid slide drawing')
      const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`, 'image/svg+xml')
      for (const el of doc.querySelectorAll('*')) {
        if (!allowedTags.has(el.localName)) throw new Error('Unsupported SVG element')
        for (const attr of el.attributes) {
          if (!allowedAttrs.has(attr.name) || /url\s*\(|javascript:|data:/i.test(attr.value)) throw new Error('Unsupported SVG attribute')
        }
      }
    }
    // Preserve the current session before replacing any drawing.
    if (Object.values(drawingState).some(Boolean)) save()
    const restored = Object.fromEntries(Array.from({length: total.value}, (_, i) => [i + 1, data.drawings[i + 1] || '']))
    onDrawingUpdate(restored)
    await nextTick()
    loadCanvas()
    message.value = 'Session restored'
  } catch (error) { message.value = error instanceof Error ? error.message : 'Cannot restore session' }
  input.value = ''
}
function clearSaved() { save(); clear(); message.value = 'Session saved; this slide cleared' }
</script>
<template>
  <Teleport to="body">
  <nav v-if="visible" class="course-tools" aria-label="Lecture annotation tools" @pointerdown.stop @click.stop="releasePointerFocus" @touchstart.stop>
    <button aria-label="Previous step" @click="prev">←</button>
    <button aria-label="Next step" @click="next">→</button>
    <span class="tool-divider" />
    <button :aria-pressed="drawingEnabled" @click="pen">Pen</button>
    <button v-for="c in colors" :key="c" :aria-label="`Ink ${c}`" :style="{ color: c }" @click="color(c)">●</button>
    <button :disabled="!canUndo" @click="drauu.undo()">Undo</button>
    <button :disabled="!canRedo" @click="drauu.redo()">Redo</button>
    <button @click="save">Save</button>
    <button @click="fileInput?.click()">Restore</button>
    <input ref="fileInput" type="file" accept=".json" hidden @change="restore" />
    <button :disabled="!canClear" @click="clearSaved">Save & clear</button>
  </nav>
  <span v-if="visible && message" class="tool-message" role="status">{{ message }}</span>
  </Teleport>
</template>
<style>
.course-tools { position: fixed; bottom: 5px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; max-width: calc(100vw - 16px); overflow-x: auto; padding: 5px; background: #fff; border: 1px solid #ccd9e3; border-radius: 8px; box-shadow: 0 2px 10px #17324d20; z-index: 100; font: 15px Arial, sans-serif; color: #17324d; white-space: nowrap; }
.course-tools button { flex-shrink: 0; min-width: 44px; min-height: 44px; padding: 7px 9px; border-radius: 5px; touch-action: manipulation; }
.course-tools button:hover, .course-tools button[aria-pressed="true"] { background: #e3f3f1; }
.course-tools button:disabled { opacity: .35; }
.tool-divider { height: 28px; border-left: 1px solid #dbe4eb; }
.tool-message { position: fixed; bottom: 68px; right: 8px; z-index: 101; font: 12px Arial, sans-serif; color: #17324d; background: white; }
</style>
