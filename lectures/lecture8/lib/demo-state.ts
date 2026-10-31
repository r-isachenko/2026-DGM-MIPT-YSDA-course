import { reactive } from 'vue'
export const densityState = reactive({ label: 1, gamma: 1 })
export const cfgState = reactive({ gamma: 1 })
export const predictionState = reactive({ output: 'noise' as 'clean' | 'noise' | 'mean', noise: .5 })
