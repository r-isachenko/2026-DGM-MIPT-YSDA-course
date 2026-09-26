export const ganPresets = Object.freeze([
  { label: 'Separated', mean: 3 },
  { label: 'Overlap', mean: 1 },
  { label: 'Matched', mean: 0 },
])

export const ganDomain = Object.freeze([-6, 6])

export function gaussianDensity(x, mean = 0) {
  return Math.exp(-0.5 * (x - mean) ** 2) / Math.sqrt(2 * Math.PI)
}

// log(p_model / p_data) for equal unit variances. Evaluate the logistic
// directly so that underflow of both densities never produces 0 / 0.
export function optimalDiscriminator(x, mean) {
  const logRatio = mean * x - mean ** 2 / 2
  if (logRatio >= 0) {
    const inverseRatio = Math.exp(-logRatio)
    return inverseRatio / (1 + inverseRatio)
  }
  return 1 / (1 + Math.exp(logRatio))
}

function sampledPath(valueAt, width, yAt) {
  const steps = 240
  return Array.from({ length: steps + 1 }, (_, i) => {
    const x = ganDomain[0] + (ganDomain[1] - ganDomain[0]) * i / steps
    return `${i ? 'L' : 'M'}${(width * i / steps).toFixed(3)},${yAt(valueAt(x)).toFixed(3)}`
  }).join(' ')
}

export function ganDensityPath(mean, width, height = 90, baseline = 114) {
  return sampledPath(x => gaussianDensity(x, mean), width, y => baseline - height * y / 0.42)
}

export function ganDiscriminatorPath(mean, width, height = 86, top = 160) {
  return sampledPath(x => optimalDiscriminator(x, mean), width, y => top + height * (1 - y))
}
