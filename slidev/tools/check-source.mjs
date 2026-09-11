import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
const root = fileURLToPath(new URL('../', import.meta.url))
const entry = process.argv[2] || 'lecture01'
if (!/^lecture\d{2}$/.test(entry)) throw new Error('Expected lectureNN')
const lecture = +entry.slice(7)
const md = readFileSync(resolve(root, `${entry}.md`), 'utf8')
const tex = readFileSync(resolve(root, `../lectures/lecture${lecture}/Lecture${lecture}.tex`), 'utf8')
const map = JSON.parse(readFileSync(resolve(root, `${entry}-map.json`), 'utf8'))
const fail = message => { throw new Error(message) }
const frames = [...tex.matchAll(/\\begin\{frame\}/g)]
const sections = [...tex.matchAll(/\\(?:sub)?section\{([^}]+)\}/g)].map(m=>m[1])
const ids = [...md.matchAll(/^sourceFrame: "(.+)"$/gm)].map(m=>m[1])
const counts = [...md.matchAll(/^clicks: (\d+)$/gm)].map(m=>+m[1])
if (map.length !== ids.length || counts.length !== ids.length) fail('Map/frontmatter length mismatch')
for (let i=1;i<=frames.length;i++) if (ids.filter(x=>x===String(i)).length!==1) fail(`Frame ${i} missing or duplicated`)
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
const assets = [...md.matchAll(/src="\/(lecture\d+|shared)\/([^"]+)"/g)]
for (const [,folder,file] of assets) {
  const target=resolve(root,'public',folder,file)
  if (!existsSync(target)) fail(`Missing asset ${folder}/${file}`)
  if(folder!=='shared') {
    if(folder!==entry) fail(`Cross-lecture asset ${folder}/${file}`)
    const original=resolve(root,`../lectures/lecture${lecture}/figs`,file)
    const hash=f=>createHash('sha256').update(readFileSync(f)).digest('hex')
    if(hash(target)!==hash(original)) fail(`Image differs from original: ${file}`)
  }
}
if (/\\(?:mathbf|boldsymbol|mathcal|mathbb)\b/.test(md)) fail('Raw notation in lecture; use the shared adapter')
if (/<img[^>]+src="https?:/.test(md)) fail('Remote image dependency')
execFileSync(process.execPath, [resolve(root,'tools/sync-notation.mjs'),'--check'],{stdio:'inherit'})
console.log(`${entry}: ${frames.length} source frames, ${sections.length} section transitions, ${map.length} slides, ${counts.reduce((a,b)=>a+b+1,0)} states; ${urls.length} citations and ${assets.length} image uses checked.`)
