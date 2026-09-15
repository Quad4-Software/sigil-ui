// Writes dist/manifest.json from the packaged manifest module so agents and
// tooling can consume component metadata without parsing TypeScript.
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const { manifest } = await import(join(root, 'dist', 'manifest.js'))
writeFileSync(join(root, 'dist', 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log('dist/manifest.json written')
