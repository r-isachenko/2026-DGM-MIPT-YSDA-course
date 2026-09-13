export function linearMap([x, y], stretch = 1, shear = 0) {
  return [stretch * x + shear * y, y]
}

export function arSample(z) {
  const x = []
  for (const noise of z) x.push(noise + x.reduce((a, b) => a + b, 0))
  return x
}

export function arEvaluate(x) {
  return x.map((value, j) => value - x.slice(0, j).reduce((a, b) => a + b, 0))
}

// One affine coupling layer in the generative direction. The conditioning
// coordinate stays unchanged, so inversion evaluates the same conditioner.
export function coupling(point, axis = 1, strength = 1, inverse = false) {
  const out = [...point]
  const t = Math.tanh(point[1 - axis])
  const scale = Math.exp(0.4 * strength * t)
  const shift = 0.8 * strength * t
  out[axis] = inverse ? (point[axis] - shift) / scale : point[axis] * scale + shift
  return out
}

export function couplingLogDet(point, axis = 1, strength = 1) {
  return 0.4 * strength * Math.tanh(point[1 - axis])
}

export function noiseCloud(count = 180) {
  let seed = 2026
  function random() {
    seed = (1664525 * seed + 1013904223) >>> 0
    return (seed + 0.5) / 4294967296
  }
  return Array.from({ length: count }, () => {
    const r = Math.sqrt(-2 * Math.log(random())) * 0.65
    const angle = 2 * Math.PI * random()
    return [r * Math.cos(angle), r * Math.sin(angle)]
  })
}
