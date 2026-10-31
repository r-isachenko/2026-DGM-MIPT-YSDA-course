// Analytic toy densities at one fixed noise level, shared by both guidance views.
export const variance = .58 ** 2
export const modes = [
  { label: 0, weight: .65, mean: [-2, .5] },
  { label: 0, weight: .35, mean: [.5, 1] },
  { label: 1, weight: .4, mean: [-.5, -.7] },
  { label: 1, weight: .6, mean: [2, .5] },
]
export const colors = { unconditional: '#8854c0', classifier: '#007f82', guided: '#b58a25' }
export const gammaPresets = [0, 1, 3, 7]
export const domain = [-5, 5]
const logSum = values => {
  const maximum = Math.max(...values)
  return maximum + Math.log(values.reduce((sum, v) => sum + Math.exp(v - maximum), 0))
}
export function mixtureAt(point, label = null, dimensions = 2) {
  const selected = modes.filter(mode => label === null || mode.label === label)
  const logs = selected.map(mode => Math.log(mode.weight * (label === null ? .5 : 1))
    - dimensions / 2 * Math.log(2 * Math.PI * variance)
    - ((point.x - mode.mean[0]) ** 2 + (dimensions === 2 ? (point.y - mode.mean[1]) ** 2 : 0)) / (2 * variance))
  const logDensity = logSum(logs)
  const weights = logs.map(value => Math.exp(value - logDensity))
  const score = [0, 1].map(axis => dimensions === 1 && axis === 1 ? 0 : selected.reduce((sum, mode, i) =>
    sum + weights[i] * (mode.mean[axis] - (axis === 0 ? point.x : point.y)) / variance, 0))
  return { logDensity, density: Math.exp(logDensity), score }
}
export function guidanceAt(point, label = 1, gamma = 3) {
  const unconditional = mixtureAt(point), conditional = mixtureAt(point, label)
  const classifier = conditional.score.map((value, i) => value - unconditional.score[i])
  const guided = unconditional.score.map((value, i) => value + gamma * classifier[i])
  return { unconditional: unconditional.score, conditional: conditional.score, classifier, guided,
    probability: Math.exp(conditional.logDensity - unconditional.logDensity) * .5 }
}
export function densityAt(gamma = 3, label = 1, count = 501) {
  const dx = (domain[1] - domain[0]) / (count - 1)
  const points = Array.from({ length: count }, (_, i) => {
    const x = domain[0] + i * dx, p = mixtureAt({ x }, null, 1), conditional = mixtureAt({ x }, label, 1)
    return { x, unconditional: p.density, conditional: conditional.density,
      logWeight: p.logDensity + gamma * (conditional.logDensity - p.logDensity + Math.log(.5)) }
  })
  const maximum = Math.max(...points.map(point => point.logWeight))
  const weights = points.map(point => Math.exp(point.logWeight - maximum))
  const integral = dx * weights.reduce((sum, weight, i) => sum + weight * (i === 0 || i === count - 1 ? .5 : 1), 0)
  points.forEach((point, i) => { point.guided = weights[i] / integral })
  return { points, dx, logZ: maximum + Math.log(integral) }
}
export function curvePath(points, field, width = 740, height = 260, ymax = .95) {
  return points.map((point, i) => `${i ? 'L' : 'M'}${((point.x - domain[0]) / (domain[1] - domain[0]) * width).toFixed(2)},${(height * (1 - point[field] / ymax)).toFixed(2)}`).join(' ')
}
export function cfgAt(gamma = 3) {
  // Two non-collinear exact scores from the same toy mixture at a fixed point.
  const scores = guidanceAt({ x: 1, y: 0 }, 1, gamma)
  return { ...scores, gamma }
}
