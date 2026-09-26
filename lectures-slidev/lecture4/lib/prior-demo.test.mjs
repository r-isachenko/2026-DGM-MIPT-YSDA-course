import test from 'node:test'
import assert from 'node:assert/strict'
import {
  encoderMeans, encoderSigma, integrate, conditionalDensity, aggregatedDensity,
  priorDensity, priorTerms, priorExamples,
} from './prior-demo.mjs'

const close = (actual, expected, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`)

test('empirical encoder, aggregated posterior, and both priors are normalized', () => {
  encoderMeans.forEach((_, index) => close(integrate(z => conditionalDensity(z, index)), 1))
  close(integrate(aggregatedDensity), 1)
  for (const mode of ['gaussian', 'matched']) close(integrate(z => priorDensity(z, mode)), 1)
})

test('ELBO surgery identity agrees with independently integrated conditional KL', () => {
  for (const example of priorExamples) {
    close(example.conditionalKL, example.mutualInformation + example.marginalKL)
    assert.ok(example.marginalKL >= 0)
    assert.ok(example.mutualInformation > 0 && example.mutualInformation < Math.log(encoderMeans.length))
  }
})

test('Gaussian prior conditional KL agrees with the analytic Gaussian formula', () => {
  const expected = encoderMeans.reduce((sum, mean) => sum + -Math.log(encoderSigma) + (encoderSigma ** 2 + mean ** 2 - 1) / 2, 0) / encoderMeans.length
  close(priorExamples[0].conditionalKL, expected)
})

test('matching the prior eliminates marginal KL and leaves mutual information unchanged', () => {
  const [gaussian, matched] = priorExamples
  assert.equal(matched.marginalKL, 0)
  assert.equal(matched.mutualInformation, gaussian.mutualInformation)
  close(matched.conditionalKL, matched.mutualInformation)
  assert.ok(matched.conditionalKL > 0)
  for (const z of [-4, -2, -1, 0, 1, 2, 4]) assert.equal(priorDensity(z, 'matched'), aggregatedDensity(z))
})

test('display values are stable when the integration resolution doubles', () => {
  for (const original of priorExamples) {
    const finer = priorTerms(original.mode, 8192)
    for (const key of ['marginalKL', 'mutualInformation', 'conditionalKL']) close(original[key], finer[key])
  }
})
