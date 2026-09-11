import assert from 'node:assert/strict'
import { test } from 'node:test'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { lecturePaths, root } from './course.mjs'

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
