// @ts-nocheck
// sigil css engine: scans source for css() calls, emits atomic CSS and a
// typed generated runtime. Zero dependencies, plain node ESM.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function defineConfig(config) {
  return config
}

const DEFAULT_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// selector conditions: & is the generated class
const SELECTOR_CONDITIONS = {
  _hover: '&:hover',
  _focus: '&:focus',
  _focusVisible: '&:focus-visible',
  _focusWithin: '&:focus-within',
  _active: '&:active',
  _disabled: '&:disabled',
  _visited: '&:visited',
  _first: '&:first-child',
  _last: '&:last-child',
  _odd: '&:nth-child(odd)',
  _even: '&:nth-child(even)',
  _before: '&::before',
  _after: '&::after',
  _placeholder: '&::placeholder',
  _marker: '&::marker',
  _selection: '&::selection',
  _dark: '[data-theme="dark"] &',
  _light: '[data-theme="light"] &'
}

// conditions emitted as @media wrappers
const MEDIA_CONDITIONS = {
  _motionReduce: '(prefers-reduced-motion: reduce)',
  _motionSafe: '(prefers-reduced-motion: no-preference)',
  _print: 'print',
  _portrait: '(orientation: portrait)',
  _landscape: '(orientation: landscape)'
}

// shorthand prop -> [css properties, token category, append px to bare numbers]
const PROPS = {
  p: [['padding'], 'spacing', true],
  px: [['padding-inline'], 'spacing', true],
  py: [['padding-block'], 'spacing', true],
  pt: [['padding-top'], 'spacing', true],
  pr: [['padding-right'], 'spacing', true],
  pb: [['padding-bottom'], 'spacing', true],
  pl: [['padding-left'], 'spacing', true],
  padding: [['padding'], 'spacing', true],
  m: [['margin'], 'spacing', true],
  mx: [['margin-inline'], 'spacing', true],
  my: [['margin-block'], 'spacing', true],
  mt: [['margin-top'], 'spacing', true],
  mr: [['margin-right'], 'spacing', true],
  mb: [['margin-bottom'], 'spacing', true],
  ml: [['margin-left'], 'spacing', true],
  margin: [['margin'], 'spacing', true],
  gap: [['gap'], 'spacing', true],
  gapX: [['column-gap'], 'spacing', true],
  gapY: [['row-gap'], 'spacing', true],
  inset: [['inset'], 'spacing', true],
  scrollMargin: [['scroll-margin'], 'spacing', true],
  scrollMarginTop: [['scroll-margin-top'], 'spacing', true],
  scrollMarginBottom: [['scroll-margin-bottom'], 'spacing', true],
  scrollPadding: [['scroll-padding'], 'spacing', true],
  top: [['top'], 'spacing', true],
  right: [['right'], 'spacing', true],
  bottom: [['bottom'], 'spacing', true],
  left: [['left'], 'spacing', true],
  w: [['width'], 'sizes', true],
  h: [['height'], 'sizes', true],
  minW: [['min-width'], 'sizes', true],
  minH: [['min-height'], 'sizes', true],
  maxW: [['max-width'], 'sizes', true],
  maxH: [['max-height'], 'sizes', true],
  size: [['width', 'height'], 'sizes', true],
  basis: [['flex-basis'], 'sizes', true],
  bg: [['background'], 'colors', false],
  bgColor: [['background-color'], 'colors', false],
  color: [['color'], 'colors', false],
  borderColor: [['border-color'], 'colors', false],
  outlineColor: [['outline-color'], 'colors', false],
  caretColor: [['caret-color'], 'colors', false],
  accentColor: [['accent-color'], 'colors', false],
  fill: [['fill'], 'colors', false],
  stroke: [['stroke'], 'colors', false],
  rounded: [['border-radius'], 'radii', true],
  roundedTop: [['border-top-left-radius', 'border-top-right-radius'], 'radii', true],
  roundedBottom: [['border-bottom-left-radius', 'border-bottom-right-radius'], 'radii', true],
  roundedLeft: [['border-top-left-radius', 'border-bottom-left-radius'], 'radii', true],
  roundedRight: [['border-top-right-radius', 'border-bottom-right-radius'], 'radii', true],
  shadow: [['box-shadow'], 'shadows', false],
  fontSize: [['font-size'], 'fontSizes', true],
  fontWeight: [['font-weight'], 'fontWeights', false],
  font: [['font-family'], 'fonts', false],
  fontFamily: [['font-family'], 'fonts', false],
  lineHeight: [['line-height'], 'lineHeights', false],
  letterSpacing: [['letter-spacing'], 'letterSpacings', true],
  z: [['z-index'], 'zIndex', false],
  flexDir: [['flex-direction'], null, false]
}

const kebab = (s) => s.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase())

// scan for calls to these names
const FN_NAMES = ['css', 'cx', 'flex', 'stack', 'vstack', 'hstack', 'grid', 'center', 'wrap']

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return 's' + (h >>> 0).toString(36)
}

function flattenTokens(tokens) {
  // { colors: { sig: { accent: 'x' } } } -> { colors: { 'sig.accent': 'x' } }
  const out = {}
  for (const [category, group] of Object.entries(tokens ?? {})) {
    const flat = {}
    const walk = (obj, path) => {
      for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object' && !('value' in v)) walk(v, path ? path + '.' + k : k)
        else flat[path ? path + '.' + k : k] = v && typeof v === 'object' ? v.value : v
      }
    }
    walk(group ?? {}, '')
    out[category] = flat
  }
  return out
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

// walk a style object the same way the generated runtime does so class
// names match. Emits [condKey, prop, rawValue] triples.
function walkStyles(obj, cond, out, breakpoints) {
  for (const [key, value] of Object.entries(obj)) {
    if (value == null || value === false) continue
    if (key[0] === '_' || key in breakpoints) {
      if (isPlainObject(value)) walkStyles(value, cond + key + ':', out, breakpoints)
      continue
    }
    if (isPlainObject(value)) {
      for (const [bp, v] of Object.entries(value)) {
        if (v == null || v === false) continue
        const c = bp === 'base' ? cond : cond + bp + ':'
        out.push([c, key, v])
      }
      continue
    }
    out.push([cond, key, value])
  }
}

function resolveDecl(prop, raw, flat) {
  const entry = PROPS[prop]
  const props = entry ? entry[0] : [kebab(prop)]
  const category = entry ? entry[1] : null
  const numeric = entry ? entry[2] : false
  let value = String(raw)
  const table = category ? flat[category] : null
  if (table && value in table) value = String(table[value])
  else if (category === 'sizes' && flat.spacing && value in flat.spacing)
    value = String(flat.spacing[value])
  else if (numeric && value !== '0' && /^-?\d+(\.\d+)?$/.test(value)) value += 'px'
  return props.map((p) => `${p}:${value}`).join(';')
}

function compileStyles(obj, breakpoints, flat) {
  const triples = []
  walkStyles(obj, '', triples, breakpoints)
  const rules = []
  for (const [condKey, prop, raw] of triples) {
    const cls = hash(condKey + prop + '=' + raw)
    const conds = condKey ? condKey.slice(0, -1).split(':') : []
    let selector = '.' + cls
    const medias = []
    let bpIndex = -1
    for (const c of conds) {
      if (c in breakpoints) {
        medias.push(`(min-width: ${breakpoints[c]})`)
        bpIndex = Math.max(bpIndex, Object.keys(breakpoints).indexOf(c))
      } else if (c in MEDIA_CONDITIONS) {
        medias.push(MEDIA_CONDITIONS[c])
      } else if (c in SELECTOR_CONDITIONS) {
        selector = SELECTOR_CONDITIONS[c].replaceAll('&', selector)
      }
    }
    rules.push({ cls, selector, decl: resolveDecl(prop, raw, flat), medias, bpIndex })
  }
  return rules
}

// turn a glob like src/**/x.{svelte,ts} into a RegExp matched on
// posix-style relative paths
function globToRe(glob) {
  let re = ''
  let i = 0
  while (i < glob.length) {
    const c = glob[i]
    if (c === '*') {
      if (glob[i + 1] === '*') {
        re += '.*'
        i += 2
        if (glob[i] === '/') i++
      } else {
        re += '[^/]*'
        i++
      }
    } else if (c === '?') {
      re += '[^/]'
      i++
    } else if (c === '{') {
      const end = glob.indexOf('}', i)
      const parts = glob.slice(i + 1, end).split(',')
      re += '(?:' + parts.map((p) => p.replace(/[.+^$()|[\]\\]/g, '\\$&')).join('|') + ')'
      i = end + 1
    } else {
      re += c.replace(/[.+^$()|[\]\\]/g, '\\$&')
      i++
    }
  }
  return new RegExp('^' + re + '$')
}

function listFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) listFiles(p, out)
    else out.push(p)
  }
  return out
}

// extract the object literal following fnName( while honoring strings,
// template literals and comments
function extractLiteral(src, start) {
  let i = start
  while (i < src.length && /\s/.test(src[i])) i++
  if (src[i] !== '{') return null
  let depth = 0
  let str = null
  for (let j = i; j < src.length; j++) {
    const c = src[j]
    if (str) {
      if (c === '\\') j++
      else if (c === str) str = null
      else if (str === '`' && c === '$' && src[j + 1] === '{') {
        // count template expression braces inside the string scan
        let d = 1
        let k = j + 2
        let inner = null
        while (k < src.length && d > 0) {
          const cc = src[k]
          if (inner) {
            if (cc === '\\') k++
            else if (cc === inner) inner = null
          } else if (cc === "'" || cc === '"' || cc === '`') inner = cc
          else if (cc === '{') d++
          else if (cc === '}') d--
          k++
        }
        j = k - 1
      }
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      str = c
      continue
    }
    if (c === '/' && src[j + 1] === '/') {
      while (j < src.length && src[j] !== '\n') j++
      continue
    }
    if (c === '/' && src[j + 1] === '*') {
      j += 2
      while (j < src.length && !(src[j] === '*' && src[j + 1] === '/')) j++
      j++
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return { text: src.slice(i, j + 1), end: j + 1 }
    }
  }
  return null
}

export function extractCalls(src, names = FN_NAMES) {
  const re = new RegExp(`\\b(${names.join('|')})\\s*\\(`, 'g')
  const found = []
  let m
  while ((m = re.exec(src))) {
    const lit = extractLiteral(src, m.index + m[0].length)
    if (!lit) continue
    try {
      const value = new Function(`"use strict"; return (${lit.text})`)()
      found.push(value)
    } catch {
      // literal references runtime values; not statically analyzable
    }
  }
  return found
}

const PREFLIGHT = `*,*::before,*::after{box-sizing:border-box}
html{line-height:1.5;-webkit-text-size-adjust:100%}
body{margin:0}
img,svg,video,canvas{display:block;max-width:100%}
button,input,select,textarea{font:inherit;color:inherit}
`

export async function loadConfig(cwd = process.cwd()) {
  for (const name of ['sigil.config.mjs', 'sigil.config.js']) {
    const p = join(cwd, name)
    if (existsSync(p)) return (await import(pathToFileURL(p).href)).default
  }
  return null
}

export function compile(config, cwd = process.cwd()) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...config.breakpoints }
  const flat = flattenTokens(config.tokens)
  const include = config.include ?? ['./src/**/*.{ts,js,svelte}']
  const res = include.map((g) => globToRe(g.replace(/^\.\//, '')))
  const files = listFiles(cwd).filter((f) => {
    const rel = relative(cwd, f).split('\\').join('/')
    return res.some((r) => r.test(rel))
  })

  const seen = new Map()
  for (const file of files) {
    const src = readFileSync(file, 'utf8')
    for (const obj of extractCalls(src)) {
      for (const rule of compileStyles(obj, breakpoints, flat)) {
        if (!seen.has(rule.cls)) seen.set(rule.cls, rule)
      }
    }
  }

  const rules = [...seen.values()].sort((a, b) => a.bpIndex - b.bpIndex)
  const blocks = []
  for (const r of rules) {
    const rule = `${r.selector}{${r.decl}}`
    blocks.push(r.medias.length ? `@media ${r.medias.join(' and ')}{${rule}}` : rule)
  }

  const css = (config.preflight === false ? '' : PREFLIGHT) + blocks.join('\n') + '\n'
  return { css, count: rules.length, files: files.length }
}

function tsUnion(values) {
  const keys = Object.keys(values ?? {})
  if (!keys.length) return 'string'
  return keys.map((k) => `'${k}'`).join(' | ') + ' | (string & {})'
}

function generateDts(config, flat, breakpoints) {
  const cats = [
    'colors',
    'spacing',
    'sizes',
    'radii',
    'shadows',
    'fontSizes',
    'fontWeights',
    'fonts',
    'lineHeights',
    'letterSpacings',
    'zIndex'
  ]
  const unions = cats.map((c) => `type ${c[0].toUpperCase() + c.slice(1)} = ${tsUnion(flat[c])}`)
  const bps = ['base', ...Object.keys(breakpoints)].map((b) => `'${b}'`).join(' | ')
  const catOf = (name) => (PROPS[name] ? PROPS[name][1] : null)
  const lines = Object.keys(PROPS).map((p) => {
    const cat = catOf(p)
    const t = cat ? cat[0].toUpperCase() + cat.slice(1) : 'string'
    return `  ${JSON.stringify(p)}?: ResponsiveValue<${t}>`
  })
  const conds = [...Object.keys(SELECTOR_CONDITIONS), ...Object.keys(MEDIA_CONDITIONS)]
  const condLines = conds.map((c) => `  ${JSON.stringify(c)}?: StyleObject`)
  const bpLines = Object.keys(breakpoints).map((b) => `  ${JSON.stringify(b)}?: StyleObject`)
  return `// generated by sigil-ui css. do not edit.
type Breakpoint = ${bps}
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>
${unions.join('\n')}
export interface StyleObject {
${lines.join('\n')}
${condLines.join('\n')}
${bpLines.join('\n')}
  [key: string]: unknown
}
export declare function css(...styles: Array<StyleObject | false | null | undefined>): string
export declare function cx(...classes: Array<string | false | null | undefined>): string
`
}

function generateRuntime(config, breakpoints) {
  const bpKeys = JSON.stringify(Object.keys(breakpoints))
  return `// generated by sigil-ui css. do not edit.
const BPS = new Set(${bpKeys})
function hash(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return 's' + (h >>> 0).toString(36)
}
function isObj(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
function walk(obj, cond, out) {
  for (const k in obj) {
    const v = obj[k]
    if (v == null || v === false) continue
    if (k[0] === '_' || BPS.has(k)) {
      if (isObj(v)) walk(v, cond + k + ':', out)
      continue
    }
    if (isObj(v)) {
      for (const b in v) {
        const val = v[b]
        if (val == null || val === false) continue
        out.push(hash(cond + (b === 'base' ? '' : b + ':') + k + '=' + val))
      }
      continue
    }
    out.push(hash(cond + k + '=' + v))
  }
}
export function css(...styles) {
  const out = []
  for (const s of styles) if (s && typeof s === 'object') walk(s, '', out)
  return out.join(' ')
}
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
`
}

function generatePatterns() {
  const js = `// generated by sigil-ui css. do not edit.
import { css } from '../css/index.mjs'
export const flex = (o = {}) => css({ display: 'flex', ...o })
export const stack = (o = {}) => css({ display: 'flex', flexDirection: 'column', ...o })
export const vstack = stack
export const hstack = (o = {}) => css({ display: 'flex', alignItems: 'center', ...o })
export const wrap = (o = {}) => css({ display: 'flex', flexWrap: 'wrap', ...o })
export const grid = (o = {}) => css({ display: 'grid', ...o })
export const center = (o = {}) =>
  css({ display: 'flex', alignItems: 'center', justifyContent: 'center', ...o })
`
  const dts = `// generated by sigil-ui css. do not edit.
import type { StyleObject } from '../css/index.js'
export declare function flex(o?: StyleObject): string
export declare function stack(o?: StyleObject): string
export declare function vstack(o?: StyleObject): string
export declare function hstack(o?: StyleObject): string
export declare function wrap(o?: StyleObject): string
export declare function grid(o?: StyleObject): string
export declare function center(o?: StyleObject): string
`
  return { js, dts }
}

export function build(config, cwd = process.cwd()) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...config.breakpoints }
  const flat = flattenTokens(config.tokens)
  const outdir = resolve(cwd, config.outdir ?? 'styled-system')
  const { css, count, files } = compile(config, cwd)

  rmSync(outdir, { recursive: true, force: true })
  mkdirSync(join(outdir, 'css'), { recursive: true })
  mkdirSync(join(outdir, 'patterns'), { recursive: true })
  writeFileSync(join(outdir, 'styles.css'), css)
  writeFileSync(join(outdir, 'css', 'index.mjs'), generateRuntime(config, breakpoints))
  writeFileSync(join(outdir, 'css', 'index.d.ts'), generateDts(config, flat, breakpoints))
  const pats = generatePatterns()
  writeFileSync(join(outdir, 'patterns', 'index.mjs'), pats.js)
  writeFileSync(join(outdir, 'patterns', 'index.d.ts'), pats.dts)
  return { count, files, outdir }
}
