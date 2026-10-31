import { reactive } from 'vue'

export const ddimState = reactive({
  mode: 'forward' as 'forward' | 'sampling',
  known: 'unknown' as 'unknown' | 'minus' | 'plus',
  stage: 0,
})
