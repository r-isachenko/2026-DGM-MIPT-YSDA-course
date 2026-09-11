import { defineKatexSetup } from '@slidev/types'
import macros from './macros.json'

export default defineKatexSetup(() => ({ macros, strict: 'error', throwOnError: true }))
