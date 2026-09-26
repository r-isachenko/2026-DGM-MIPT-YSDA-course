import { reactive } from 'vue'

// Preserve the selected prior when navigating away from the demo and back.
export const priorState = reactive<{ mode: 'gaussian' | 'matched' }>({ mode: 'gaussian' })
