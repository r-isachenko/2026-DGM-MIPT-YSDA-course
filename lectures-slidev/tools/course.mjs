import { existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

export const root = fileURLToPath(new URL('../', import.meta.url))

export function sourceFrames(tex) {
  return [...tex.matchAll(/\\begin\{frame\}[\s\S]*?\\end\{frame\}/g)].map(m => m[0])
}

export function retainedSourceFrames(tex, omitted = []) {
  const frames = sourceFrames(tex)
  if (!Array.isArray(omitted) || new Set(omitted).size !== omitted.length
      || omitted.some(n => !Number.isInteger(n) || n < 1 || n > frames.length))
    throw new Error('Invalid omittedSourceFrames: expected unique source frame numbers')
  return frames.filter((_, i) => !omitted.includes(i + 1)).join('\n')
}

export function resolveImportedSourceFrames(declared, ids, lecture, readLecture = number =>
  readFileSync(resolve(root, `../lectures/lecture${number}/Lecture${number}.tex`), 'utf8')) {
  if (!declared || Array.isArray(declared) || typeof declared !== 'object')
    throw new Error('Invalid importedSourceFrames: expected an object')
  const imported = []
  for (const [number, selected] of Object.entries(declared)) {
    if (!/^[1-9]\d?$/.test(number) || Number(number) === Number(lecture))
      throw new Error(`Invalid imported source lecture: ${number}`)
    if (!Array.isArray(selected) || !selected.length || new Set(selected).size !== selected.length
        || selected.some(frame => !Number.isInteger(frame) || frame < 1))
      throw new Error(`Invalid importedSourceFrames for lecture ${number}`)
    let tex
    try { tex = readLecture(Number(number)) }
    catch { throw new Error(`Missing imported source lecture ${number}`) }
    const frames = sourceFrames(tex)
    for (const frame of selected) {
      if (frame > frames.length) throw new Error(`Unknown imported source frame ${number}:${frame}`)
      const id = `imported: ${number}:${frame}`
      if (ids.filter(value => value === id).length !== 1)
        throw new Error(`Imported frame missing or duplicated: ${id}`)
      imported.push({ lecture: Number(number), frame, id, tex: frames[frame - 1] })
    }
  }
  for (const id of ids.filter(value => value.startsWith('imported:')))
    if (!imported.some(frame => frame.id === id)) throw new Error(`Undeclared imported frame: ${id}`)
  return imported
}

export function retainedSourceSections(sections, omitted = []) {
  if (!Array.isArray(omitted) || new Set(omitted).size !== omitted.length
      || omitted.some(title => typeof title !== 'string' || !sections.includes(title)))
    throw new Error('Invalid omittedSourceSections: expected unique known section titles')
  return sections.filter(title => !omitted.includes(title))
}

export function checkSectionSchedule(sections, ids, md, readme) {
  const outlines = ids.filter(id => id.startsWith('auto: ')).map(id => id.slice('auto: '.length))
  for (const section of new Set([...sections, ...outlines])) {
    if (!section.trim() || !md.includes(section)) throw new Error(`Missing section ${section}`)
    if (!readme?.includes(`<li>${section}`)) throw new Error(`README section mismatch ${section}`)
  }
}

export function checkSourceCitations(retainedTex, imported, md) {
  const tex = [retainedTex, ...imported.map(frame => frame.tex)].join('\n')
  const urls = [...tex.matchAll(/\\myfootnotewithlink\{([^}]+)\}/g)].map(m => m[1].replaceAll('\\_', '_'))
  for (const url of urls)
    if (!md.includes(`href="${url}"`)) throw new Error(`Missing source ${url}`)
  return urls
}

export function matchesOriginalAsset(target, file, lecture, imported, sourceRoot = resolve(root, '../lectures')) {
  const original = number => resolve(sourceRoot, `lecture${number}/figs`, file)
  const local = original(lecture)
  const candidates = existsSync(local) ? [local]
    : [...new Set(imported.map(frame => frame.lecture))].map(original).filter(existsSync)
  if (!candidates.length) return false
  const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex')
  const actual = hash(target)
  if (!candidates.some(path => hash(path) === actual)) throw new Error(`Image differs from original: ${file}`)
  return true
}

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
