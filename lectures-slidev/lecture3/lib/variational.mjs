// A normalized scalar model: z ~ N(0, 1), x | z ~ N(z, 1), observed x = 2.
export const observation = 2
export const posterior = Object.freeze({ mean: 1, sigma: Math.SQRT1_2 })
export const logEvidence = -.5 * (Math.log(4 * Math.PI) + observation ** 2 / 2)
export const elboPresets = Object.freeze([
  { label: 'Poor', mean: -.5, sigma: 1.4 },
  { label: 'Better', mean: .7, sigma: .85 },
  { label: 'Exact', ...posterior },
])

export function normal(z, mean = 0, sigma = 1) {
  return Math.exp(-.5 * ((z - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI))
}
export function gaussianKL(mean, sigma, target = posterior) {
  if (!(sigma > 0 && target.sigma > 0)) throw new RangeError('Standard deviations must be positive')
  return Math.log(target.sigma / sigma)
    + (sigma ** 2 + (mean - target.mean) ** 2) / (2 * target.sigma ** 2) - .5
}
export function elboTerms(mean, sigma) {
  const reconstruction = -.5 * (Math.log(2 * Math.PI) + (observation - mean) ** 2 + sigma ** 2)
  const priorKL = gaussianKL(mean, sigma, { mean: 0, sigma: 1 })
  return { reconstruction, priorKL, elbo: reconstruction - priorKL, gap: gaussianKL(mean, sigma) }
}
export function densityPath(mean, sigma, range, width, height, baseline = height) {
  return Array.from({ length: 181 }, (_, i) => {
    const z = -range + 2 * range * i / 180
    return `${i ? 'L' : 'M'}${(width * i / 180).toFixed(2)},${(baseline - normal(z, mean, sigma) * height).toFixed(2)}`
  }).join(' ')
}
