import test from 'node:test'
import assert from 'node:assert/strict'
import { linearMap, arSample, arEvaluate, coupling, couplingLogDet, noiseCloud } from '../lecture2/lib/flow-models.mjs'

const near = (a, b, tolerance = 1e-9) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`)
test('Jacobian demo: polygon area matches determinant including area-preserving shear', () => {
  for (const a of [.5, 1, 2]) for (const b of [-1, 0, 1]) {
    const p = [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]].map(p => linearMap(p, a, b))
    const area = Math.abs(p.reduce((s, [x, y], i) => s + x * p[(i + 1) % 4][1] - y * p[(i + 1) % 4][0], 0)) / 2
    near(area, a)
  }
})
test('AR demo: sequential generation and observed-prefix evaluation are inverses', () => {
  const z = [-1, .5, 1, -.5]
  const x = arSample(z)
  ;[-1, -.5, -.5, -2.5].forEach((v, i) => near(x[i], v))
  arEvaluate(x).forEach((v, i) => near(v, z[i]))
  const changed = [...x]; changed[3] += 1
  arEvaluate(changed).slice(0, 3).forEach((v, i) => near(v, z[i]))
})
test('Coupling demo: both masks invert and numerical Jacobians match the displayed determinants', () => {
  const h = 1e-5
  for (const axis of [0, 1]) for (const strength of [0, .7, 1.5]) for (const p of noiseCloud(12)) {
    const q = coupling(p, axis, strength)
    near(q[1 - axis], p[1 - axis])
    coupling(q, axis, strength, true).forEach((v, i) => near(v, p[i]))
    const columns = [0, 1].map(i => {
      const plus = [...p], minus = [...p]; plus[i] += h; minus[i] -= h
      const a = coupling(plus, axis, strength), b = coupling(minus, axis, strength)
      return a.map((v, j) => (v - b[j]) / (2 * h))
    })
    const determinant = columns[0][0] * columns[1][1] - columns[1][0] * columns[0][1]
    near(Math.log(determinant), couplingLogDet(p, axis, strength), 1e-7)
    near(couplingLogDet(q, axis, strength), couplingLogDet(p, axis, strength))
  }
})
test('Two coupling layers preserve point identities and invert in reverse order', () => {
  assert.deepEqual(noiseCloud(), noiseCloud())
  for (const strength of [0, .7, 1]) for (const z of noiseCloud()) {
    const y = coupling(z, 1, strength), x = coupling(y, 0, strength)
    const recovered = coupling(coupling(x, 0, strength, true), 1, strength, true)
    recovered.forEach((v, i) => near(v, z[i]))
    assert.ok([...z, ...y, ...x].every(v => Number.isFinite(v) && Math.abs(v) < 3.4), 'Point outside plot bounds')
  }
})
