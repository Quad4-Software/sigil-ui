import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'
import { build, compile, defineConfig, extractCalls } from '../../css/engine.mjs'

const config = {
  include: ['./src/**/*.ts'],
  preflight: false,
  tokens: {
    colors: { sig: { accent: '#4f46e5' }, plain: 'red' },
    spacing: { '4': '1rem' },
    sizes: { full: '100%' },
    radii: { md: '0.375rem' }
  }
}

describe('extractCalls', () => {
  it('extracts literal object arguments for known functions', () => {
    const src = `
      const a = css({ p: '4', color: 'sig.accent' })
      const b = stack({ gap: '2' })
      const c = other({ ignored: true })
    `
    const found = extractCalls(src)
    expect(found).toHaveLength(2)
    expect(found[0]).toEqual({ p: '4', color: 'sig.accent' })
    expect(found[1]).toEqual({ gap: '2' })
  })

  it('handles strings, comments and nested objects inside the call', () => {
    const src = "css({ content: '}{', /* }{ */ _hover: { color: 'red' } })"
    const found = extractCalls(src)
    expect(found).toHaveLength(1)
    expect(found[0]).toEqual({ content: '}{', _hover: { color: 'red' } })
  })

  it('skips calls whose arguments reference runtime values', () => {
    const src = 'css({ color: someVar })'
    expect(extractCalls(src)).toHaveLength(0)
  })
})

describe('compile', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  const write = (name: string, body: string) => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    writeFileSync(join(cwd, 'src', name), body)
  }

  it('emits atomic rules with resolved tokens', async () => {
    write('a.ts', "css({ p: '4', bg: 'sig.accent', w: 'full' })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toMatch(/\.s\w+\{padding:1rem\}/)
    expect(css).toMatch(/\.s\w+\{background:#4f46e5\}/)
    expect(css).toMatch(/\.s\w+\{width:100%\}/)
  })

  it('emits pseudo and breakpoint variants', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('b.ts', "css({ color: 'plain', _hover: { color: 'sig.accent' }, md: { p: '4' } })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toMatch(/\.s\w+:hover\{color/)
    expect(css).toContain(':hover{color:#4f46e5}')
    expect(css).toMatch(/@media \(min-width: 768px\)\{\.s\w+\{padding:1rem\}\}/)
  })

  it('supports responsive value objects', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('c.ts', "css({ fontSize: { base: '1rem', md: '2rem' } })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toMatch(/\.s\w+\{font-size:1rem\}/)
    expect(css).toContain('@media (min-width: 768px)')
    expect(css).toContain('font-size:2rem')
  })

  it('dedupes identical declarations', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('d.ts', "css({ p: '4' })\ncss({ p: '4' })")
    const { css, count } = compile(defineConfig(config), cwd)
    expect(count).toBe(1)
    expect(css.match(/padding:1rem/g)).toHaveLength(1)
  })
})

describe('build', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-build-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  it('generates a runtime whose class names match the emitted css', async () => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    const style = "{ p: '4', color: 'sig.accent', md: { m: '2' }, _hover: { p: '8' } }"
    writeFileSync(join(cwd, 'src', 'x.ts'), `css(${style})`)
    build(defineConfig({ ...config }), cwd)

    const cssText = readFileSync(join(cwd, 'styled-system', 'styles.css'), 'utf8')
    const mod = await import(pathToFileURL(join(cwd, 'styled-system/css/index.mjs')).href)
    const classes = mod.css(eval(`(${style})`)).split(' ')

    expect(classes.length).toBe(4)
    for (const cls of classes) {
      expect(cssText).toContain('.' + cls)
    }
  })

  it('writes typed outputs', async () => {
    const dts = readFileSync(join(cwd, 'styled-system/css/index.d.ts'), 'utf8')
    expect(dts).toContain("'sig.accent'")
    expect(dts).toContain('StyleObject')
    const pats = readFileSync(join(cwd, 'styled-system/patterns/index.mjs'), 'utf8')
    expect(pats).toContain('export const stack')
  })
})
