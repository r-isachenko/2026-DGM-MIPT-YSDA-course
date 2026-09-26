import test from 'node:test'
import assert from 'node:assert/strict'
import { codebook, vqInitialPoint, nearestCode, voronoiCells, vqBounds } from './vq-demo.mjs'

test('Nearest-code assignment switches across a slanted cell boundary and handles ties', () => {
  assert.equal(nearestCode(vqInitialPoint).index, 7)
  codebook.forEach((point, i) => {
    const result = nearestCode(point)
    assert.equal(result.index, i)
    assert.equal(result.distanceSquared, 0)
  })
  const a = codebook[5]
  const b = codebook[7]
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  const offset = { x: (b.x - a.x) * 1e-6, y: (b.y - a.y) * 1e-6 }
  assert.equal(nearestCode({ x: midpoint.x - offset.x, y: midpoint.y - offset.y }).index, 5)
  assert.equal(nearestCode({ x: midpoint.x + offset.x, y: midpoint.y + offset.y }).index, 7)
  const tieCodes = [{ x: -1, y: -1 }, { x: 1, y: 1 }]
  assert.equal(nearestCode({ x: 0, y: 0 }, tieCodes).index, 0)
  assert.throws(() => nearestCode({ x: 0, y: 0 }, []), RangeError)
})

function area(polygon) {
  return Math.abs(polygon.reduce((sum, p, i) => {
    const next = polygon[(i + 1) % polygon.length]
    return sum + p.x * next.y - next.x * p.y
  }, 0) / 2)
}

function checkCells(codes) {
  const cells = voronoiCells(codes)
  cells.forEach((cell, i) => {
    for (const vertex of cell) {
      assert.ok(vertex.x >= vqBounds.xmin - 1e-10 && vertex.x <= vqBounds.xmax + 1e-10)
      assert.ok(vertex.y >= vqBounds.ymin - 1e-10 && vertex.y <= vqBounds.ymax + 1e-10)
      const own = (vertex.x - codes[i].x) ** 2 + (vertex.y - codes[i].y) ** 2
      assert.ok(codes.every(code => own <= (vertex.x - code.x) ** 2 + (vertex.y - code.y) ** 2 + 1e-9))
    }
  })
  assert.ok(Math.abs(cells.reduce((sum, cell) => sum + area(cell), 0) - 12) < 1e-9)
}

test('Clipped Voronoi cells partition the plane with valid nearest-code ownership', () => {
  checkCells(codebook)
  const cells = voronoiCells()
  assert.ok(cells.some(cell => cell.length >= 5))
  assert.ok(cells.every(cell => cell.some((p, i) => {
    const next = cell[(i + 1) % cell.length]
    return Math.abs(p.x - next.x) > 1e-6 && Math.abs(p.y - next.y) > 1e-6
  })))
  const duplicate = [{ x: -.5, y: 0 }, { x: -.5, y: 0 }, { x: .5, y: 0 }]
  checkCells(duplicate)
  assert.deepEqual(voronoiCells(duplicate)[1], [])
  assert.equal(nearestCode({ x: -.5, y: 0 }, duplicate).index, 0)
})
