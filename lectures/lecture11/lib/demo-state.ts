import { defaultPair } from './path-comparison.mjs'
import { reactive } from 'vue'
export const posteriorState = reactive({ x: 0, y: 0 })
export const endpointState = reactive({ t: .5 })

export const flowPathsState = reactive({ t: .5, pair: defaultPair })
export const transportState = reactive({ t: .5 })
