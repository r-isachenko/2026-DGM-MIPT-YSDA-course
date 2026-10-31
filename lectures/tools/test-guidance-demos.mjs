import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mixtureAt, guidanceAt, densityAt, cfgAt, modes, variance } from '../lecture8/lib/guidance-demos.mjs'
const close = (a, b, tolerance = 1e-8) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`)
test('analytic mixture and classifier scores equal finite-difference log gradients', () => {
  const h = 1e-5
  for (const point of [{ x: -.2, y: .3 }, { x: -1.7, y: -.8 }, { x: 1.7, y: .8 }]) {
    for (const label of [null, 0, 1]) {
      const value = mixtureAt(point, label)
      for (const [i, axis] of ['x', 'y'].entries()) {
        const logPlus = mixtureAt({ ...point, [axis]: point[axis] + h }, label).logDensity
        const logMinus = mixtureAt({ ...point, [axis]: point[axis] - h }, label).logDensity
        close(value.score[i], (logPlus - logMinus) / (2 * h), 1e-7)
      }
    }
    for (const label of [0, 1]) {
      const guided = guidanceAt(point, label, 3)
      assert.ok(guided.probability > 0 && guided.probability < 1)
      for (const [i, axis] of ['x', 'y'].entries()) {
        const logPlus = Math.log(guidanceAt({ ...point, [axis]: point[axis] + h }, label).probability)
        const logMinus = Math.log(guidanceAt({ ...point, [axis]: point[axis] - h }, label).probability)
        close(guided.classifier[i], (logPlus - logMinus) / (2 * h), 1e-7)
      }
    }
  }
})
test('normalized tilted densities recover unconditional and conditional endpoints', () => {
  for (const label of [0, 1]) for (const gamma of [0, 1, 3, 7]) {
    const { points, dx } = densityAt(gamma, label)
    const integral = points.reduce((sum, p, i) => sum + p.guided * (i === 0 || i === points.length - 1 ? .5 : 1), 0) * dx
    close(integral, 1)
    for (const p of points) {
      assert.ok(Number.isFinite(p.guided) && p.guided >= 0 && p.guided < .95)
      if (gamma < 2) close(p.guided, p[gamma ? 'conditional' : 'unconditional'], 1e-6)
    }
  }
})
test('CFG endpoints, extrapolation and classifier guidance agree', () => {
  const base = cfgAt(0), conditional = cfgAt(1), extra = cfgAt(3)
  for (let i = 0; i < 2; i++) {
    close(base.guided[i], base.unconditional[i])
    close(conditional.guided[i], conditional.conditional[i])
    close(extra.guided[i] - extra.conditional[i], 2 * (extra.conditional[i] - extra.unconditional[i]))
  }
  assert.ok(Math.abs(base.unconditional[0] * base.conditional[1] - base.unconditional[1] * base.conditional[0]) > .05)
})
test('one-dimensional plots are the x-marginals of the same two-dimensional toy', () => {
  for (const x of [-3, -.2, 2]) for (const label of [0, 1]) {
    const exact = modes.filter(mode => mode.label === label).reduce((sum, mode) =>
      sum + mode.weight * Math.exp(-((x - mode.mean[0]) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance), 0)
    close(mixtureAt({ x }, label, 1).density, exact)
  }
})
