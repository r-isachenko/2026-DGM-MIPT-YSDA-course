import { reactive } from 'vue'
import { elboPresets } from './variational.mjs'

// Keep manual exploration when a slide is unmounted and revisited.
export const elboState = reactive({ mean: elboPresets[0].mean, sigma: elboPresets[0].sigma })
