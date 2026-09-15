import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { manifest } from '../lib/index.js'

const libDir = join(process.cwd(), 'src', 'lib')

// component dirs are the ones containing a .svelte file
const componentDirs = readdirSync(libDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => readdirSync(join(libDir, d.name)).some((f) => f.endsWith('.svelte')))
  .map((d) => d.name)
  .sort()

describe('manifest', () => {
  it('covers every component directory under src/lib', () => {
    expect(manifest.components.map((c) => c.path).sort()).toEqual(componentDirs)
  })

  it('documents every public sig-* class each component applies', () => {
    for (const c of manifest.components) {
      const dir = join(libDir, c.path)
      const source = readdirSync(dir)
        .filter((f) => f.endsWith('.svelte'))
        .map((f) => readFileSync(join(dir, f), 'utf8'))
        .join('\n')
      for (const cls of c.classes) {
        expect(source, `${c.name} should apply ${cls}`).toContain(cls)
      }
    }
  })

  it('has a documented token for every --sig-* var in the default theme', () => {
    const css = readFileSync(join(libDir, 'theme', 'sigil.css'), 'utf8')
    const declared = new Set([...css.matchAll(/--sig-[a-z0-9-]+/g)].map((m) => m[0]))
    const documented = new Set(manifest.tokens.map((t) => t.name))
    for (const name of declared) {
      expect(documented.has(name), `${name} missing from manifest.tokens`).toBe(true)
    }
  })
})
