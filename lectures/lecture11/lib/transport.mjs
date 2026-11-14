import { normal, rng } from '../../lecture10/lib/random.mjs'

export function transport([x, y], t, mode = 'Direct') {
  const angle = mode === 'Rotation' ? 1.3 * Math.sin(Math.PI * t) : 0
  const centerX = -2 + 4 * t
  const centerY = mode === 'Detour' ? 1.6 * Math.sin(Math.PI * t) : 0
  const cos = Math.cos(angle), sin = Math.sin(angle)
  return [
    centerX + (1 - .45 * t) * (cos * x - sin * y),
    centerY + (1 - .2 * t) * (sin * x + cos * y),
  ]
}

const random = rng(77)
export const transportPoints = Array.from({ length: 96 }, () => [normal(random), normal(random)])
