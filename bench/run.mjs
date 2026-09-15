// Cross-framework CSS engine benchmark.
//
// Generates an identical workload for each engine (the same set of style
// patterns spread across N source files), runs each engine's own CLI cold,
// and records wall time, emitted CSS size, and each engine's installed
// dependency footprint. Results land in results.json and site/src/bench.ts.
//
//   pnpm -F sigil-bench bench
//
// Re-run to refresh the numbers. The fixture is deterministic.

import { execFileSync } from 'node:child_process'
import { lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BENCH = dirname(fileURLToPath(import.meta.url))
const REPO = join(BENCH, '..')
const FIXTURE = join(BENCH, '.fixture')
const FILE_COUNT = 80

// One workload, four dialects. Each entry is one style block; the engines
// emit roughly the same declarations from it.
const PATTERNS = [
  {
    obj: "{ display: 'flex', alignItems: 'center', gap: '2' }",
    tw: 'flex items-center gap-2'
  },
  {
    obj: "{ px: '4', py: '2', rounded: 'md', fontSize: 'sm', fontWeight: 'medium' }",
    tw: 'px-4 py-2 rounded-md text-sm font-medium'
  },
  {
    obj: "{ position: 'absolute', inset: '0' }",
    tw: 'absolute inset-0'
  },
  {
    obj: "{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4' }",
    tw: 'grid grid-cols-3 gap-4'
  },
  {
    obj: "{ color: 'white', bg: 'accent', _hover: { bg: 'accent-hover' } }",
    tw: 'text-white bg-indigo-600 hover:bg-indigo-700'
  },
  {
    obj: "{ border: '1px solid', borderColor: 'border', rounded: 'lg', boxShadow: 'sm' }",
    tw: 'border border-gray-300 rounded-lg shadow-sm'
  },
  {
    obj: "{ mt: '8', mb: '4', mx: 'auto', maxW: 'xl' }",
    tw: 'mt-8 mb-4 mx-auto max-w-xl'
  },
  {
    obj: "{ w: 'full', h: '14', overflow: 'hidden' }",
    tw: 'w-full h-14 overflow-hidden'
  },
  {
    obj: "{ fontSize: 'xs', color: 'muted', textTransform: 'uppercase', letterSpacing: 'wide' }",
    tw: 'text-xs text-gray-500 uppercase tracking-wide'
  },
  {
    obj: "{ transition: 'colors', transitionDuration: '150' }",
    tw: 'transition-colors duration-150'
  }
]

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

function fixture() {
  rmSync(FIXTURE, { recursive: true, force: true })

  // sigil css fixture: css() object calls
  const sigilSrc = join(FIXTURE, 'sigil-app', 'src')
  for (let i = 0; i < FILE_COUNT; i++) {
    const calls = PATTERNS.map((p, j) => `const c${j} = css(${p.obj})`).join('\n')
    write(join(sigilSrc, `file${i}.ts`), `import { css } from '../styled-system/css'\n${calls}\n`)
  }
  write(
    join(FIXTURE, 'sigil-app', 'sigil.config.mjs'),
    `import { defineConfig } from 'sigil-ui/css'

export default defineConfig({
  include: ['./src/**/*.ts'],
  outdir: 'styled-system',
  preflight: true,
  tokens: {
    colors: {
      accent: '#4f46e5',
      'accent-hover': '#4338ca',
      border: '#d4d4d8',
      muted: '#71717a',
      white: '#ffffff'
    },
    spacing: { '2': '0.5rem', '4': '1rem', '8': '2rem' },
    sizes: { full: '100%', '14': '3.5rem', xl: '36rem' },
    radii: { md: '0.375rem', lg: '0.5rem' },
    fontSizes: { xs: '0.75rem', sm: '0.875rem' },
    fontWeights: { medium: '500' },
    shadows: { sm: '0 1px 2px rgb(0 0 0 / 0.05)' },
    letterSpacings: { wide: '0.025em' },
    durations: { '150': '150ms' }
  }
})
`
  )

  // tailwind + unocss fixtures: class strings in tsx
  for (const app of ['tailwind-app', 'uno-app']) {
    const src = join(FIXTURE, app, 'src')
    for (let i = 0; i < FILE_COUNT; i++) {
      const blocks = PATTERNS.map(
        (p, j) => `export const c${j} = <div className="${p.tw}" />`
      ).join('\n')
      write(join(src, `file${i}.tsx`), `${blocks}\n`)
    }
  }
  write(join(FIXTURE, 'tailwind-app', 'input.css'), '@import "tailwindcss";\n')
  write(
    join(FIXTURE, 'uno-app', 'uno.config.mjs'),
    `import { defineConfig } from 'unocss'
import presetWind4 from 'unocss/preset-wind4'

export default defineConfig({
  presets: [presetWind4()]
})
`
  )

  // panda fixture: css() object calls, same shapes as sigil
  const pandaSrc = join(FIXTURE, 'panda-app', 'src')
  for (let i = 0; i < FILE_COUNT; i++) {
    const calls = PATTERNS.map(
      (p, j) =>
        `const c${j} = css(${p.obj.replace(/'border'|'muted'|'accent-hover'|'accent'/g, (m) => `'colors.${m.slice(1, -1)}'`)})`
    ).join('\n')
    write(join(pandaSrc, `file${i}.ts`), `import { css } from '../styled-system/css'\n${calls}\n`)
  }
  write(
    join(FIXTURE, 'panda-app', 'panda.config.mjs'),
    `export default {
  include: ['./src/**/*.{ts,tsx}'],
  outdir: 'styled-system',
  preflight: true,
  theme: {
    extend: {
      tokens: {
        colors: {
          accent: { value: '#4f46e5' },
          'accent-hover': { value: '#4338ca' },
          border: { value: '#d4d4d8' },
          muted: { value: '#71717a' }
        }
      }
    }
  }
}
`
  )
}

function run(cmd, args, cwd) {
  const start = performance.now()
  execFileSync(cmd, args, { cwd, stdio: 'pipe' })
  return performance.now() - start
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function sizeOf(path) {
  const buf = readFileSync(path)
  return { bytes: buf.length, gzip: gzipSync(buf).length }
}

// Count each tool's installed dependency footprint by walking the pnpm
// dependency tree reported for the bench package, then sum the on-disk
// size of every package in the closure under node_modules/.pnpm.
function depStats() {
  const raw = execFileSync('pnpm', ['ls', '--depth', 'Infinity', '--json'], {
    cwd: BENCH,
    maxBuffer: 64 * 1024 * 1024
  }).toString()
  const trees = JSON.parse(raw)
  const roots = {
    'sigil css': [],
    'Tailwind CSS v4': ['tailwindcss', '@tailwindcss/cli'],
    UnoCSS: ['unocss', '@unocss/cli'],
    'Panda CSS': ['@pandacss/dev']
  }
  const walk = (deps, seen) => {
    for (const [name, info] of Object.entries(deps ?? {})) {
      const key = `${name}@${info.version}`
      if (seen.has(key)) continue
      seen.add(key)
      walk(info.dependencies, seen)
    }
  }
  const dirSize = (dir) => {
    let total = 0
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return 0
    }
    for (const e of entries) {
      const p = join(dir, e.name)
      if (e.isDirectory()) total += dirSize(p)
      else if (e.isFile() || e.isSymbolicLink()) {
        try {
          total += lstatSync(p).size
        } catch {
          // broken symlink
        }
      }
    }
    return total
  }
  const store = join(REPO, 'node_modules', '.pnpm')
  const storeDirs = readdirSync(store)
  const stats = {}
  for (const [label, pkgs] of Object.entries(roots)) {
    const seen = new Set()
    for (const tree of trees) {
      const deps = { ...(tree.dependencies ?? {}), ...(tree.devDependencies ?? {}) }
      for (const pkg of pkgs) {
        const node = deps[pkg]
        if (node) {
          seen.add(`${pkg}@${node.version}`)
          walk(node.dependencies, seen)
        }
      }
    }
    let bytes = 0
    for (const key of seen) {
      // .pnpm dir names flatten the scope slash to + and may append peer
      // suffixes like name@version_peer@x.y
      const flat = key.replace('/', '+')
      const at = key.lastIndexOf('@')
      const name = key.slice(0, at)
      const match = storeDirs.find(
        (d) => d === flat || d.startsWith(flat + '_') || d.startsWith(flat + '(')
      )
      if (match) bytes += dirSize(join(store, match, 'node_modules', name))
    }
    stats[label] = { count: seen.size, bytes }
  }
  return stats
}

const RUNS = 3

// cold = median of runs with output and caches removed each time.
// warm = median of immediate re-runs over the generated output.
function benchTool(label, { build, clean, out }) {
  const cold = []
  for (let i = 0; i < RUNS; i++) {
    clean()
    cold.push(build())
  }
  const warm = []
  for (let i = 0; i < RUNS; i++) warm.push(build())
  return { label, coldMs: Math.round(median(cold)), warmMs: Math.round(median(warm)), css: out() }
}

function main() {
  fixture()
  const results = []

  // sigil css
  results.push(
    benchTool('sigil css', {
      build: () =>
        run(process.execPath, [join(REPO, 'bin/sigil.mjs'), 'css'], join(FIXTURE, 'sigil-app')),
      clean: () =>
        rmSync(join(FIXTURE, 'sigil-app', 'styled-system'), { recursive: true, force: true }),
      out: () => sizeOf(join(FIXTURE, 'sigil-app', 'styled-system', 'styles.css'))
    })
  )
  // in-process compile (no Node startup) for context
  {
    const src = join(FIXTURE, 'sigil-app')
    const code = `import { compile } from '${join(REPO, 'css/engine.mjs')}'
import config from '${join(src, 'sigil.config.mjs')}'
const t0 = performance.now()
for (let i = 0; i < 10; i++) compile(config, '${src}')
console.log(((performance.now() - t0) / 10).toFixed(2))
`
    writeFileSync(join(BENCH, '.compile-bench.mjs'), code)
    const out = execFileSync(process.execPath, [join(BENCH, '.compile-bench.mjs')])
      .toString()
      .trim()
    results[0].compileMs = Number(out)
    rmSync(join(BENCH, '.compile-bench.mjs'), { force: true })
  }

  // tailwind v4
  results.push(
    benchTool('Tailwind CSS v4', {
      build: () =>
        run(
          join(BENCH, 'node_modules', '.bin', 'tailwindcss'),
          ['-i', 'input.css', '-o', 'dist/out.css'],
          join(FIXTURE, 'tailwind-app')
        ),
      clean: () => rmSync(join(FIXTURE, 'tailwind-app', 'dist'), { recursive: true, force: true }),
      out: () => sizeOf(join(FIXTURE, 'tailwind-app', 'dist', 'out.css'))
    })
  )

  // unocss
  results.push(
    benchTool('UnoCSS', {
      build: () =>
        run(
          join(BENCH, 'node_modules', '.bin', 'unocss'),
          ['src/**/*.tsx', '-o', 'dist/uno.css', '-c', 'uno.config.mjs'],
          join(FIXTURE, 'uno-app')
        ),
      clean: () => {
        rmSync(join(FIXTURE, 'uno-app', 'dist'), { recursive: true, force: true })
        rmSync(join(FIXTURE, 'uno-app', 'node_modules', '.cache'), { recursive: true, force: true })
      },
      out: () => sizeOf(join(FIXTURE, 'uno-app', 'dist', 'uno.css'))
    })
  )

  // panda: codegen (runtime) + cssgen (stylesheet) is the full build path
  results.push(
    benchTool('Panda CSS', {
      build: () => {
        const bin = join(BENCH, 'node_modules', '.bin', 'panda')
        const cwd = join(FIXTURE, 'panda-app')
        return (
          run(bin, ['codegen', '--silent'], cwd) +
          run(bin, ['cssgen', 'src/**/*.ts', '-o', 'dist/panda.css'], cwd)
        )
      },
      clean: () => {
        rmSync(join(FIXTURE, 'panda-app', 'styled-system'), { recursive: true, force: true })
        rmSync(join(FIXTURE, 'panda-app', 'dist'), { recursive: true, force: true })
      },
      out: () => sizeOf(join(FIXTURE, 'panda-app', 'dist', 'panda.css'))
    })
  )

  const deps = depStats()
  const report = results.map((r) => ({
    tool: r.label,
    coldBuildMs: r.coldMs,
    warmBuildMs: r.warmMs,
    compileMs: r.compileMs ?? null,
    cssBytes: r.css.bytes,
    cssGzipBytes: r.css.gzip,
    dependencies: deps[r.label]?.count ?? null,
    installBytes: deps[r.label]?.bytes ?? null
  }))

  writeFileSync(join(BENCH, 'results.json'), JSON.stringify(report, null, 2) + '\n')

  const rows = report.map(
    (r) =>
      `  ${JSON.stringify({
        tool: r.tool,
        coldBuildMs: r.coldBuildMs,
        warmBuildMs: r.warmBuildMs,
        compileMs: r.compileMs,
        cssBytes: r.cssBytes,
        cssGzipBytes: r.cssGzipBytes,
        dependencies: r.dependencies,
        installBytes: r.installBytes
      })}`
  )
  writeFileSync(
    join(REPO, 'site', 'src', 'bench.ts'),
    `// generated by bench/run.mjs. Do not edit.
// Workload: ${FILE_COUNT} source files x ${PATTERNS.length} style blocks, each engine's own CLI.
export const bench = [
${rows.join(',\n')}
] as const
`
  )

  for (const r of report) {
    console.log(
      `${r.tool.padEnd(16)} cold=${String(r.coldBuildMs).padStart(6)}ms` +
        ` warm=${String(r.warmBuildMs).padStart(6)}ms` +
        (r.compileMs != null ? ` compile=${r.compileMs}ms` : '') +
        ` css=${(r.cssBytes / 1024).toFixed(1)}KB (gz ${(r.cssGzipBytes / 1024).toFixed(1)}KB)` +
        ` deps=${r.dependencies}` +
        (r.installBytes != null ? ` install=${(r.installBytes / 1048576).toFixed(1)}MB` : '')
    )
  }
}

main()
