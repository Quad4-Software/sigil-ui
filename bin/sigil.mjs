#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
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

  if (hasTailwind)
    notes.push("tailwindcss detected: use @import 'sigil-ui/tailwind.css' for sig-* utilities")
  if (hasUno) notes.push('unocss detected: add sigilPreset from sigil-ui/uno')
  if (hasPanda) notes.push('panda detected: add sigilPreset from sigil-ui/panda')

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
