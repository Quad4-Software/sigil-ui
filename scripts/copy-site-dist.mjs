// Copies built distribution artifacts into site/public so GitHub Pages serves
// them at stable paths: /sigil-ui/theme.css, /sigil-ui/base.css,
// /sigil-ui/components.min.css, /sigil-ui/manifest.json.
// Run after pnpm build: node scripts/copy-site-dist.mjs
import { copyFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const pub = join(root, 'site', 'public')

mkdirSync(pub, { recursive: true })

const files = [
  ['dist/theme/sigil.css', 'theme.css'],
  ['dist/theme/base.css', 'base.css'],
  ['dist/components.min.css', 'components.min.css'],
  ['dist/manifest.json', 'manifest.json']
]

for (const [src, name] of files) {
  copyFileSync(join(root, src), join(pub, name))
  console.log(`site/public/${name} <- ${src}`)
}
