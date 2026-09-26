import test from 'node:test'
import assert from 'node:assert/strict'
import { gaussianDensity, optimalDiscriminator, ganDensityPath, ganDiscriminatorPath, ganPresets } from './gan-demo.mjs'

test('optimal discriminator equals the density ratio throughout the plotted domain', () => {
  for (let mean = -3; mean <= 3; mean += 0.25) {
    for (let x = -6; x <= 6; x += 0.125) {
      const data = gaussianDensity(x)
      const model = gaussianDensity(x, mean)
      assert.ok(Math.abs(optimalDiscriminator(x, mean) - data / (data + model)) < 2e-15)
    }
  }
})

test('matched distributions give one half everywhere, including the tails', () => {
  for (const x of [-1e6, -1000, -6, 0, 6, 1000, 1e6]) {
    assert.equal(optimalDiscriminator(x, 0), 0.5)
  }
})

test('the decision boundary bisects the means and swapping x about it complements D', () => {
  for (const mean of [-3, -1, 0, 1, 3]) {
    assert.equal(optimalDiscriminator(mean / 2, mean), 0.5)
    for (let x = -6; x <= 6; x += 0.1) {
      assert.ok(Math.abs(optimalDiscriminator(x, mean) + optimalDiscriminator(mean - x, mean) - 1) < 3e-16)
      assert.equal(optimalDiscriminator(x, mean), optimalDiscriminator(-x, -mean))
    }
  }
})

test('stable tails remain finite and preserve real/fake orientation', () => {
  assert.equal(optimalDiscriminator(-1000, 3), 1)
  assert.equal(optimalDiscriminator(1000, 3), 0)
  assert.equal(optimalDiscriminator(-1000, -3), 0)
  assert.equal(optimalDiscriminator(1000, -3), 1)
  assert.ok(optimalDiscriminator(0, 3) > 0.98)
  assert.ok(optimalDiscriminator(3, 3) < 0.02)
})

test('both live and PDF paths are finite; the matched discriminator is horizontal', () => {
  for (const width of [760, 286]) {
    for (const { mean } of ganPresets) {
      for (const path of [ganDensityPath(mean, width), ganDiscriminatorPath(mean, width)]) {
        assert.equal(/NaN|Infinity/.test(path), false)
        assert.equal(path.split(' ').length, 241)
      }
    }
    assert.ok(ganDiscriminatorPath(0, width).split(' ').every(point => point.endsWith(',203.000')))
  }
})
