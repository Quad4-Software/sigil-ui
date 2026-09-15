// Copies the built artifacts into cdn/ so tagged releases are directly
// servable from jsdelivr and statically in GitHub mode. Run after
// pnpm build: node scripts/gen-cdn.mjs
import { cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, 'dist')
const out = join(root, 'cdn')
const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version

mkdirSync(out, { recursive: true })

const theme = readFileSync(join(dist, 'theme', 'sigil.css'), 'utf8')
const base = readFileSync(join(dist, 'theme', 'base.css'), 'utf8')
const components = readFileSync(join(dist, 'components.min.css'), 'utf8')

writeFileSync(join(out, 'theme.css'), theme)
writeFileSync(join(out, 'base.css'), base)
writeFileSync(join(out, 'components.min.css'), components)

const header = `/* sigil-ui ${version}: theme + base + components in one file */\n`
writeFileSync(join(out, 'sigil.min.css'), header + theme + '\n' + base + '\n' + components)

cpSync(join(dist, 'headless'), join(out, 'headless'), { recursive: true })
// headless modules reach into dist/utils for focus trapping and friends
mkdirSync(join(out, 'utils'), { recursive: true })
cpSync(join(dist, 'utils', 'focus.js'), join(out, 'utils', 'focus.js'))
cpSync(join(dist, 'utils', 'focus.d.ts'), join(out, 'utils', 'focus.d.ts'))

const files = ['theme.css', 'base.css', 'components.min.css', 'sigil.min.css']
for (const f of files) {
  console.log(`cdn/${f}: ${(readFileSync(join(out, f)).length / 1024).toFixed(1)} kB`)
}
console.log(
  `cdn/headless: ${readdirSync(join(out, 'headless')).filter((f) => f.endsWith('.js')).length} modules copied`
)
