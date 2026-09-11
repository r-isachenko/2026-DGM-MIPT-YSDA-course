import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const source = new URL('../../lectures/utils/newcommands.tex', import.meta.url)
const target = new URL('../theme/setup/macros.json', import.meta.url)
const tex = readFileSync(source, 'utf8')
const macros = {}
// Read balanced bodies, including nested braces. Only zero-argument course macros.
const command = /\\newcommand\{(\\\w+)\}\{/g
for (const match of tex.matchAll(command)) {
  let end = match.index + match[0].length, depth = 1, start = end
  while (depth && end < tex.length) {
    if (tex[end] === '{') depth++
    if (tex[end] === '}') depth--
    end++
  }
  if (depth) throw new Error(`Unclosed macro ${match[1]}`)
  macros[match[1]] = tex.slice(start, end - 1).replaceAll('\\xspace', '')
}
for (const match of tex.matchAll(/\\DeclareMathOperator(\*)?\{(\\\w+)\}\{([^}]+)\}/g))
  macros[match[2]] = `\\operatorname${match[1] || ''}{${match[3]}}`
const result = JSON.stringify(macros, null, 2) + '\n'
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== result) throw new Error('Notation adapter is stale. Run node tools/sync-notation.mjs')
} else writeFileSync(target, result)
console.log(`Checked ${Object.keys(macros).length} shared macros from ${fileURLToPath(source)}`)
