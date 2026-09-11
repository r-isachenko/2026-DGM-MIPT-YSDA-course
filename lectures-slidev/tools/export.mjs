import { existsSync, mkdirSync, readFileSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { lecturePaths, root, runSlidev } from './course.mjs'
const lecture = lecturePaths(process.argv[2])
const map = JSON.parse(readFileSync(lecture.map, 'utf8'))
const browser = [process.env.SLIDEV_BROWSER_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Yandex.app/Contents/MacOS/Yandex'].filter(Boolean).find(existsSync)
const staging = resolve(root, 'output/pdf', lecture.name)
mkdirSync(staging, { recursive: true })
const outputs = []
for (const [name, steps] of [['handout', false], ['steps', true]]) {
  const temporary = resolve(staging, `${name}.pdf`)
  const args = ['export', lecture.entry, '--output', temporary, '--timeout', '120000']
  if (steps) args.push('--with-clicks')
  if (browser) args.push('--executable-path', browser)
  runSlidev(lecture, args)
  const pdf = await PDFDocument.load(readFileSync(temporary))
  const expected = steps ? map.reduce((n, slide) => n + slide.clicks + 1, 0) : map.length
  if (pdf.getPageCount() !== expected) throw new Error(`${name}: expected ${expected} pages, got ${pdf.getPageCount()}`)
  const target = resolve(lecture.dir, `Lecture${lecture.number}${steps ? '' : '-handout'}.pdf`)
  outputs.push([temporary, target])
}
// Publish only after both exports succeed and their page counts match the slide map.
for (const [temporary, target] of outputs) { copyFileSync(temporary, target); console.log(`Saved ${target}`) }
