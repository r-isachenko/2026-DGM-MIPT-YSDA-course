// Exact conditional mean for two equally weighted, isotropic Gaussian components.
export const cleanCenters = [[-2, -.8], [1.6, 1]]
const cleanVariance = .12

export function denoiser(x, sigma) {
  const variance = cleanVariance + sigma * sigma
  const logWeights = cleanCenters.map(([cx, cy]) =>
    -((x[0] - cx) ** 2 + (x[1] - cy) ** 2) / (2 * variance))
  const maxLogWeight = Math.max(...logWeights)
  const weights = logWeights.map(logWeight => Math.exp(logWeight - maxLogWeight))
  const sum = weights[0] + weights[1]
  return x.map((value, axis) => cleanCenters.reduce((mean, center, i) => {
    const conditionalMean = center[axis] + cleanVariance / variance * (value - center[axis])
    return mean + weights[i] / sum * conditionalMean
  }, 0))
}

export function denoiserStep(x, sigma, nextSigma) {
  if (sigma === 0) return [...x]
  const predicted = denoiser(x, sigma)
  const ratio = nextSigma / sigma
  return x.map((value, axis) => ratio * value + (1 - ratio) * predicted[axis])
}
