import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const siteSrc = resolve(process.cwd(), 'site/src')
const svelteFiles = readdirSync(siteSrc)
  .filter((f) => f.endsWith('.svelte'))
  .map((f) => [f, readFileSync(resolve(siteSrc, f), 'utf8')] as const)

describe('site source guards', () => {
  it('does not pass raw numbers to Panda lineHeight', () => {
    // Panda silently falls back to a literal multiplier for unknown values,
    // which produced line-height: 7 and broke the page. Token props must use
    // named tokens like relaxed or tight.
    for (const [file, src] of svelteFiles) {
      expect(src, file).not.toMatch(/lineHeight:\s*['"][\d.]+['"]/)
    }
  })

  it('does not import the uno virtual module', () => {
    for (const [file, src] of svelteFiles) {
      expect(src, file).not.toMatch(/virtual:uno\.css/)
    }
  })

  it('keeps app.css inside cascade layers so panda utilities win', () => {
    // Unlayered styles beat @layer rules regardless of specificity. A global
    // margin reset here silently disabled mx: auto centering before.
    const css = readFileSync(resolve(siteSrc, 'app.css'), 'utf8')
    expect(css).not.toMatch(/^\s*\*[^/]*\{[^}]*margin/m)
  })
})
