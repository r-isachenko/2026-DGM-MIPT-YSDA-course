import { defaultPair } from './path-comparison.mjs'
import { reactive } from 'vue'
export const posteriorState = reactive({ x: 0, y: 0 })
export const endpointState = reactive({ t: .5 })

export const flowPathsState = reactive({ t: .5, pair: defaultPair })
export const transportState = reactive({ t: .5 })
export const denoiserState = reactive({ x: [0, 2.4], sigma: 2.5, ratio: .5, history: [[0, 2.4]], n: 0 })
