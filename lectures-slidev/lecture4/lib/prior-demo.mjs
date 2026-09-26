// Fixed empirical encoder: p_data(x_i) = 1/3, q_phi(z | x_i) = N(mu_i, .65^2).
export const encoderMeans = Object.freeze([-2, 0, 2])
export const encoderSigma = .65
export const priorModes = Object.freeze(['gaussian', 'matched'])
export const integrationRange = 10

export function normalLogDensity(z, mean = 0, sigma = 1) {
  if (!(sigma > 0)) throw new RangeError('Standard deviation must be positive')
  return -.5 * ((z - mean) / sigma) ** 2 - Math.log(sigma * Math.sqrt(2 * Math.PI))
}

export function conditionalDensity(z, index) {
  return Math.exp(normalLogDensity(z, encoderMeans[index], encoderSigma))
}

export function aggregatedLogDensity(z) {
  const logs = encoderMeans.map(mean => normalLogDensity(z, mean, encoderSigma))
  const largest = Math.max(...logs)
  return largest + Math.log(logs.reduce((sum, value) => sum + Math.exp(value - largest), 0) / encoderMeans.length)
}

export const aggregatedDensity = z => Math.exp(aggregatedLogDensity(z))

export function priorLogDensity(z, mode) {
  if (!priorModes.includes(mode)) throw new RangeError(`Unknown prior: ${mode}`)
  return mode === 'matched' ? aggregatedLogDensity(z) : normalLogDensity(z)
}

export const priorDensity = (z, mode) => Math.exp(priorLogDensity(z, mode))

// Composite Simpson integration on [-10, 10]; each encoder tail is >12 sigma away.
export function integrate(fn, intervals = 4096) {
  if (!Number.isInteger(intervals) || intervals < 2 || intervals % 2) throw new RangeError('Use a positive even interval count')
  const step = 2 * integrationRange / intervals
  let sum = fn(-integrationRange) + fn(integrationRange)
  for (let i = 1; i < intervals; i++) sum += (i % 2 ? 4 : 2) * fn(-integrationRange + i * step)
  return sum * step / 3
}

export function priorTerms(mode, intervals = 4096) {
  // Integrate all three expressions directly; do not obtain conditional KL by addition.
  const marginalKL = integrate(z => aggregatedDensity(z) * (aggregatedLogDensity(z) - priorLogDensity(z, mode)), intervals)
  const mutualInformation = encoderMeans.reduce((sum, mean, index) => sum + integrate(z =>
    conditionalDensity(z, index) * (normalLogDensity(z, mean, encoderSigma) - aggregatedLogDensity(z)), intervals), 0) / encoderMeans.length
  const conditionalKL = encoderMeans.reduce((sum, mean, index) => sum + integrate(z =>
    conditionalDensity(z, index) * (normalLogDensity(z, mean, encoderSigma) - priorLogDensity(z, mode)), intervals), 0) / encoderMeans.length
  return { marginalKL, mutualInformation, conditionalKL }
}

export const priorExamples = Object.freeze(priorModes.map(mode => Object.freeze({
  mode,
  label: mode === 'gaussian' ? 'Gaussian prior' : 'Matched prior',
  ...priorTerms(mode),
})))

export function priorDensityPath(density, width = 492, height = 136) {
  return Array.from({ length: 361 }, (_, index) => {
    const z = -4.5 + index / 360 * 9
    return `${index ? 'L' : 'M'}${(index / 360 * width).toFixed(2)},${(height - density(z) / .7 * height).toFixed(2)}`
  }).join(' ')
}
