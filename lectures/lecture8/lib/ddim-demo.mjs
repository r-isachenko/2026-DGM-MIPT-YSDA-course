// Scalar toy: P(x_0=-1)=P(x_0=1)=1/2 and epsilon~N(0,1), independently.
// u=1-alpha_bar is a noise variance, increasing in the forward direction.
// Each shared-noise guide holds its (clean, noise) pair fixed along the path.
export const origins = Object.freeze([-1, 1])
export const ddimConfig = Object.freeze({
  initialU: .5,
  initialX: .35,
  futureU: .8,
  initialBounds: Object.freeze([-.8, .8]),
  // Initial true guides span [0,1]; each predicted guide is drawn only on [0,u].
  // Extrapolating a late prediction back to u=1 is neither needed nor bounded here.
  bounds: Object.freeze({ umin: 0, umax: 1, xmin: -2.2, xmax: 2.2 }),
  schedule: Object.freeze([.5, .35, .2, .1, .04, 0]),
})

function finite(value, name) {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`)
}
function noiseLevel(u, positive = false) {
  if (!Number.isFinite(u) || u < 0 || u > 1 || (positive && u === 0))
    throw new RangeError(`Noise variance must be in ${positive ? '(0,1]' : '[0,1]'}`)
}

export function sharedNoisePath(clean, noise, u) {
  finite(clean, 'Clean value'); finite(noise, 'Noise'); noiseLevel(u)
  return Math.sqrt(1-u)*clean + Math.sqrt(u)*noise
}

// Exact Bayes posterior for this two-point data distribution at positive noise.
// Its conditional mean is the population clean-data MSE predictor, not a draw
// from the posterior and not knowledge of the original component.
export function posterior(x, u) {
  finite(x, 'State'); noiseLevel(u, true)
  const clean = Math.tanh(Math.sqrt(1-u)*x/u)
  return { weights: [(1-clean)/2, (1+clean)/2], clean }
}

// Both guides pass through the same observed (u,x). Their weights encode the
// uncertainty when only this observation is known. Knowing x_0 selects one guide.
export function conditionalPaths(x, u) {
  const { weights } = posterior(x, u)
  return origins.map((clean, i) => ({
    clean,
    noise: (x-Math.sqrt(1-u)*clean)/Math.sqrt(u),
    weight: weights[i],
  }))
}

export function predictor(x, u) {
  finite(x, 'State'); noiseLevel(u)
  // The sampler has ended at u=0: this is a plotting convention, not a model
  // evaluation or a posterior conditional on a possibly off-support clean value.
  if (u === 0) return { clean: x, noise: 0 }
  const { clean } = posterior(x, u)
  return { clean, noise: (x-Math.sqrt(1-u)*clean)/Math.sqrt(u) }
}

// Freeze the prediction for this transition only. The next call recomputes it
// from the new state and noise level. No selected true origin enters this rule.
export function ddimStep(x, u, nextU) {
  finite(x, 'State'); noiseLevel(u, true); noiseLevel(nextU)
  if (nextU >= u) throw new RangeError('A DDIM step must lower the noise variance')
  const prediction = predictor(x, u)
  return {
    from: { x, u },
    to: { x: sharedNoisePath(prediction.clean, prediction.noise, nextU), u: nextU },
    prediction,
  }
}

export function ddimTrace(initialX = ddimConfig.initialX, grid = ddimConfig.schedule) {
  finite(initialX, 'Initial state')
  if (!Array.isArray(grid) || grid.length === 0) throw new RangeError('A noise grid is required')
  noiseLevel(grid[0])
  const states = [{ x: initialX, u: grid[0] }], steps = []
  for (let i=1; i<grid.length; i++) {
    const previous = states.at(-1)
    const step = ddimStep(previous.x, previous.u, grid[i])
    steps.push(step); states.push(step.to)
  }
  return { states, steps }
}

export function samplePath(clean, noise, from = 0, to = 1, count = 121) {
  noiseLevel(from); noiseLevel(to)
  if (!Number.isInteger(count) || count < 2) throw new RangeError('At least two path samples are required')
  return Array.from({ length: count }, (_, i) => {
    const u = from+(to-from)*i/(count-1)
    return { u, x: sharedNoisePath(clean, noise, u) }
  })
}
// These analytic conditional marginals and MSE predictions are exact for the
// toy. A finite sequence of the displayed DDIM steps is still approximate;
// the helpers do not claim exact sampling of the two-point data distribution.
