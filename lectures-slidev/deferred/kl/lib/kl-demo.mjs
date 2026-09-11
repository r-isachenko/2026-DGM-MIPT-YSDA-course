const logNormal = (x, mean, sigma) => -.5 * ((x - mean) / sigma) ** 2 - Math.log(sigma) - .5 * Math.log(2 * Math.PI)
export const normal = (x, mean, sigma) => Math.exp(logNormal(x, mean, sigma))
export function logTarget(x) {
  const a = logNormal(x, -2, .55), b = logNormal(x, 2, .55)
  const m = Math.max(a, b)
  return m + Math.log(Math.exp(a - m) + Math.exp(b - m)) - Math.log(2)
}
export const targetDensity = x => Math.exp(logTarget(x))
// Midpoint quadrature on [-24,24]. All UI Gaussians have negligible mass outside.
const dx = .04
const grid = Array.from({ length: 1200 }, (_, i) => {
  const x = -24 + (i + .5) * dx, logp = logTarget(x)
  return { x, logp, p: Math.exp(logp) }
})
export function divergences(mean, sigma) {
  let forward = 0, reverse = 0
  for (const { x, logp, p } of grid) {
    const logq = logNormal(x, mean, sigma)
    forward += p * (logp - logq) * dx
    reverse += Math.exp(logq) * (logq - logp) * dx
  }
  return { forward, reverse }
}
export const forwardFit = { mean: 0, sigma: Math.sqrt(4 + .55 ** 2) }
export function reverseFit(sign = 1) {
  // Refine several initializations; include the broad symmetric candidate.
  const candidates = [[2, .55], [0, 2], [1, 1]].map(([mean, sigma]) => {
    let best = divergences(mean, sigma).reverse
    for (let step = .4; step > .00005; step /= 2) {
      let improved = true
      while (improved) {
        improved = false
        for (const [dm, ds] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
          const m = mean + dm, s = sigma + ds
          if (s < .3 || s > 3 || m < -3 || m > 3) continue
          const value = divergences(m, s).reverse
          if (value < best - 1e-12) { mean = m; sigma = s; best = value; improved = true }
        }
      }
    }
    return { mean: Math.abs(mean) * sign, sigma, value: best }
  })
  return candidates.sort((a, b) => a.value - b.value)[0]
}
