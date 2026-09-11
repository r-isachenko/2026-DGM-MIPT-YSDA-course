// Reproducible binary toy models for the autoregressive demonstration.
export function seededRandom(seed = 2026) {
  let state = seed >>> 0
  return () => {
    state += 0x6D2B79F5
    let t = Math.imul(state ^ state >>> 15, 1 | state)
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export function dataset(side = 3, n = 32) {
  const random = seededRandom(2026)
  return Array.from({ length: n }, () => {
    const horizontal = random() < .5
    const bands = Array.from({ length: side }, () => +(random() < .5))
    return Array.from({ length: side * side }, (_, j) => bands[horizontal ? Math.floor(j / side) : j % side])
  })
}

export function histogram(data) {
  const counts = new Map()
  for (const x of data) {
    const key = x.join('')
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return counts
}

export function conditional(data, prefix, model = 'joint') {
  const j = prefix.length
  const matching = data.filter(x => model === 'independent' || j === 0
    || (model === 'markov' ? x[j - 1] === prefix[j - 1] : prefix.every((v, k) => x[k] === v)))
  // This context has zero empirical probability. It cannot be reached by sampling
  // the joint model; return null rather than inventing a smoothed conditional.
  if (!matching.length) return null
  return matching.reduce((sum, x) => sum + x[j], 0) / matching.length
}

export function sample(data, model, random = seededRandom()) {
  const x = []
  for (let j = 0; j < data[0].length; j++) {
    const p = conditional(data, x, model)
    if (p === null) throw new Error('Unreachable context during sampling')
    x.push(+(random() < p))
  }
  return x
}

export function factors(data, x, model = 'joint') {
  return x.map((bit, j) => {
    const p = conditional(data, x.slice(0, j), model)
    return p === null ? null : bit ? p : 1 - p
  })
}

export function likelihood(data, x, model = 'joint') {
  let probability = 1
  for (const p of factors(data, x, model)) {
    if (probability === 0) return 0
    if (p === null) return 0
    probability *= p
  }
  return probability
}

export function isBarsOrStripes(x, side) {
  return Array.from({ length: side }, (_, r) => x.slice(r * side, (r + 1) * side).every(v => v === x[r * side])).every(Boolean)
    || Array.from({ length: side }, (_, c) => Array.from({ length: side }, (_, r) => x[r * side + c]).every(v => v === x[c])).every(Boolean)
}

export function binaryPatterns(m) {
  if (m > 12) throw new Error('Only enumerate small binary spaces')
  return Array.from({ length: 2 ** m }, (_, k) => k.toString(2).padStart(m, '0').split('').map(Number))
}
