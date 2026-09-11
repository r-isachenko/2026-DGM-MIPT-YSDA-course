import { existsSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const entry = process.argv[2] ?? 'lecture01'
if (!/^lecture\d{2}$/.test(entry) || !existsSync(resolve(root, `${entry}.md`))) throw new Error('Expected an existing lectureNN entry')
const browser = [process.env.SLIDEV_BROWSER_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Yandex.app/Contents/MacOS/Yandex'].filter(Boolean).find(existsSync)
mkdirSync(resolve(root, 'output/pdf'), { recursive: true })
for (const [name, steps] of [['handout', false], ['steps', true]]) {
  const args = [resolve(root, 'node_modules/@slidev/cli/bin/slidev.mjs'), 'export', `${entry}.md`, '--output', resolve(root, `output/pdf/${entry}-${name}.pdf`), '--timeout', '120000']
  if (steps) args.push('--with-clicks')
  if (browser) args.push('--executable-path', browser)
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
