#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync, watch, writeFileSync } from 'node:fs'
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
  sigil-ui css               build-time atomic CSS: generate styled-system/
  sigil-ui css init          write a starter sigil.config.mjs
  sigil-ui css --watch       rebuild styled-system/ when source files change
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
  const text = files
    .filter((f) => /\.(svelte|ts|js|css)$/.test(f))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')

  const usesComponents = /from\s+['"]sigil-ui['"]/.test(text)
  const importsTheme = /sigil-ui\/theme\.css|sigil-ui\/tailwind\.css/.test(text)
  if (usesComponents && !importsTheme) {
    notes.push(
      "components imported but no theme import found. Add: import 'sigil-ui/theme.css' (or your own --sig-* tokens)"
    )
  }

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
  const { loadConfig, build } = await import(new URL('../css/engine.mjs', import.meta.url))
  const cwd = process.cwd()
  if (arg === 'init') {
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
  }
})
`
    )
    console.log('wrote sigil.config.mjs')
    process.exit(0)
  }
  const config = await loadConfig(cwd)
  if (!config) {
    console.error('no sigil.config.mjs found. Run: sigil-ui css init')
    process.exit(1)
  }
  const res = build(config, cwd)
  console.log(
    `sigil css: scanned ${res.files} files, emitted ${res.count} rules to ${res.outdir}/styles.css`
  )
  if (arg === '--watch' || arg === '-w') {
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
