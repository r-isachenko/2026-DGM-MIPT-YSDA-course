import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { root, lecturePaths } from './course.mjs'
const lecture = lecturePaths('2')
const baseURL = process.env.SLIDEV_QA_URL || `http://localhost:${lecture.port}`
const qa = resolve(root, 'output/qa/lecture2/flow-demos')
mkdirSync(qa, { recursive: true })
const map = JSON.parse(readFileSync(lecture.map, 'utf8'))
const slide = frame => (map.find(s => s.frame === `extension: ${frame}`) || map.find(s => s.frame === frame)).slide
const browser = await chromium.launch({ executablePath: process.env.SLIDEV_BROWSER_PATH || '/Applications/Yandex.app/Contents/MacOS/Yandex', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
const errors = [], failures = [], states = []
page.on('pageerror', e => errors.push(String(e)))
page.on('response', r => { if (r.status() >= 400) failures.push([r.status(), r.url()]) })
async function go(frame, suffix = '') {
  const query = new URLSearchParams(suffix.replace(/^\?/, ''))
  if (frame === 9) query.set('clicks', '3')
  await page.goto(`${baseURL}/${slide(frame)}?${query}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  return page.locator('[data-demo]:visible')
}
async function capture(name) {
  await page.mouse.move(1250, 680)
  // Wait for the geometry animation to settle before comparing/saving it.
  await page.waitForTimeout(400)
  const overflow = await page.locator('[data-demo]:visible').evaluate(demo => {
    const layout = demo.closest('.slidev-layout'), r = layout.getBoundingClientRect()
    const scale = r.width / 1280
    const bottom = Math.min(r.top + 672 * scale, layout.querySelector('.source').getBoundingClientRect().top - 12 * scale)
    return [...demo.querySelectorAll('button, label, svg, .katex-html, .demo-note, .demo-takeaway, .dependency-band')].map(el => ({ text: el.textContent.slice(0, 80), r: el.getBoundingClientRect().toJSON() })).filter(el => el.r.width > 0 && (el.r.bottom > bottom || el.r.right > r.right - 30 * scale))
  })
  assert.deepEqual(overflow, [], `Overflow: ${name}`)
  await page.screenshot({ path: resolve(qa, `${name}.png`) })
  states.push(name)
}
const circles = demo => demo.locator('.coupling-card:last-child .flow-point, .coupling-card:last-child .flow-highlight').evaluateAll(els => els.map(e => [e.getAttribute('cx'), e.getAttribute('cy')]))
try {
  let demo = await go(9)
  for (const [preset, determinant, shear] of [['Shear', '1', '1'], ['Stretch', '2', '0'], ['Identity', '1', '0']]) {
    await demo.getByRole('button', { name: preset, exact: true }).click()
    assert.equal(await demo.getAttribute('data-determinant'), determinant)
    assert.equal(await demo.getAttribute('data-shear'), shear)
    await capture(`jacobian-${preset.toLowerCase()}`)
  }
  await demo.getByRole('slider', { name: 'Stretch', exact: true }).fill('0.5')
  await demo.getByRole('slider', { name: 'Shear', exact: true }).fill('-1')
  await capture('jacobian-compression')
  await demo.getByRole('slider', { name: 'Stretch', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  assert.equal(await demo.getAttribute('data-determinant'), '0.6')
  assert.equal(new URL(page.url()).pathname, `/${slide(9)}`, 'Slider keyboard must not navigate')
  await demo.getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal(await demo.getAttribute('data-determinant'), '1')
  assert.equal(await demo.getAttribute('data-shear'), '0')

  demo = await go(18)
  const directions = demo.locator('[data-direction]')
  assert.equal(await directions.count(), 2, 'Both general AR directions stay visible')
  assert.equal(await demo.locator('[data-direction="sample"]').evaluate(el => el.classList.contains('active')), true)
  const generalFormulas = await directions.allTextContents()
  const formulaGeometry = await directions.evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()))
  await capture('ar-start')
  for (let n = 1; n <= 4; n++) {
    await demo.getByRole('button', { name: 'Next coordinate', exact: true }).click()
    assert.equal(await demo.locator('.result[data-known="true"]').count(), n)
    await demo.getByRole('button', { name: 'Sampling', exact: true }).click()
    assert.equal(await demo.getAttribute('data-step'), String(n), 'Active mode preserves progress')
    if (n < 4) {
      const arrow = await demo.locator('.prefix-arrowhead').getAttribute('d')
      assert.match(arrow, /,6 l 6,-6 l 6,6$/, 'Arrowhead points upward into the next output')
      const positions = await demo.evaluate(el => {
        const head = el.querySelector('.prefix-arrowhead').getBoundingClientRect()
        const target = el.querySelector('.result.current').getBoundingClientRect()
        return { tipX: head.left + head.width / 2, tipY: head.top, centerX: target.left + target.width / 2, bottom: target.bottom }
      })
      assert.ok(Math.abs(positions.tipX - positions.centerX) < 1)
      assert.ok(Math.abs(positions.tipY - positions.bottom) < 1)
    }
    await capture(`ar-step-${n}`)
  }
  assert.equal(await demo.getByRole('button', { name: 'Next coordinate' }).isDisabled(), true)
  await demo.getByRole('button', { name: 'Density evaluation', exact: true }).click()
  assert.equal(await demo.locator('[data-direction="evaluate"]').evaluate(el => el.classList.contains('active')), true)
  assert.equal(await demo.locator('[data-direction="sample"]').evaluate(el => el.classList.contains('active')), false)
  assert.deepEqual(await directions.allTextContents(), generalFormulas, 'Mode switching preserves both general formulas')
  assert.deepEqual(await directions.evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON())), formulaGeometry, 'Mode switching preserves formula geometry')
  assert.equal(await demo.locator('.result[data-known="true"]').count(), 0)
  await capture('ar-evaluate-start')
  await demo.getByRole('button', { name: 'Compute all', exact: true }).click()
  assert.equal(await demo.locator('.result[data-known="true"]').count(), 4)
  await capture('ar-evaluate-complete')
  await page.keyboard.press('ArrowRight')
  await page.waitForURL(`**/${slide(18) + 1}`)
  await page.keyboard.press('ArrowLeft')
  await page.waitForURL(new RegExp(`/${slide(18)}(?:\\?|$)`))
  assert.equal(await demo.getAttribute('data-step'), '4', 'Returning to slide preserves state')
  await demo.getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal(await demo.getAttribute('data-step'), '0')
  assert.equal(await demo.getAttribute('data-mode'), 'evaluate')

  demo = await go(20)
  const original = await circles(demo)
  await capture('coupling-base')
  await demo.getByRole('button', { name: 'Apply layer 1', exact: true }).click()
  const first = await circles(demo)
  assert.notDeepEqual(first, original)
  assert.deepEqual(first.map(p => p[0]), original.map(p => p[0]), 'First mask preserves coordinate 1')
  assert.ok(await demo.locator('.motion-trail').evaluateAll(lines => lines.length === 8 && lines.every(l => l.getAttribute('x1') === l.getAttribute('x2'))), 'First-layer trails must be vertical')
  await capture('coupling-layer-1')
  await demo.getByRole('button', { name: 'Apply layer 2', exact: true }).click()
  const second = await circles(demo)
  assert.notDeepEqual(second, first)
  assert.deepEqual(second.map(p => p[1]), first.map(p => p[1]), 'Second mask preserves coordinate 2')
  assert.ok(await demo.locator('.coupling-card:last-child .motion-trail').evaluateAll(lines => lines.length === 8 && lines.every(l => l.getAttribute('y1') === l.getAttribute('y2'))), 'Second-layer trails must be horizontal')
  await capture('coupling-layer-2')
  await demo.getByRole('button', { name: 'Invert last layer', exact: true }).click()
  assert.deepEqual(await circles(demo), first)
  await capture('coupling-invert-2')
  await demo.getByRole('button', { name: 'Invert last layer', exact: true }).click()
  assert.deepEqual(await circles(demo), original)
  await demo.getByRole('button', { name: 'Apply layer 1', exact: true }).click()
  await demo.getByRole('button', { name: 'Apply layer 2', exact: true }).click()
  await demo.getByRole('slider', { name: 'Coupling strength' }).fill('0')
  assert.deepEqual(await circles(demo), original, 'Zero strength is identity')
  assert.equal(await demo.getAttribute('data-log-det'), '0')
  await capture('coupling-zero-strength')
  await demo.getByRole('button', { name: 'Reset', exact: true }).click()
  assert.equal(await demo.getAttribute('data-step'), '0')
  assert.equal(await demo.getAttribute('data-strength'), '1')

  for (const frame of [9, 18, 20]) {
    demo = await go(frame, '?tools')
    const toolbar = page.getByRole('navigation', { name: 'Lecture annotation tools' })
    const pen = toolbar.getByRole('button', { name: 'Pen', exact: true })
    await pen.click()
    await demo.getByRole('button', { name: frame === 9 ? 'Shear' : frame === 18 ? 'Next coordinate' : 'Apply layer 1', exact: true }).click()
    await capture(`pen-${frame}`)
    await pen.click()
  }
  assert.deepEqual(errors, [])
  assert.deepEqual(failures, [])
  console.log(`Flow demos: ${states.length} visual states; controls, math readouts, masks, inversion, reset, navigation and pen checks passed.`)
} finally {
  await page.screenshot({ path: resolve(qa, 'last-state.png') })
  writeFileSync(resolve(qa, 'report.json'), JSON.stringify({ states, errors, failures }, null, 2))
  await browser.close()
}
