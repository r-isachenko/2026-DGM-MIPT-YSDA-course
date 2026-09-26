import { reactive } from 'vue'
import { vqInitialPoint } from './vq-demo.mjs'

// Retain exploration when navigating away from the slide and back.
export const vqState = reactive({ ...vqInitialPoint })
