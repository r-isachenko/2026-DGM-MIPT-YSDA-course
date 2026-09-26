import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { lecturePaths, root } from './course.mjs'
import { priorExamples } from '../lecture4/lib/prior-demo.mjs'
import { vqInitialPoint, codebook, vqBounds, nearestCode } from '../lecture4/lib/vq-demo.mjs'
import { ganPresets, optimalDiscriminator } from '../lecture4/lib/gan-demo.mjs'

const lecture = lecturePaths('4')
const base = process.env.SLIDEV_QA_URL || `http://localhost:${lecture.port}`
const map = JSON.parse(readFileSync(lecture.map, 'utf8'))
const byTitle = title => {
  const slide = map.find(s => s.title === title)
  assert.ok(slide, `Missing slide: ${title}`)
  return slide
}
const slides = [
  byTitle('Matching the Prior: Which KL Vanishes?'),
  byTitle('Vector Quantization'),
  byTitle('The Optimal Discriminator Responds to the Densities'),
]
const qa = resolve(root, 'output/qa/lecture4/vq-inline-2026-09-26')
mkdirSync(qa, { recursive: true })
const browser = await chromium.launch({ executablePath: process.env.SLIDEV_BROWSER_PATH || '/Applications/Yandex.app/Contents/MacOS/Yandex', headless: true })
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const page = await context.newPage()
page.setDefaultTimeout(10000)
page.setDefaultNavigationTimeout(30000)
const errors = [], failures = [], external = [], states = [], checks = [], cleanupFailures = []
page.on('pageerror', error => errors.push(String(error)))
page.on('response', response => { if (response.status() >= 400) failures.push([response.status(), response.url()]) })
await context.route('**/*', route => {
  const url = new URL(route.request().url())
  if (['http:', 'https:'].includes(url.protocol) && url.origin !== new URL(base).origin) {
    external.push(url.href)
    return route.abort()
  }
  return route.continue()
})
const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} differs from ${expected}`)
const dataset = demo => demo.evaluate(element => ({ ...element.dataset }))
const currentDemo = () => page.locator('[data-demo]:visible')
async function go(slide, tools = false) {
  await page.goto(`${base}/${slide.slide}?clicks=${slide.clicks}${tools ? '&tools' : ''}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  assert.match(await page.locator('.course-folio:visible').last().innerText(), new RegExp(`/ ${map.length}$`), 'Wrong deck or stale server')
  await currentDemo().waitFor({ state: 'visible' })
  return currentDemo()
}
async function snapshot(name) {
  await page.mouse.move(1240, 690)
  const overflow = await currentDemo().evaluate(demo => {
    const layout = demo.closest('.slidev-layout'), bounds = layout.getBoundingClientRect(), scale = bounds.width / 1280
    const source = layout.querySelector('.source')?.getBoundingClientRect()
    const bottom = Math.min(bounds.top + 672 * scale, source ? source.top - 12 * scale : Infinity)
    return [demo, ...demo.querySelectorAll('button,label,input,output,svg,.katex-html,.demo-note,.demo-takeaway,.legend,.model,.term,.case-caption,.plot-title')]
      .map(element => ({ text: element.textContent.slice(0, 90), bounds: element.getBoundingClientRect().toJSON() }))
      .filter(({ bounds: r }) => r.width > 0 && (r.bottom > bottom + .5 || r.right > bounds.right - 30 * scale || r.left < bounds.left + 30 * scale))
  })
  assert.deepEqual(overflow, [], `Overflow in ${name}`)
  assert.equal(await page.locator('.katex-error:visible').count(), 0)
  await page.screenshot({ path: resolve(qa, `${name}.png`) })
  states.push(name)
}
async function checkReturn(slide) {
  const before = await dataset(currentDemo())
  await page.locator('.slidev-layout:visible h1').click()
  for (const [out, back, neighbor] of [['ArrowDown', 'ArrowUp', slide.slide + 1], ['ArrowUp', 'ArrowDown', slide.slide - 1]]) {
    await page.keyboard.press(out)
    await page.waitForURL(new RegExp(`/${neighbor}(?:\\?|$)`))
    await page.keyboard.press(back)
    await page.waitForURL(new RegExp(`/${slide.slide}(?:\\?|$)`))
    const shownClicks = Number(new URL(page.url()).searchParams.get('clicks') || 0)
    for (let click = shownClicks; click < slide.clicks; click++) await page.keyboard.press('ArrowRight')
    await currentDemo().waitFor({ state: 'visible' })
    assert.deepEqual(await dataset(currentDemo()), before, `State should survive return from slide ${neighbor}`)
  }
  checks.push(`SPA return from both neighbors: ${slide.slide}`)
}
async function sliderKey(demo, name, key, field, expected) {
  await demo.getByRole('slider', { name, exact: true }).focus()
  const before = page.url()
  await page.keyboard.press(key)
  assert.equal(page.url(), before, 'Slider arrow key must not navigate')
  close(+(await dataset(demo))[field], expected)
}
async function svgPoint(demo, x, y) {
  return demo.locator('svg').evaluate((svg, coordinates) => {
    const point = svg.createSVGPoint()
    point.x = 60 + (coordinates.x + 2) * 100
    point.y = 15 + (1.5 - coordinates.y) * 100
    const screen = point.matrixTransform(svg.getScreenCTM())
    return { x: screen.x, y: screen.y }
  }, { x, y })
}
async function dragPoint(demo, x, y, pointerType = 'mouse', afterPointerDown) {
  const from = await demo.locator('[data-encoder-handle]').evaluate(handle => {
    const point = handle.ownerSVGElement.createSVGPoint()
    point.x = +handle.getAttribute('cx'); point.y = +handle.getAttribute('cy')
    const screen = point.matrixTransform(handle.ownerSVGElement.getScreenCTM())
    return { x: screen.x, y: screen.y }
  })
  const to = await svgPoint(demo, x, y)
  if (pointerType === 'pen') {
    const cdp = await context.newCDPSession(page)
    try {
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...from, button: 'left', buttons: 1, clickCount: 1, pointerType })
      for (let step = 1; step <= 12; step++) await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x + (to.x - from.x) * step / 12, y: from.y + (to.y - from.y) * step / 12, button: 'left', buttons: 1, pointerType })
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...to, button: 'left', buttons: 0, clickCount: 1, pointerType })
    } finally { await cdp.detach() }
  } else {
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    try {
      if (afterPointerDown) await afterPointerDown()
      await page.mouse.move(to.x, to.y, { steps: 12 })
    } finally { await page.mouse.up() }
  }
}
// DrawingLayer.vue renders this SVG as a sibling of #slideshow. Inspect its
// contents without modifying them; CourseTools Undo is the supported mutation.
async function checkAnnotationDrag(demo, toolbar) {
  const layer = page.locator('#slideshow ~ svg.w-full.h-full.absolute.top-0')
  assert.equal(await layer.count(), 1, 'Expected exactly one annotation layer')
  const before = await layer.innerHTML()
  const beforeDemo = await dataset(demo)
  const beforePath = new URL(page.url()).pathname
  let ownStroke
  try {
    await dragPoint(demo, 1.5, -.8, 'mouse', async () => {
      // Keep the exact node created by this pointerdown, not just a stroke count.
      // A remote canvas reload replaces its identity and must prevent Undo.
      ownStroke = await layer.evaluateHandle((svg, baseline) => {
        const node = svg.lastElementChild
        return node && svg.innerHTML === baseline + node.outerHTML ? node : null
      }, before)
      assert.ok(ownStroke.asElement(), 'Test pointerdown did not append exactly one annotation')
    })
    assert.deepEqual(await dataset(demo), beforeDemo, 'Annotation mode must not drag encoder')
  } finally {
    try {
      assert.equal(new URL(page.url()).pathname, beforePath, 'Do not undo on a different slide')
      const after = await layer.innerHTML()
      if (after !== before) {
        assert.ok(ownStroke?.asElement(), 'No identified test stroke; refusing to undo existing annotations')
        const safeToUndo = await ownStroke.evaluate((node, baseline) => {
          const svg = node.parentElement
          return node.isConnected && svg?.matches('#slideshow ~ svg.w-full.h-full.absolute.top-0')
            && svg.lastElementChild === node && svg.innerHTML === baseline + node.outerHTML
        }, before)
        assert.ok(safeToUndo, 'Annotations changed concurrently; refusing to undo another stroke')
        const undo = toolbar.getByRole('button', { name: 'Undo', exact: true })
        assert.ok(await undo.isEnabled(), 'Test stroke is not on the local undo stack')
        await undo.click()
        assert.equal(await layer.innerHTML(), before, 'Undo must restore every preexisting annotation exactly')
        checks.push('Only the identified annotation test stroke was undone; baseline preserved')
      }
    } catch (error) {
      cleanupFailures.push(String(error))
      throw error
    } finally { await ownStroke?.dispose() }
  }
}
async function penClick(button) {
  const box = await button.boundingBox()
  assert.ok(box)
  const cdp = await context.newCDPSession(page)
  try {
    await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x + box.width / 2, y: box.y + box.height / 2, button: 'left', buttons: 1, clickCount: 1, pointerType: 'pen' })
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x + box.width / 2, y: box.y + box.height / 2, button: 'left', buttons: 0, clickCount: 1, pointerType: 'pen' })
  } finally { await cdp.detach() }
}
let success = false
try {
  let demo = await go(slides[0])
  let fixedMI
  for (const example of priorExamples) {
    await demo.getByRole('button', { name: example.label, exact: true }).click()
    const data = await dataset(demo)
    assert.equal(data.mode, example.mode)
    close(+data.mi, example.mutualInformation)
    close(+data.marginalKl, example.marginalKL)
    close(+data.conditionalKl, example.conditionalKL)
    close(+data.conditionalKl, +data.mi + +data.marginalKl)
    if (fixedMI !== undefined) close(+data.mi, fixedMI)
    fixedMI = +data.mi
    await snapshot(`prior-${example.mode}`)
  }
  assert.equal(+(await dataset(demo)).marginalKl, 0)
  assert.ok(+(await dataset(demo)).conditionalKl > 0)
  await checkReturn(slides[0])
  await demo.getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal((await dataset(demo)).mode, 'gaussian')
  checks.push('Prior decomposition, invariant MI, matched KL and reset')

  demo = await go(slides[1])
  assert.equal(await demo.locator('button').count(), 0, 'Inline VQ has no buttons')
  assert.equal(await demo.locator('input').count(), 0, 'Inline VQ has no settings')
  assert.equal(await demo.locator('[data-voronoi-regions] polygon').count(), codebook.length)
  assert.equal((await dataset(demo)).regions, 'true')
  for (const [index, code] of codebook.entries()) {
    await dragPoint(demo, code.x, code.y)
    const data = await dataset(demo)
    close(+data.x, code.x, .01); close(+data.y, code.y, .01)
    assert.equal(+data.selected, index + 1, 'Dragging to a codebook entry selects that code')
    await snapshot(`vq-code-${index + 1}`)
  }
  for (const x of [vqBounds.xmin, vqBounds.xmax]) for (const y of [vqBounds.ymin, vqBounds.ymax]) {
    await dragPoint(demo, x, y)
    const point = { x: Math.max(vqBounds.xmin + .1, Math.min(vqBounds.xmax - .1, x)), y: Math.max(vqBounds.ymin + .1, Math.min(vqBounds.ymax - .1, y)) }
    const data = await dataset(demo)
    close(+data.x, point.x, .01); close(+data.y, point.y, .01)
    assert.equal(+data.selected, nearestCode(point).index + 1)
    await snapshot(`vq-corner-${x}-${y}`)
  }
  const handle = demo.locator('[data-encoder-handle]')
  await handle.focus()
  let beforeURL = page.url()
  await page.keyboard.press('Home')
  assert.equal(page.url(), beforeURL, 'Handle Home must reset without navigating')
  let data = await dataset(demo)
  close(+data.x, vqInitialPoint.x); close(+data.y, vqInitialPoint.y)
  for (const [key, dx, dy] of [['ArrowRight', .05, 0], ['ArrowLeft', -.05, 0], ['ArrowUp', 0, .05], ['ArrowDown', 0, -.05]]) {
    const before = await dataset(demo)
    await page.keyboard.press(key)
    assert.equal(page.url(), beforeURL, 'Handle arrow key must not navigate')
    data = await dataset(demo)
    close(+data.x, +before.x + dx); close(+data.y, +before.y + dy)
  }
  const penTarget = codebook[codebook.length - 1]
  await dragPoint(demo, penTarget.x, penTarget.y, 'pen')
  data = await dataset(demo)
  close(+data.x, penTarget.x, .01); close(+data.y, penTarget.y, .01)
  assert.equal(+data.selected, codebook.length, 'Synthetic pen drag works when annotation mode is off')
  await snapshot('vq-synthetic-pen-drag')
  await checkReturn(slides[1])
  await handle.focus()
  await page.keyboard.press('Home')
  data = await dataset(demo)
  close(+data.x, vqInitialPoint.x); close(+data.y, vqInitialPoint.y)
  checks.push('Inline VQ without controls, all codebook entries, fixed regions, corners, handle keyboard and Home, mouse and synthetic pen drag')

  demo = await go(slides[2])
  for (const preset of ganPresets) {
    await demo.getByRole('button', { name: preset.label, exact: true }).click()
    close(+(await dataset(demo)).mean, preset.mean)
    const readouts = await demo.locator('.readout .demo-stat').allTextContents()
    close(+readouts[0], optimalDiscriminator(0, preset.mean), .00051)
    close(+readouts[1], optimalDiscriminator(preset.mean, preset.mean), .00051)
    assert.equal((await dataset(demo)).matched, String(preset.mean === 0))
    await snapshot(`gan-${preset.label.toLowerCase()}`)
  }
  for (const mean of [-3, 3]) {
    await demo.getByRole('slider', { name: 'Generator mean', exact: true }).fill(String(mean))
    close(+(await dataset(demo)).mean, mean)
    await snapshot(`gan-extreme-${mean}`)
  }
  await sliderKey(demo, 'Generator mean', 'ArrowLeft', 'mean', 2.95)
  await checkReturn(slides[2])
  await demo.getByRole('button', { name: 'Reset', exact: true }).click()
  close(+(await dataset(demo)).mean, ganPresets[0].mean)
  checks.push('GAN presets, discriminator readouts, matched state, limits, keyboard and reset')

  for (const [index, slide] of slides.entries()) {
    demo = await go(slide, true)
    const toolbar = page.getByRole('navigation', { name: 'Lecture annotation tools' })
    const pen = toolbar.getByRole('button', { name: 'Pen', exact: true })
    const penWasEnabled = await pen.getAttribute('aria-pressed') === 'true'
    try {
      if (!penWasEnabled) await pen.click()
      if (index === 1) {
        assert.equal(await demo.locator('[data-encoder-handle]').evaluate(handle => getComputedStyle(handle).pointerEvents), 'none')
        await checkAnnotationDrag(demo, toolbar)
        const before = await dataset(demo)
        await demo.locator('[data-encoder-handle]').focus()
        await page.keyboard.press('ArrowRight')
        assert.deepEqual(await dataset(demo), before, 'Annotation mode must disable encoder keyboard movement')
      } else {
        await demo.getByRole('button', { name: index === 0 ? 'Matched prior' : 'Matched', exact: true }).click()
        if (index === 0) assert.equal((await dataset(demo)).mode, 'matched')
        else close(+(await dataset(demo)).mean, 0)
        await penClick(demo.getByRole('button', { name: 'Reset', exact: true }))
        const reset = await dataset(demo)
        if (index === 0) assert.equal(reset.mode, 'gaussian')
        else close(+reset.mean, ganPresets[0].mean)
      }
      await snapshot(`pen-controls-${slide.slide}`)
    } finally {
      // Restore the original toggle even when an assertion or screenshot fails.
      try {
        if ((await pen.getAttribute('aria-pressed') === 'true') !== penWasEnabled) await pen.click()
      } catch (error) {
        cleanupFailures.push(`Pen state restoration failed: ${error}`)
        throw error
      }
    }
  }
  checks.push('Prior/GAN controls above annotation layer, synthetic pen reset, VQ drag and keyboard disabled with annotation pen')
  assert.deepEqual(errors, []); assert.deepEqual(failures, []); assert.deepEqual(external, [])
  success = true
  console.log(`Latent demos: ${states.length} visual states; numeric readouts, drag, keyboard, navigation, reset, offline and pen checks passed.`)
} finally {
  await page.screenshot({ path: resolve(qa, 'last-state.png') }).catch(() => {})
  writeFileSync(resolve(qa, 'latent-demos-report.json'), JSON.stringify({ success, states, checks, errors, failures, external, cleanupFailures, sourceSha256: createHash('sha256').update(readFileSync(lecture.entry)).digest('hex') }, null, 2))
  await browser.close()
}
