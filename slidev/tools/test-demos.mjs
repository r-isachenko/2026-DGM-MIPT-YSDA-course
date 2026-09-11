import assert from 'node:assert/strict'
import { test } from 'node:test'
import { binaryPatterns, conditional, dataset, factors, histogram, isBarsOrStripes, likelihood, sample, seededRandom } from '../lib/binary-models.mjs'
import { divergences, forwardFit, logTarget, normal, reverseFit, targetDensity } from '../lib/kl-demo.mjs'

test('full-context factorization recovers every empirical whole-image probability', () => {
  for (const side of [2, 3]) {
    const data = dataset(side), counts = histogram(data)
    for (const x of binaryPatterns(side * side)) {
      assert.ok(Math.abs(likelihood(data, x) - (counts.get(x.join('')) || 0) / data.length) < 1e-12)
    }
  }
})

test('all three fitted models are normalized and sampling is reproducible', () => {
  const data = dataset(3), patterns = binaryPatterns(9)
  for (const model of ['joint', 'independent', 'markov']) {
    assert.ok(Math.abs(patterns.reduce((sum, x) => sum + likelihood(data, x, model), 0) - 1) < 1e-12)
    const a = seededRandom(41), b = seededRandom(41)
    for (let i = 0; i < 100; i++) {
      const x = sample(data, model, a)
      assert.deepEqual(x, sample(data, model, b))
      assert.ok(likelihood(data, x, model) > 0)
      if (model === 'joint') assert.ok(histogram(data).has(x.join('')))
    }
  }
})

test('the toy dataset has structure and the independent fit loses it', () => {
  const data = dataset(3)
  assert.ok(data.every(x => isBarsOrStripes(x, 3)))
  const invalid = binaryPatterns(9).filter(x => !isBarsOrStripes(x, 3))
  assert.equal(invalid.reduce((sum, x) => sum + likelihood(data, x, 'joint'), 0), 0)
  assert.ok(invalid.reduce((sum, x) => sum + likelihood(data, x, 'independent'), 0) > .5)
})

test('AR evaluation accumulates the exact image likelihood; impossible contexts are explicit', () => {
  const data = dataset(3), x = data[0]
  const logp = factors(data, x).reduce((sum, p) => sum + Math.log(p), 0)
  assert.ok(Math.abs(Math.exp(logp) - histogram(data).get(x.join('')) / data.length) < 1e-12)
  assert.equal(conditional([[0, 0]], [1]), null)
  assert.equal(likelihood([[0, 0]], [1, 1]), 0)
})

test('KL quadrature agrees with moment-matching and symmetric minima', () => {
  const fit = forwardFit, optimum = divergences(fit.mean, fit.sigma)
  for (const [mean, sigma] of [[-3, .3], [1, 1], [0, 3], [2, .55]]) {
    const d = divergences(mean, sigma)
    // Difference of Gaussian cross-entropies; the unknown target entropy cancels.
    const expected = Math.log(sigma / fit.sigma) + (fit.sigma ** 2 + mean ** 2) / (2 * sigma ** 2) - .5
    assert.ok(Math.abs(d.forward - optimum.forward - expected) < 1e-10)
    assert.ok(d.forward >= 0 && d.reverse >= 0)
  }
  const right = reverseFit(), left = reverseFit(-1)
  assert.ok(Math.abs(left.value - right.value) < 1e-10)
  assert.ok(right.mean > 1.9 && right.sigma > .5 && right.sigma < .65)
  assert.ok(right.value < optimum.reverse)
  for (const dm of [-.05, 0, .05]) for (const ds of [-.05, 0, .05])
    assert.ok(divergences(right.mean + dm, right.sigma + ds).reverse >= right.value - 1e-8)
  // Independent finer integration checks the displayed range's broadest Gaussian.
  let forward = 0, reverse = 0
  for (let i = 0; i < 10000; i++) {
    const x = -50 + (i + .5) * .01, p = targetDensity(x), q = normal(x, 3, 3)
    if (p > 0) forward += p * Math.log(p / q) * .01
    if (q > 0) reverse += q * (Math.log(q) - logTarget(x)) * .01
  }
  const d = divergences(3, 3)
  assert.ok(Math.abs(forward - d.forward) < 1e-8)
  assert.ok(Math.abs(reverse - d.reverse) < 1e-6)
})
