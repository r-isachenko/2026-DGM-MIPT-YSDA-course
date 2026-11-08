import { reactive } from 'vue'
export const solverState = reactive({ steps: 8, count: 1 })
export const patchState = reactive({ t: 0, mode: 'Expansion' })
export const wienerState = reactive({ time: 2.5 })
export const stationaryState = reactive({ mode: 'Both', step: 0 })
