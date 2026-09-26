import { reactive } from 'vue'
import { ganPresets } from './gan-demo.mjs'

// Preserve exploration when Slidev unmounts this slide during navigation.
export const ganState = reactive({ mean: ganPresets[0].mean })
