import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

export const root = fileURLToPath(new URL('../', import.meta.url))

export function lecturePaths(value = '1') {
  if (!/^[1-9]\d?$/.test(String(value))) throw new Error('Expected a lecture number, e.g. npm run dev -- 1')
  const number = Number(value)
  const name = `lecture${number}`
  const dir = resolve(root, name)
  const entry = resolve(dir, 'slides.md')
  if (!existsSync(entry)) throw new Error(`${name}/slides.md does not exist; this lecture has not been migrated yet`)
  return { number, name, dir, entry, map: resolve(dir, 'slide-map.json'), port: 3030 + number }
}

export function runNode(args, cwd = root) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Command failed (${result.signal || result.status}): ${args.join(' ')}`)
}

export function runSlidev(lecture, args) {
  runNode([resolve(root, 'node_modules/@slidev/cli/bin/slidev.mjs'), ...args], lecture.dir)
}
