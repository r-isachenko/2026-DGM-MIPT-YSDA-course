export const vqBounds = Object.freeze({ xmin: -2, xmax: 2, ymin: -1.5, ymax: 1.5 })
export const codebook = Object.freeze([
  { x: -1.4, y: -.95 }, { x: -.45, y: -1 }, { x: .9, y: -.8 },
  { x: 1.5, y: .35 }, { x: .7, y: 1 }, { x: -.6, y: .85 },
  { x: -1.5, y: .3 }, { x: 0, y: -.05 },
].map(Object.freeze))
export const vqInitialPoint = Object.freeze({ x: -.25, y: .3 })

/** Return a zero-based code index; exact ties choose the first code. */
export function nearestCode(point, codes = codebook) {
  if (!codes.length) throw new RangeError('A codebook must contain at least one entry.')
  let index = 0
  let distanceSquared = Infinity
  codes.forEach((code, i) => {
    const candidate = (point.x - code.x) ** 2 + (point.y - code.y) ** 2
    if (candidate < distanceSquared) { distanceSquared = candidate; index = i }
  })
  return { index, code: codes[index], distanceSquared }
}

function clipHalfPlane(polygon, a, b, c) {
  const result = []
  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i]
    const end = polygon[(i + 1) % polygon.length]
    const d0 = a * start.x + b * start.y - c
    const d1 = a * end.x + b * end.y - c
    const inside0 = d0 <= 1e-12
    const inside1 = d1 <= 1e-12
    if (inside0) result.push(start)
    if (inside0 !== inside1) {
      const t = d0 / (d0 - d1)
      result.push({ x: start.x + t * (end.x - start.x), y: start.y + t * (end.y - start.y) })
    }
  }
  return result
}

/** Clip each Euclidean Voronoi cell to the visible rectangle. */
export function voronoiCells(codes = codebook, bounds = vqBounds) {
  return codes.map((code, i) => {
    let polygon = [
      { x: bounds.xmin, y: bounds.ymin }, { x: bounds.xmax, y: bounds.ymin },
      { x: bounds.xmax, y: bounds.ymax }, { x: bounds.xmin, y: bounds.ymax },
    ]
    for (let j = 0; j < codes.length && polygon.length; j++) {
      if (i === j) continue
      const other = codes[j]
      const a = 2 * (other.x - code.x)
      const b = 2 * (other.y - code.y)
      const c = other.x ** 2 + other.y ** 2 - code.x ** 2 - code.y ** 2
      if (a === 0 && b === 0) {
        if (j < i) polygon = []
      } else polygon = clipHalfPlane(polygon, a, b, c)
    }
    return polygon
  })
}
