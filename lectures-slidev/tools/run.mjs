import { resolve } from 'node:path'
import { lecturePaths, root, runNode, runSlidev } from './course.mjs'

const [action, number = '1', ...extra] = process.argv.slice(2)
if (extra.length) throw new Error('Expected one lecture number')
const lecture = lecturePaths(number)
const tool = name => resolve(root, 'tools', name)
function check() { runNode([tool('check-source.mjs'), number]) }
function build() { runSlidev(lecture, ['build', lecture.entry, '--base', './', '--out', resolve(root, 'dist', lecture.name)]) }
function exportPdf() { runNode([tool('export.mjs'), number]) }

switch (action) {
  case 'dev': runSlidev(lecture, [lecture.entry, '--port', String(lecture.port)]); break
  case 'check': check(); break
  case 'build': build(); break
  case 'export': exportPdf(); break
  case 'finalize':
    check()
    runNode(['--test', tool('test-demos.mjs'), tool('test-flow-demos.mjs'), tool('test-course.mjs')])
    build()
    exportPdf()
    console.log(`Built ${lecture.name} and both PDFs. Render and visually review them before committing.`)
    break
  default: throw new Error('Expected dev, check, build, export, or finalize')
}
