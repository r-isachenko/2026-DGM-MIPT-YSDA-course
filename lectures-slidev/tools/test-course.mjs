import assert from 'node:assert/strict'
import { test } from 'node:test'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { lecturePaths, root, retainedSourceFrames, resolveImportedSourceFrames, retainedSourceSections, checkFrameExtensions, checkSectionSchedule, checkSourceCitations, matchesOriginalAsset } from './course.mjs'

test('approved omissions exclude only their own frame and citations', () => {
  const first = String.raw`\begin{frame}{First}\myfootnotewithlink{https://example.org/shared}{Shared}\end{frame}`
  const second = String.raw`\begin{frame}{Removed}\myfootnotewithlink{https://example.org/removed}{Removed}\end{frame}`
  const third = String.raw`\begin{frame}{Third}\myfootnotewithlink{https://example.org/shared}{Shared}\end{frame}`
  const tex = [first, second, third].join('\n')
  assert.equal(retainedSourceFrames(tex), tex)
  assert.equal(retainedSourceFrames(tex, [2]), [first, third].join('\n'))
  for (const omitted of [[0], [4], [1.5], ['2'], [2, 2], null, {}])
    assert.throws(() => retainedSourceFrames(tex, omitted), /Invalid omittedSourceFrames/)
})

test('imports account for each declared foreign frame exactly once', () => {
  const first = String.raw`\begin{frame}{First}\myfootnotewithlink{https://example.org/first}{First}\end{frame}`
  const second = String.raw`\begin{frame}{Second}\myfootnotewithlink{https://example.org/second}{Second}\end{frame}`
  const readLecture = number => {
    assert.equal(number, 4)
    return `${first}\n${second}`
  }
  const imported = resolveImportedSourceFrames({ 4: [2] }, ['1', 'imported: 4:2'], 3, readLecture)
  assert.deepEqual(imported, [{ lecture: 4, frame: 2, id: 'imported: 4:2', tex: second }])
  assert.deepEqual(resolveImportedSourceFrames({}, ['1'], 3, readLecture), [])
  for (const declared of [null, [], '4', { 3: [1] }, { '../4': [1] }, { '04': [1] }, { 4: [] }, { 4: [0] }, { 4: [1.5] }, { 4: ['2'] }, { 4: [2, 2] }, { 4: [3] }])
    assert.throws(() => resolveImportedSourceFrames(declared, ['imported: 4:2'], 3, readLecture), /Invalid imported|Unknown imported/)
  for (const ids of [[], ['imported: 4:2', 'imported: 4:2']])
    assert.throws(() => resolveImportedSourceFrames({ 4: [2] }, ids, 3, readLecture), /missing or duplicated/)
  for (const id of ['imported: 4:1', 'imported:4:2', 'imported: 4:02'])
    assert.throws(() => resolveImportedSourceFrames({}, [id], 3, readLecture), /Undeclared imported/)
  assert.throws(() => resolveImportedSourceFrames({ 4: [1] }, ['imported: 4:1'], 3, () => { throw new Error('ENOENT') }), /Missing imported source lecture/)
})

test('split imported frames retain their declared origin and need a base slide', () => {
  const imported = [{ id: 'imported: 7:10' }]
  assert.doesNotThrow(() => checkFrameExtensions(['10', 'extension: 10']))
  assert.doesNotThrow(() => checkFrameExtensions(['imported: 7:10', 'extension: imported: 7:10'], imported))
  for (const ids of [
    ['extension: imported: 7:10'],
    ['imported: 7:10', 'extension: imported: 7:11'],
    ['imported: 7:10', 'extension: extension: imported: 7:10'],
    ['auto: Section', 'extension: auto: Section'],
    ['extension: 10'],
  ]) assert.throws(() => checkFrameExtensions(ids, imported), /Extension without source frame/)
  assert.throws(() => checkFrameExtensions(['imported: 7:10', 'extension: imported: 7:10']), /Extension without source frame/)
})

test('imported citations are mandatory and unselected foreign frames stay excluded', () => {
  const local = String.raw`\begin{frame}\myfootnotewithlink{https://example.org/local}{Local}\end{frame}`
  const foreign = String.raw`\begin{frame}\myfootnotewithlink{http://example.org/imported}{Imported}\end{frame}
\begin{frame}\myfootnotewithlink{https://example.org/not-imported}{Other}\end{frame}`
  const imported = resolveImportedSourceFrames({ 4: [1] }, ['imported: 4:1'], 3, () => foreign)
  const md = '<a href="https://example.org/local">Local</a><a href="http://example.org/imported">Imported</a>'
  assert.deepEqual(checkSourceCitations(local, imported, md), ['https://example.org/local', 'http://example.org/imported'])
  assert.throws(() => checkSourceCitations(local, imported, '<a href="https://example.org/local">Local</a>'), /Missing source http:\/\/example.org\/imported/)
  assert.throws(() => checkSourceCitations(local, imported, '<a href="http://example.org/imported">Imported</a>'), /Missing source https:\/\/example.org\/local/)
})

test('section omissions are explicit and actual imported outlines require a README entry', () => {
  const sections = ['VAE', 'ELBO Surgery']
  assert.deepEqual(retainedSourceSections(sections, ['VAE']), ['ELBO Surgery'])
  for (const omitted of [null, {}, ['Unknown'], ['VAE', 'VAE'], [1]])
    assert.throws(() => retainedSourceSections(sections, omitted), /Invalid omittedSourceSections/)
  assert.doesNotThrow(() => checkSectionSchedule(['ELBO Surgery'], ['auto: ELBO Surgery'], 'ELBO Surgery', '<li>ELBO Surgery</li>'))
  assert.throws(() => checkSectionSchedule(['ELBO Surgery'], ['auto: ELBO Surgery'], '', '<li>ELBO Surgery</li>'), /Missing section/)
  assert.throws(() => checkSectionSchedule(['ELBO Surgery'], ['auto: ELBO Surgery', 'auto: VAE'], 'ELBO Surgery VAE', '<li>ELBO Surgery</li>'), /README section mismatch VAE/)
  assert.doesNotThrow(() => checkSectionSchedule(['ELBO Surgery'], ['auto: VAE'], 'ELBO Surgery VAE', '<li>ELBO Surgery</li><li>VAE</li>'))
})

test('imported assets need a matching declared lecture original and cannot override a local original', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dgm-import-assets-'))
  try {
    for (const number of [3, 4, 5]) mkdirSync(join(dir, `lecture${number}/figs`), { recursive: true })
    const target = join(dir, 'copied.png')
    writeFileSync(target, 'foreign image bytes')
    writeFileSync(join(dir, 'lecture4/figs/image.png'), 'foreign image bytes')
    const imported = [{ lecture: 4, frame: 1 }]
    assert.equal(matchesOriginalAsset(target, 'image.png', 3, imported, dir), true)
    assert.equal(matchesOriginalAsset(target, 'image.png', 3, [], dir), false)
    assert.equal(matchesOriginalAsset(target, 'image.png', 3, [{ lecture: 5, frame: 1 }], dir), false)
    writeFileSync(target, 'changed image bytes')
    assert.throws(() => matchesOriginalAsset(target, 'image.png', 3, imported, dir), /Image differs from original/)
    writeFileSync(target, 'foreign image bytes')
    writeFileSync(join(dir, 'lecture3/figs/image.png'), 'local image bytes')
    assert.throws(() => matchesOriginalAsset(target, 'image.png', 3, imported, dir), /Image differs from original/)
    writeFileSync(target, 'local image bytes')
    assert.equal(matchesOriginalAsset(target, 'image.png', 3, imported, dir), true)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('lecture paths are independent of the shell working directory', () => {
  const previous = process.cwd()
  try {
    process.chdir(tmpdir())
    const lecture = lecturePaths('1')
    assert.equal(lecture.entry, join(root, 'lecture1/slides.md'))
    assert.equal(lecture.map, join(root, 'lecture1/slide-map.json'))
    assert.equal(lecture.port, 3031)
  } finally { process.chdir(previous) }
})

test('invalid or unmigrated lecture numbers fail before running Slidev', () => {
  for (const value of ['../lecture1', '0', '-1', '1.5', '01', '100'])
    assert.throws(() => lecturePaths(value), /Expected a lecture number/)
  const result = spawnSync(process.execPath, [join(root, 'tools/run.mjs'), 'export', '99'], { cwd: tmpdir(), encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /has not been migrated yet/)
})
