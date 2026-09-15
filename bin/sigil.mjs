#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, watch, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

async function loadManifest() {
  const path = join(root, 'dist', 'manifest.js')
  if (!existsSync(path)) {
    console.error('dist/manifest.js not found. In a source checkout run: pnpm build')
    process.exit(1)
  }
  const mod = await import(path)
  return mod.manifest
}

const HELP = `sigil-ui: Svelte 5 component library, CSS framework agnostic

usage:
  sigil-ui list              list components
  sigil-ui docs <name>       usage, props, classes, example for a component
  sigil-ui tokens            the --sig-* CSS variable contract
  sigil-ui adapters          Tailwind / UnoCSS / Panda / vanilla wiring
  sigil-ui manifest          full component metadata as JSON
  sigil-ui doctor            inspect the current project for setup gaps
  sigil-ui doctor --contrast also audit --sig-* token pairs for WCAG contrast
  sigil-ui css               build-time atomic CSS: generate styled-system/
  sigil-ui css init|--init   write a starter sigil.config.mjs
  sigil-ui css --watch       rebuild styled-system/ when source files change
  sigil-ui css --minify      emit minified styles.css (styles.min.css is always written)
  sigil-ui css --strict      fail on unknown props, wrong-domain tokens, bad recipes
  sigil-ui css --check       CI guard: fail if styled-system/ output is stale
  sigil-ui css --components Button,Dialog   tree-shaken sigil-ui component styles
  sigil-ui css --components auto            detect from your sigil-ui imports
  sigil-ui css --explain <class>            show where an atom came from
  sigil-ui theme [name]      list accent presets or print one to stdout

quickstart:
  pnpm add sigil-ui
  import 'sigil-ui/theme.css'   // optional defaults, override any --sig-* var
  import { Button } from 'sigil-ui'
`

function docs(m, name) {
  const c = m.components.find((x) => x.name.toLowerCase() === name.toLowerCase())
  if (!c) {
    console.error(
      `unknown component "${name}". Available: ${m.components.map((x) => x.name).join(', ')}`
    )
    process.exit(1)
  }
  console.log(`# ${c.name}\n\n${c.description}\n`)
  console.log('import:')
  console.log(
    c.name === 'Dialog'
      ? `  import { Dialog } from 'sigil-ui'  // namespace: Root Trigger Portal Overlay Content Title Description Close`
      : `  import { ${c.name} } from 'sigil-ui'`
  )
  console.log('\nprops:')
  for (const p of c.props) {
    const bits = [p.type]
    if (p.bindable) bits.push('bindable')
    if (p.default) bits.push(`default ${p.default}`)
    console.log(`  ${p.name}: ${bits.join(', ')}`)
    console.log(`    ${p.description}`)
  }
  console.log(`\ncss classes: ${c.classes.join(', ')}`)
  console.log(`data attributes: ${c.dataAttributes.join(', ')}`)
  console.log(`\nexample:\n${c.example}`)
}

function tokens(m) {
  console.log('--sig-* token contract (light / dark defaults):')
  for (const t of m.tokens) {
    console.log(
      `  ${t.name.padEnd(22)} ${t.light.padEnd(28)} ${t.dark.padEnd(28)} ${t.description}`
    )
  }
  console.log('\nDefaults ship in sigil-ui/theme.css. Dark activates via [data-theme="dark"]')
  console.log('or prefers-color-scheme. createTheme() manages data-theme for you.')
}

function adapters(m) {
  for (const a of m.adapters) {
    console.log(`# ${a.name}  (${a.entry})\n${a.usage}\n`)
  }
}

function findFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const p = join(dir, entry.name)
    if (entry.isDirectory()) findFiles(p, out)
    else out.push(p)
  }
  return out
}

function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

// semantic text pairs the contract guarantees are readable
const CONTRAST_PAIRS = [
  ['fg', 'bg'],
  ['muted', 'bg'],
  ['fg', 'surface'],
  ['muted', 'surface'],
  ['accent-fg', 'accent'],
  ['danger-fg', 'danger'],
  ['success-fg', 'success'],
  ['warning-fg', 'warning'],
  ['info-fg', 'info']
]

function hexToRgb(v) {
  const h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v)?.[1]
  if (!h) return null
  const n = h.length === 3 ? [...h].map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16))
}

function relLuminance([r, g, b]) {
  const lin = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(a, b) {
  const [hi, lo] = [relLuminance(a), relLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// audits --sig-* pairs against WCAG AA for both theme scopes. Package
// defaults load from sigil-ui/theme.css, then each consumer file merges
// in: text before a dark selector counts as light, after it as dark
function auditContrast(cssFiles, problems, notes) {
  let themeCss = ''
  try {
    themeCss = readFileSync(createRequire(import.meta.url).resolve('sigil-ui/theme.css'), 'utf8')
  } catch {
    notes.push('sigil-ui theme.css not resolvable; contrast audit used local overrides only')
  }
  const darkRe = /\[data-theme=['"]dark['"]\]|prefers-color-scheme:\s*dark|\.dark\b/

  const parseVars = (css) => {
    const vars = {}
    for (const m2 of css.matchAll(/--sig-([\w-]+)\s*:\s*([^;}]+)/g)) {
      vars[m2[1]] = m2[2].trim()
    }
    return vars
  }

  const themeDark = darkRe.exec(themeCss)
  const scopes = [
    ['light', parseVars(themeDark ? themeCss.slice(0, themeDark.index) : themeCss)],
    ['dark', parseVars(themeDark ? themeCss.slice(themeDark.index) : '')]
  ]
  const varsByScope = { light: scopes[0][1], dark: scopes[1][1] }
  for (const css of cssFiles) {
    const d = darkRe.exec(css)
    Object.assign(varsByScope.light, parseVars(d ? css.slice(0, d.index) : css))
    if (d) Object.assign(varsByScope.dark, parseVars(css.slice(d.index)))
  }

  for (const [scope, vars] of scopes) {
    const pick = (name, depth = 0) => {
      const v = vars[name]
      if (!v || depth > 3) return null
      const ref = /^var\(--sig-([\w-]+)/.exec(v)
      if (ref) return pick(ref[1], depth + 1)
      const rgb = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(v)
      if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
      return hexToRgb(v)
    }
    for (const [fg, bg] of CONTRAST_PAIRS) {
      const f = pick(fg)
      const b = pick(bg)
      if (!f || !b) continue
      const r = contrastRatio(f, b)
      if (r < 3) {
        problems.push(
          `--sig-${fg} on --sig-${bg} is ${r.toFixed(2)}:1 in ${scope} theme, below WCAG AA 3:1`
        )
      } else if (r < 4.5) {
        notes.push(
          `--sig-${fg} on --sig-${bg} is ${r.toFixed(2)}:1 in ${scope} theme, below WCAG AA 4.5:1 for small text`
        )
      }
    }
  }
}

function doctor(m) {
  const cwd = process.cwd()
  const problems = []
  const notes = []

  const pkg = readJson(join(cwd, 'package.json'))
  if (!pkg) {
    console.error('no package.json in the current directory')
    process.exit(1)
  }

  const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }
  const svelteRange = deps.svelte
  if (!svelteRange) {
    problems.push('svelte is not a dependency of this project')
  } else if (!svelteRange.includes('5')) {
    problems.push(`svelte version "${svelteRange}" does not cover 5.x (peer range ${m.sveltePeer})`)
  }

  if (!deps['sigil-ui']) {
    notes.push('sigil-ui is not a dependency here; run pnpm add sigil-ui')
  }

  const files = findFiles(join(cwd, 'src'))
  const sources = files
    .filter((f) => /\.(svelte|ts|js|css)$/.test(f))
    .map((f) => readFileSync(f, 'utf8'))
  const text = sources.join('\n')
  // token declarations inside tests and fixtures are not shipped theme values
  const themeSources = files
    .filter((f) => /\.css$/.test(f) && !/(test|spec|fixture|mock|__)/.test(f))
    .map((f) => readFileSync(f, 'utf8'))

  const usesComponents = /from\s+['"]sigil-ui['"]/.test(text)
  const importsTheme = /sigil-ui\/theme\.css|sigil-ui\/tailwind\.css/.test(text)
  if (usesComponents && !importsTheme) {
    notes.push(
      "components imported but no theme import found. Add: import 'sigil-ui/theme.css' (or your own --sig-* tokens)"
    )
  }

  if (process.argv.includes('--contrast')) auditContrast(themeSources, problems, notes)

  const hasTailwind =
    /@import\s+['"]tailwindcss|from\s+['"]tailwindcss/.test(text) ||
    existsSync(join(cwd, 'tailwind.config.js')) ||
    existsSync(join(cwd, 'tailwind.config.ts'))
  const hasUno = files.some((f) => /uno\.config\.(ts|js|mts)$/.test(f))
  const hasPanda = files.some((f) => /panda\.config\.(ts|js|mts)$/.test(f))
  const hasSigilCss =
    existsSync(join(cwd, 'sigil.config.mjs')) || existsSync(join(cwd, 'sigil.config.js'))

  if (hasTailwind)
    notes.push("tailwindcss detected: use @import 'sigil-ui/tailwind.css' for sig-* utilities")
  if (hasUno) notes.push('unocss detected: add sigilPreset from sigil-ui/uno')
  if (hasPanda) notes.push('panda detected: add sigilPreset from sigil-ui/panda')
  if (hasSigilCss) notes.push('sigil css config detected: regenerate with npx sigil-ui css')

  console.log(`sigil-ui doctor for ${pkg.name ?? cwd}`)
  if (problems.length === 0 && notes.length === 0) {
    console.log('  no issues found')
    return
  }
  for (const p of problems) console.log(`  error: ${p}`)
  for (const n of notes) console.log(`  note:  ${n}`)
  if (problems.length > 0) process.exit(1)
}

const [cmd, arg] = process.argv.slice(2)

if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
  console.log(HELP)
  process.exit(0)
}

if (cmd === 'css') {
  const engine = await import(new URL('../css/engine.mjs', import.meta.url))
  const { loadConfig, build, checkBuild, explain } = engine
  const cwd = process.cwd()
  const argv = process.argv.slice(3)
  const flag = (name) => {
    const eq = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`))
    if (!eq) return undefined
    if (eq.includes('=')) return eq.split('=').slice(1).join('=')
    const next = argv[argv.indexOf(eq) + 1]
    return next && !next.startsWith('-') ? next : true
  }
  const has = (name, short) =>
    argv.includes(`--${name}`) || (short ? argv.includes(`-${short}`) : false)

  if (arg === 'init' || has('init')) {
    const target = join(cwd, 'sigil.config.mjs')
    if (existsSync(target)) {
      console.error('sigil.config.mjs already exists')
      process.exit(1)
    }
    writeFileSync(
      target,
      `import { defineConfig } from 'sigil-ui/css'

export default defineConfig({
  include: ['./src/**/*.{svelte,ts,js}'],
  outdir: 'styled-system',
  preflight: true,
  // strict: true fails the build on unknown props, wrong-domain tokens
  // and bad recipe variants instead of emitting silent output
  // components: 'auto' emits styled-system/components.css holding only
  // the sigil-ui component styles your imports actually use
  // tokens emit as --s-<cat>-<name> custom properties and rules
  // reference var(--s-*) so themes can switch at runtime
  tokens: {
    colors: {},
    spacing: {},
    sizes: {},
    radii: {},
    shadows: {},
    fontSizes: {},
    fontWeights: {},
    fonts: {},
    lineHeights: {}
  },
  // conditions: { dark: '&:where(.dark, .dark *)' },
  // recipes: { btn: { base: {...}, variants: { size: { sm: {...} } } } }
})
`
    )
    console.log(`wrote sigil.config.mjs
next:
  1. run npx sigil-ui css to generate styled-system/
  2. import it once in your app entry: import './styled-system/styles.css'
     and for sigil-ui component tokens: import 'sigil-ui/theme.css'
  3. add it to your build: "codegen": "sigil-ui css"
  4. keep CI honest with: npx sigil-ui css --check`)
    process.exit(0)
  }
  const config = await loadConfig(cwd)
  if (!config) {
    console.error('no sigil.config.mjs found. Run: sigil-ui css init')
    process.exit(1)
  }
  if (has('minify', 'm')) config.minify = true
  if (has('strict')) config.strict = true
  const comp = flag('components')
  if (comp) config.components = comp === 'auto' ? 'auto' : String(comp).split(',')

  const report = (res) => {
    const parts = []
    if (res.components?.names?.length) parts.push(`components: ${res.components.names.join(', ')}`)
    if (res.components?.unknown?.length)
      console.error(`sigil css: unknown components ${res.components.unknown.join(', ')}`)
    console.log(
      `sigil css: scanned ${res.files} files, emitted ${res.count} rules to ${res.outdir}/styles.css` +
        (parts.length ? ` (${parts.join('; ')})` : '')
    )
  }
  const failOnProblems = (problems) => {
    if (!problems?.length) return false
    for (const p of problems) console.error(`sigil css: ${p}`)
    return true
  }

  const explainTarget = flag('explain')
  if (explainTarget) {
    const outdir = resolve(cwd, config.outdir ?? 'styled-system')
    const found = explain(String(explainTarget), outdir)
    console.log(found ?? `no provenance for ${explainTarget} (run sigil-ui css first)`)
    process.exit(found ? 0 : 1)
  }

  if (has('check')) {
    const res = checkBuild(config, cwd)
    if (config.strict && failOnProblems(res.problems)) process.exit(1)
    if (res.stale.length) {
      console.error(
        `sigil css: stale output in ${res.outdir}: ${res.stale.join(', ')}\nrun sigil-ui css to regenerate`
      )
      process.exit(1)
    }
    console.log('sigil css: styled-system/ is up to date')
    process.exit(0)
  }

  const res = build(config, cwd)
  report(res)
  if (config.strict && failOnProblems(res.problems)) process.exit(1)

  if (has('watch', 'w')) {
    const roots = new Set()
    for (const glob of config.include ?? []) {
      // watch the deepest directory before the first glob segment
      const base = resolve(
        cwd,
        String(glob)
          .split('*')[0]
          .replace(/\/[^/]*$/, '')
      )
      if (existsSync(base)) roots.add(base)
    }
    let timer
    const rebuild = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          const r = build(config, cwd)
          console.log(`sigil css: ${r.files} files, ${r.count} rules`)
        } catch (err) {
          console.error(`sigil css rebuild failed: ${err.message}`)
        }
      }, 50)
    }
    for (const dir of roots) watch(dir, { recursive: true }, rebuild)
    console.log(`sigil css: watching ${[...roots].join(', ') || '.'}`)
    // the watchers hold the event loop open, so skip the exit below
  } else {
    process.exit(0)
  }
}

if (cmd === 'theme') {
  const dirs = [join(root, 'dist', 'theme', 'themes'), join(root, 'src', 'lib', 'theme', 'themes')]
  const dir = dirs.find(existsSync)
  const presets = dir
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.css'))
        .map((f) => f.slice(0, -4))
    : []
  if (!arg) {
    console.log('theme presets (import after sigil-ui/theme.css):\n')
    for (const p of presets) console.log(`  ${p.padEnd(10)} sigil-ui/themes/${p}.css`)
    console.log('\nusage: sigil-ui theme <name>    print the preset CSS to stdout')
    process.exit(0)
  }
  const file = dir ? join(dir, `${arg}.css`) : ''
  if (!dir || !existsSync(file)) {
    console.error(`unknown theme "${arg}". Available: ${presets.join(', ') || 'none'}`)
    process.exit(1)
  }
  console.log(readFileSync(file, 'utf8'))
  process.exit(0)
}

const manifest = await loadManifest()

switch (cmd) {
  case 'list':
    for (const c of manifest.components)
      console.log(`  ${c.name.padEnd(10)} ${c.description.split('.')[0]}`)
    break
  case 'docs':
    if (!arg) {
      console.error('usage: sigil-ui docs <component>')
      process.exit(1)
    }
    docs(manifest, arg)
    break
  case 'tokens':
    tokens(manifest)
    break
  case 'adapters':
    adapters(manifest)
    break
  case 'manifest':
    console.log(JSON.stringify(manifest, null, 2))
    break
  case 'doctor':
    doctor(manifest)
    break
  default:
    console.error(`unknown command "${cmd}"\n`)
    console.log(HELP)
    process.exit(1)
}
