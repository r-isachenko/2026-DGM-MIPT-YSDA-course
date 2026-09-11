import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { lecturePaths, root } from './course.mjs'
const paths = lecturePaths(process.argv[2])
const lecture = paths.number
const md = readFileSync(paths.entry, 'utf8')
const tex = readFileSync(resolve(root, `../lectures/lecture${lecture}/Lecture${lecture}.tex`), 'utf8')
const map = JSON.parse(readFileSync(paths.map, 'utf8'))
const fail = message => { throw new Error(message) }
const frames = [...tex.matchAll(/\\begin\{frame\}/g)]
const sections = [...tex.matchAll(/\\(?:sub)?section\{([^}]+)\}/g)].map(m=>m[1])
const ids = [...md.matchAll(/^sourceFrame: "(.+)"$/gm)].map(m=>m[1])
const counts = [...md.matchAll(/^clicks: (\d+)$/gm)].map(m=>+m[1])
if (map.length !== ids.length || counts.length !== ids.length) fail('Map/frontmatter length mismatch')
const merged = [...md.matchAll(/^mergedSourceFrames: \[([\d, ]+)\]$/gm)].flatMap(m => m[1].split(',').map(n => Number(n.trim())))
const mappedMerged = map.flatMap(s => s.mergedFrames || [])
if (JSON.stringify(merged) !== JSON.stringify(mappedMerged)) fail('Stale merged-frame map')
for (const frame of merged) if (frame < 1 || frame > frames.length) fail(`Unknown merged frame ${frame}`)
for (let i=1;i<=frames.length;i++) if (ids.filter(x=>x===String(i)).length + merged.filter(x=>x===i).length !== 1) fail(`Frame ${i} missing or duplicated`)
for (const id of ids) {
  if (/^\d+$/.test(id) && (+id < 1 || +id > frames.length)) fail(`Unknown source frame ${id}`)
  if (id.startsWith('extension: ')) {
    const source = id.slice('extension: '.length)
    if (!/^\d+$/.test(source) || !ids.includes(source)) fail(`Extension without source frame: ${id}`)
  } else if (!/^\d+$/.test(id) && !id.startsWith('auto: ')) fail(`Unknown frame ID: ${id}`)
}
map.forEach((s,i)=> { if (String(s.frame)!==ids[i] || s.clicks!==counts[i] || s.slide!==i+1) fail(`Stale map at slide ${i+1}`) })
const readme=readFileSync(resolve(root, '../README.md'),'utf8').split('\n').find(l=>l.includes(`<b>Lecture ${lecture}:</b>`))
for (const section of sections) {
  if (!md.includes(section)) fail(`Missing section ${section}`)
  if (!readme?.includes(`<li>${section}`)) fail(`README section mismatch ${section}`)
}
const urls = [...tex.matchAll(/\\myfootnotewithlink\{([^}]+)\}/g)].map(m=>m[1].replaceAll('\\_', '_'))
for (const url of urls) if (!md.includes(`href="${url}"`)) fail(`Missing source ${url}`)
const assets = [...md.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)]
const provenancePath = resolve(paths.dir, 'public/figs/sources.json')
const provenance = existsSync(provenancePath) ? JSON.parse(readFileSync(provenancePath, 'utf8')) : {}
for (const [tag] of md.matchAll(/<TaxonomyDiagram\b[^>]*\/>/g))
  assets.push([tag, `../theme/assets/${/\bautoregressive\b/.test(tag) ? 'taxonomy-ar.svg' : 'taxonomy.svg'}`])
for (const [,src] of assets) {
  const local = src.startsWith('/figs/')
  if (!local && !src.startsWith('../theme/assets/')) fail(`Unexpected image location: ${src}`)
  const target = local ? resolve(paths.dir, 'public', src.slice(1)) : resolve(paths.dir, src)
  if (!existsSync(target)) fail(`Missing asset ${src}`)
  if (local) {
    const file = src.slice('/figs/'.length)
    const original=resolve(root,`../lectures/lecture${lecture}/figs`,file)
    const hash=f=>createHash('sha256').update(readFileSync(f)).digest('hex')
    if (existsSync(original)) {
      if(hash(target)!==hash(original)) fail(`Image differs from original: ${file}`)
    } else {
      const credit = provenance[file]
      if (!credit?.source?.startsWith('https://') || !credit.description) fail(`Missing provenance for new image: ${file}`)
      if (hash(target) !== credit.sha256) fail(`New image differs from recorded source: ${file}`)
      if (!md.includes(`href="${credit.source}"`)) fail(`Missing source citation for new image: ${file}`)
    }
  }
}
if (/\\(?:mathbf|boldsymbol|mathcal|mathbb)\b/.test(md)) fail('Raw notation in lecture; use the shared adapter')
if (/<img[^>]+src="https?:/.test(md)) fail('Remote image dependency')
execFileSync(process.execPath, [resolve(root,'tools/sync-notation.mjs'),'--check'],{stdio:'inherit'})
console.log(`${paths.name}: ${frames.length} source frames, ${sections.length} section transitions, ${map.length} slides, ${counts.reduce((a,b)=>a+b+1,0)} states; ${urls.length} citations and ${assets.length} image uses checked.`)
