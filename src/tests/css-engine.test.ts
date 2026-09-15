import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'
import {
  build,
  checkBuild,
  compile,
  defineConfig,
  detectComponents,
  explain,
  extractCalls,
  minifyCss,
  resolveComponentCss,
  sourceFiles
} from '../../css/engine.mjs'

const config = {
  include: ['./src/**/*.ts'],
  preflight: false,
  tokens: {
    colors: { sig: { accent: '#4f46e5' }, plain: 'red' },
    spacing: { '4': '1rem', '8': '2rem' },
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

  it('emits per-longhand atomic rules backed by token variables', () => {
    write('a.ts', "css({ p: '4', bg: 'sig.accent', w: 'full' })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toContain(':root{')
    expect(css).toContain('--s-spacing-4:1rem')
    expect(css).toContain('--s-colors-sig-accent:#4f46e5')
    expect(css).toMatch(/\.s\w+\{padding-top:var\(--s-spacing-4\)\}/)
    expect(css).toMatch(/\.s\w+\{padding-left:var\(--s-spacing-4\)\}/)
    expect(css).toMatch(/\.s\w+\{background:var\(--s-colors-sig-accent\)\}/)
    expect(css).toMatch(/\.s\w+\{width:var\(--s-sizes-full\)\}/)
  })

  it('resolves literal values when cssVariables is off', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('b0.ts', "css({ p: '4', bg: 'sig.accent' })")
    const { css } = compile(defineConfig({ ...config, cssVariables: false }), cwd)
    expect(css).not.toContain(':root')
    expect(css).toMatch(/\.s\w+\{padding-top:1rem\}/)
    expect(css).toMatch(/\.s\w+\{background:#4f46e5\}/)
  })

  it('emits pseudo and breakpoint variants', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('b.ts', "css({ color: 'plain', _hover: { color: 'sig.accent' }, md: { p: '4' } })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toMatch(/\.s\w+:hover\{color/)
    expect(css).toContain(':hover{color:var(--s-colors-sig-accent)}')
    expect(css).toMatch(/@media \(min-width: 768px\)\{\.s\w+\{padding-top:var\(--s-spacing-4\)\}\}/)
  })

  it('supports responsive value objects', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('c.ts', "css({ fontSize: { base: '1rem', md: '2rem' } })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toMatch(/\.s\w+\{font-size:1rem\}/)
    expect(css).toContain('@media (min-width: 768px)')
    expect(css).toContain('font-size:2rem')
  })

  it('does not hijack raw values that match a token name in another category', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('raw.ts', "css({ display: 'none', content: 'sm', order: '4' })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toContain('display:none')
    expect(css).toContain('content:sm')
    expect(css).toContain('order:4')
    expect(css).not.toContain('display:var(')
  })

  it('dedupes identical declarations across files and aliases', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('d.ts', "css({ p: '4' })\ncss({ paddingTop: '4' })\ncss({ pt: '4' })")
    const { css, count } = compile(defineConfig(config), cwd)
    // p expands to four longhands; pt and paddingTop reuse the same atom
    expect(count).toBe(4)
    expect(css.match(/padding-top:var\(--s-spacing-4\)/g)).toHaveLength(1)
  })

  it('supports important, negatives, opacity modifiers and arbitrary values', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('e.ts', "css({ pt: '4!', mt: '-4', color: 'sig.accent/50', w: '[calc(100%-8px)]' })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toContain('padding-top:var(--s-spacing-4) !important')
    expect(css).toContain('margin-top:calc(var(--s-spacing-4) * -1)')
    expect(css).toContain('color:color-mix(in srgb, var(--s-colors-sig-accent) 50%, transparent)')
    expect(css).toContain('width:calc(100%-8px)')
  })

  it('expands peer, group, container, arbitrary and custom conditions', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write(
      'f.ts',
      `css({
        _peerChecked: { color: 'red' },
        _groupOpen: { display: 'block' },
        _cqCard: { p: '8' },
        '&:has(> img)': { rounded: 'md' },
        '@supports (display: grid)': { display: 'grid' },
        _banner: { color: 'blue' }
      })`
    )
    const { css } = compile(
      defineConfig({
        ...config,
        containers: { card: '30rem' },
        conditions: { _banner: '&[role="banner"]' }
      }),
      cwd
    )
    expect(css).toContain('.peer:checked ~')
    expect(css).toContain('.group[data-state="open"]')
    expect(css).toContain('@container (min-width: 30rem)')
    expect(css).toContain(':has(> img)')
    expect(css).toContain('@supports (display: grid)')
    expect(css).toContain('[role="banner"]{color:blue}')
  })

  it('emits spaceX and spaceY against subsequent siblings', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('g.ts', "css({ spaceX: '4', spaceY: '8' })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toContain(' > :not([hidden]) ~ :not([hidden]){margin-inline-start:')
    expect(css).toContain(' > :not([hidden]) ~ :not([hidden]){margin-block-start:')
  })

  it('expands textStyles and emits conditional token overrides', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('h.ts', "css({ textStyle: 'h1', color: 'brand' })")
    const { css } = compile(
      defineConfig({
        ...config,
        textStyles: { h1: { fontSize: '2xl', fontWeight: 'bold' } },
        tokens: {
          ...config.tokens,
          fontSizes: { '2xl': '1.5rem' },
          fontWeights: { bold: '700' },
          colors: {
            ...config.tokens.colors,
            brand: { value: { base: '#111', _dark: '#eee' } }
          }
        }
      }),
      cwd
    )
    expect(css).toContain('font-size:var(--s-fontSizes-2xl)')
    expect(css).toContain('font-weight:var(--s-fontWeights-bold)')
    expect(css).toContain('color:var(--s-colors-brand)')
    expect(css).toContain('--s-colors-brand:#111')
    expect(css).toContain('[data-theme="dark"]{--s-colors-brand:#eee}')
  })

  it('warns on unknown conditions instead of emitting unconditioned rules', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('i.ts', "css({ _nonesuch: { color: 'red' }, color: 'blue' })")
    const { css } = compile(defineConfig(config), cwd)
    expect(css).toContain('{color:blue}')
    // the unknown-condition atom must not leak as an unconditional rule
    expect(css).not.toContain('{color:red}')
  })

  it('emits keyframes and honors minify', () => {
    rmSync(join(cwd, 'src'), { recursive: true, force: true })
    write('j.ts', "css({ animation: 'spin 1s linear infinite' })")
    const { css } = compile(
      defineConfig({
        ...config,
        minify: true,
        keyframes: {
          spin: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } }
        }
      }),
      cwd
    )
    expect(css).toContain(
      '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'
    )
    expect(css).not.toContain('\n\n')
  })
})

describe('build', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-build-'))
  let rcwd = ''

  afterAll(() => {
    rmSync(cwd, { recursive: true, force: true })
    if (rcwd) rmSync(rcwd, { recursive: true, force: true })
  })

  it('generates a runtime whose class names match the emitted css', async () => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    const style = "{ p: '4', color: 'sig.accent', md: { m: '2' }, _hover: { pt: '8' } }"
    writeFileSync(join(cwd, 'src', 'x.ts'), `css(${style})\ncss({ px: '8' })`)
    build(
      defineConfig({
        ...config,
        tokens: { ...config.tokens, spacing: { '2': '0.5rem', '4': '1rem', '8': '2rem' } }
      }),
      cwd
    )

    const cssText = readFileSync(join(cwd, 'styled-system', 'styles.css'), 'utf8')
    const mod = await import(pathToFileURL(join(cwd, 'styled-system/css/index.mjs')).href)
    const classes = mod.css(eval(`(${style})`)).split(' ')

    // p emits four longhand atoms, plus color, md margin four longhands
    // and the hover pt atom
    expect(classes.length).toBe(10)
    for (const cls of classes) {
      expect(cssText).toContain('.' + cls)
    }
  })

  it('merge order: later arguments override per css property', async () => {
    const cssText = readFileSync(join(cwd, 'styled-system', 'styles.css'), 'utf8')
    const mod = await import(pathToFileURL(join(cwd, 'styled-system/css/index.mjs')).href)
    // padding-left/right come from px now, block stays from p
    const cls = mod.css({ p: '4' }, { px: '8' }).split(' ')
    expect(cls).toHaveLength(4)
    const declOf = (c: string) => {
      const re = new RegExp(`\\.${c}\\{([^}]+)\\}`)
      return cssText.match(re)?.[1]
    }
    const decls = cls.map(declOf)
    expect(decls).toContain('padding-left:var(--s-spacing-8)')
    expect(decls).toContain('padding-right:var(--s-spacing-8)')
    expect(decls).toContain('padding-top:var(--s-spacing-4)')
    expect(decls).toContain('padding-bottom:var(--s-spacing-4)')
    expect(decls).not.toContain('padding-left:var(--s-spacing-4)')
  })

  it('writes typed outputs', () => {
    const dts = readFileSync(join(cwd, 'styled-system/css/index.d.ts'), 'utf8')
    expect(dts).toContain("'sig.accent'")
    expect(dts).toContain('StyleObject')
    expect(dts).toContain('_peerChecked')
    const pats = readFileSync(join(cwd, 'styled-system/patterns/index.mjs'), 'utf8')
    expect(pats).toContain('export const stack')
  })

  it('generates recipes and slot recipes with merge semantics', async () => {
    // separate dir since node caches generated modules by path
    rcwd = mkdtempSync(join(process.cwd(), '.tmp-css-recipes-'))
    mkdirSync(join(rcwd, 'src'), { recursive: true })
    writeFileSync(join(rcwd, 'src', 'r.ts'), 'css({ p: "4" })')
    build(
      defineConfig({
        ...config,
        tokens: {
          ...config.tokens,
          spacing: { '2': '0.5rem', '4': '1rem', '8': '2rem' },
          fontSizes: { sm: '0.875rem', lg: '1.125rem' }
        },
        recipes: {
          btn: {
            base: { px: '4', py: '2', rounded: 'md' },
            variants: {
              size: { sm: { fontSize: 'sm' }, lg: { fontSize: 'lg', p: '8' } },
              tone: { solid: { bg: 'sig.accent' } }
            },
            compoundVariants: [{ size: 'lg', tone: 'solid', css: { pt: '8' } }],
            defaultVariants: { size: 'sm', tone: 'solid' }
          }
        },
        slotRecipes: {
          card: {
            slots: ['root', 'body'],
            base: { root: { rounded: 'md' }, body: { p: '4' } },
            variants: { pad: { lg: { body: { p: '8' } } } }
          }
        }
      }),
      rcwd
    )
    const cssText = readFileSync(join(rcwd, 'styled-system', 'styles.css'), 'utf8')
    const recipes = await import(pathToFileURL(join(rcwd, 'styled-system/recipes/index.mjs')).href)

    const lg = recipes.btn({ size: 'lg' }).split(' ')
    // compound variant pt:8 merged over base py:2 and variant p:8
    expect(lg.every((c: string) => cssText.includes('.' + c))).toBe(true)
    const decls = lg.map((c: string) => cssText.match(new RegExp(`\\.${c}\\{([^}]+)\\}`))?.[1])
    expect(decls).toContain('padding-top:var(--s-spacing-8)')

    const card = recipes.card({ pad: 'lg' })
    expect(typeof card.root).toBe('string')
    // body pad:lg overrides base p:4 entirely via longhand dedupe
    const bodyDecls = card.body
      .split(' ')
      .map((c: string) => cssText.match(new RegExp(`\\.${c}\\{([^}]+)\\}`))?.[1])
    expect(bodyDecls).not.toContain('padding-top:var(--s-spacing-4)')
    expect(bodyDecls).toContain('padding-top:var(--s-spacing-8)')
  })
})

describe('layers and properties', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-layers-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  it('wraps output in base and utilities cascade layers', () => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    writeFileSync(join(cwd, 'src', 'l.ts'), "css({ p: '4' })")
    const { css } = compile(defineConfig({ ...config, tokens: { spacing: { '4': '1rem' } } }), cwd)
    expect(css).toContain('@layer base, components, utilities;')
    expect(css).toContain('@layer base {')
    expect(css).toContain('@layer utilities {')
  })

  it('registers token variables with @property when the value is literal', () => {
    const { css } = compile(defineConfig({ ...config, tokens: { spacing: { '4': '1rem' } } }), cwd)
    expect(css).toContain(
      "@property --s-spacing-4{syntax:'<length-percentage>';inherits:true;initial-value:1rem}"
    )
  })

  it('skips @property for var() or function token values', () => {
    const { css } = compile(
      defineConfig({
        ...config,
        tokens: { colors: { accent: 'var(--sig-accent)', plain: '#fff' } }
      }),
      cwd
    )
    expect(css).not.toContain('--s-colors-accent{syntax')
    expect(css).toContain("@property --s-colors-plain{syntax:'<color>'")
  })

  it('emits flat output when layers are off', () => {
    const { css } = compile(
      defineConfig({ ...config, layers: false, tokens: { spacing: { '4': '1rem' } } }),
      cwd
    )
    expect(css).not.toContain('@layer')
  })
})

describe('strict mode', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-strict-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  const strict = (body: string, extra = {}) =>
    compile(
      defineConfig({ ...config, strict: true, ...extra }),
      (() => {
        mkdirSync(join(cwd, 'src'), { recursive: true })
        writeFileSync(join(cwd, 'src', 's.ts'), body)
        return cwd
      })()
    ).problems

  it('flags unknown style props with file and line', () => {
    const problems = strict("css({ paddin: '4' })")
    expect(problems).toHaveLength(1)
    expect(problems[0]).toContain('src/s.ts:1')
    expect(problems[0]).toContain('unknown style prop "paddin"')
  })

  it('flags tokens referenced across domains', () => {
    const problems = strict("css({ color: '4' })", {
      tokens: { spacing: { '4': '1rem' }, colors: { sig: { accent: '#4f46e5' } } }
    })
    // '4' is not an ident so it is not checked; use a named token instead
    expect(problems).toHaveLength(0)
    const bad = strict("css({ color: 'md' })", {
      tokens: { radii: { md: '0.375rem' }, colors: {} }
    })
    expect(bad[0]).toContain('"md" is a radii token')
  })

  it('lets universal CSS keywords pass even when a token shares the name', () => {
    const problems = strict("css({ border: 'none', mx: 'auto' })", {
      tokens: { lineHeights: { none: '1' }, sizes: { auto: 'auto' } }
    })
    expect(problems).toHaveLength(0)
  })

  it('flags bad recipe variants at the call site', () => {
    const problems = strict("chip({ tone: 'accnet' })", {
      recipes: { chip: { variants: { tone: { accent: { color: 'red' } } } } }
    })
    expect(problems[0]).toContain('chip() variant "tone" has no option "accnet"')
    const unknown = strict("chip({ siz: 'sm' })", {
      recipes: { chip: { variants: { size: { sm: { p: '4' } } } } }
    })
    expect(unknown[0]).toContain('chip() has no variant "siz"')
  })

  it('flags unknown conditions instead of warning', () => {
    const problems = strict("css({ _hovver: { color: 'red' } })")
    expect(problems[0]).toContain('unknown condition "_hovver"')
  })
})

describe('provenance and explain', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-prov-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  it('writes styles.map.json with file and line per atom', () => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    writeFileSync(join(cwd, 'src', 'p.ts'), "// header\nconst x = css({ p: '4' })")
    build(defineConfig({ ...config, tokens: { spacing: { '4': '1rem' } } }), cwd)
    const map = JSON.parse(readFileSync(join(cwd, 'styled-system', 'styles.map.json'), 'utf8'))
    const entry = Object.values(map)[0] as { f: string; l: number; d: string }
    expect(entry.f).toBe('src/p.ts')
    expect(entry.l).toBe(2)
    expect(entry.d).toContain('padding')
  })

  it('explains an atom class from the provenance map', () => {
    const map = JSON.parse(readFileSync(join(cwd, 'styled-system', 'styles.map.json'), 'utf8'))
    const cls = Object.keys(map)[0]
    const out = explain(cls, join(cwd, 'styled-system'))
    expect(out).toContain('src/p.ts:2')
    expect(out).toContain(cls)
  })

  it('explains sig-* classes from the component parts', () => {
    const out = explain('sig-btn', join(cwd, 'styled-system'))
    expect(out).toContain('Button')
  })
})

describe('checkBuild stale guard', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-check-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  it('passes right after a build and fails when sources change', () => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    writeFileSync(join(cwd, 'src', 'c.ts'), "css({ p: '4' })")
    const cfg = defineConfig({ ...config, tokens: { spacing: { '4': '1rem', '8': '2rem' } } })
    build(cfg, cwd)
    expect(checkBuild(cfg, cwd).stale).toHaveLength(0)
    writeFileSync(join(cwd, 'src', 'c.ts'), "css({ p: '8' })")
    const stale = checkBuild(cfg, cwd).stale
    expect(stale).toContain('styles.css')
  })
})

describe('tree-shaken component styles', () => {
  const cwd = mkdtempSync(join(process.cwd(), '.tmp-css-parts-'))

  afterAll(() => rmSync(cwd, { recursive: true, force: true }))

  const parts = {
    Button: '.sig-btn { color: red }',
    Dialog: '.sig-dialog-overlay { position: fixed }',
    Card: '.sig-card { padding: 1rem }'
  }

  it('emits only the requested components inside the components layer', () => {
    const res = resolveComponentCss(defineConfig({ components: ['button', 'Dialog'] }), [], parts)
    expect(res?.names).toEqual(['Button', 'Dialog'])
    expect(res?.css).toContain('@layer components')
    expect(res?.css).toContain('.sig-btn')
    expect(res?.css).toContain('.sig-dialog-overlay')
    expect(res?.css).not.toContain('.sig-card')
  })

  it('reports unknown component names', () => {
    const res = resolveComponentCss(defineConfig({ components: ['Nope'] }), [], parts)
    expect(res?.unknown).toEqual(['Nope'])
  })

  it('detects components from sigil-ui imports', () => {
    mkdirSync(join(cwd, 'src'), { recursive: true })
    writeFileSync(
      join(cwd, 'src', 'a.ts'),
      `import { Button, Dialog as D, type Foo } from 'sigil-ui'\nimport { x } from 'other'`
    )
    const files = sourceFiles(defineConfig(config), cwd)
    const detected = detectComponents(files)
    expect(detected).toBeInstanceOf(Set)
    expect([...(detected as Set<string>)]).toEqual(['Button', 'Dialog'])
    const res = resolveComponentCss(defineConfig({ components: 'auto' }), files, parts)
    expect(res?.names).toEqual(['Button', 'Dialog'])
    expect(res?.unknown).toEqual([])
  })
})

describe('minify', () => {
  it('strips comments and whitespace without breaking calc or color functions', () => {
    const out = minifyCss(
      `/* header */\n.a { width: calc(100% - 4px); color: color-mix(in srgb, red 50%, blue) }\n.b { margin: 0 }`
    )
    expect(out).not.toContain('header')
    expect(out).toContain('calc(100% - 4px)')
    expect(out).toContain('color-mix(in srgb,red 50%,blue)')
    expect(out).toContain('.a{')
  })

  it('always writes styles.min.css alongside styles.css', () => {
    const mcwd = mkdtempSync(join(process.cwd(), '.tmp-css-min-'))
    try {
      mkdirSync(join(mcwd, 'src'), { recursive: true })
      writeFileSync(join(mcwd, 'src', 'm.ts'), `css({ p: '4' })`)
      build(
        defineConfig({
          ...config,
          tokens: { ...config.tokens, spacing: { '4': '1rem' } }
        }),
        mcwd
      )
      const pretty = readFileSync(join(mcwd, 'styled-system', 'styles.css'), 'utf8')
      const mini = readFileSync(join(mcwd, 'styled-system', 'styles.min.css'), 'utf8')
      expect(mini.length).toBeLessThan(pretty.length)
      expect(mini).not.toContain('\n')
    } finally {
      rmSync(mcwd, { recursive: true, force: true })
    }
  })
})
