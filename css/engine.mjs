// @ts-nocheck
// sigil css engine: scans source for css() calls, emits atomic CSS and a
// typed generated runtime. Zero dependencies, plain node ESM.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export function defineConfig(config) {
  return config
}

export function defineRecipe(recipe) {
  return recipe
}

export function defineSlotRecipe(recipe) {
  return recipe
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
  _visited: '&:visited',
  _link: '&:link',
  _enabled: '&:enabled',
  _disabled: '&:disabled, &[aria-disabled="true"]',
  _readOnly: '&:read-only',
  _readWrite: '&:read-write',
  _required: '&:required',
  _optional: '&:optional',
  _invalid: '&:invalid, &[aria-invalid="true"]',
  _valid: '&:valid',
  _userInvalid: '&:user-invalid',
  _checked: '&:checked, &[data-state="checked"], &[aria-checked="true"]',
  _indeterminate: '&:indeterminate, &[data-state="indeterminate"]',
  _selected: '&[aria-selected="true"], &[data-state="checked"], &[data-selected]',
  _pressed: '&[aria-pressed="true"]',
  _expanded: '&[aria-expanded="true"]',
  _first: '&:first-child',
  _last: '&:last-child',
  _only: '&:only-child',
  _firstOfType: '&:first-of-type',
  _lastOfType: '&:last-of-type',
  _onlyOfType: '&:only-of-type',
  _odd: '&:nth-child(odd)',
  _even: '&:nth-child(even)',
  _empty: '&:empty',
  _target: '&:target',
  _before: '&::before',
  _after: '&::after',
  _placeholder: '&::placeholder',
  _placeholderShown: '&:placeholder-shown',
  _marker: '&::marker',
  _selection: '&::selection',
  _autofill: '&:autofill, &:-webkit-autofill',
  _fullscreen: '&:fullscreen',
  _open: '&[data-state="open"], &[data-state="checked"], &[data-state="active"], &[open]',
  _closed: '&[data-state="closed"], &[data-state="inactive"]',
  _inert: '&[inert]',
  _popoverOpen: '&:popover-open',
  _rtl: '&:dir(rtl), [dir="rtl"] &',
  _ltr: '&:dir(ltr), [dir="ltr"] &',
  _groupHover: '.group:hover &, [data-sig-group]:hover &',
  _groupFocus: '.group:focus &, [data-sig-group]:focus &',
  _groupFocusWithin: '.group:focus-within &, [data-sig-group]:focus-within &',
  _groupActive: '.group:active &, [data-sig-group]:active &',
  _groupChecked: '.group:checked &, .group[data-state="checked"] &',
  _groupDisabled: '.group:disabled &, .group[aria-disabled="true"] &',
  _groupInvalid: '.group[aria-invalid="true"] &',
  _groupOpen: '.group[data-state="open"] &, .group[open] &',
  _peerHover: '.peer:hover ~ &, [data-sig-peer]:hover ~ &',
  _peerFocus: '.peer:focus ~ &, [data-sig-peer]:focus ~ &',
  _peerFocusVisible: '.peer:focus-visible ~ &, [data-sig-peer]:focus-visible ~ &',
  _peerChecked: '.peer:checked ~ &, .peer[data-state="checked"] ~ &',
  _peerDisabled: '.peer:disabled ~ &, .peer[aria-disabled="true"] ~ &',
  _peerInvalid: '.peer[aria-invalid="true"] ~ &',
  _dark: '[data-theme="dark"] &',
  _light: '[data-theme="light"] &'
}

// conditions emitted as at-rule wrappers around the rule
const MEDIA_CONDITIONS = {
  _motionReduce: '@media (prefers-reduced-motion: reduce)',
  _motionSafe: '@media (prefers-reduced-motion: no-preference)',
  _contrastMore: '@media (prefers-contrast: more)',
  _contrastLess: '@media (prefers-contrast: less)',
  _print: '@media print',
  _portrait: '@media (orientation: portrait)',
  _landscape: '@media (orientation: landscape)',
  _starting: '@starting-style'
}

// shorthand prop -> [css longhands, token category, append px to bare numbers]
// multi-longhand entries emit one atomic class per longhand so merge order
// is correct: css({ p: '4' }, { px: '8' }) keeps the padding-block from p
const PROPS = {
  p: [['padding-top', 'padding-right', 'padding-bottom', 'padding-left'], 'spacing', true],
  px: [['padding-left', 'padding-right'], 'spacing', true],
  py: [['padding-top', 'padding-bottom'], 'spacing', true],
  pt: [['padding-top'], 'spacing', true],
  pr: [['padding-right'], 'spacing', true],
  pb: [['padding-bottom'], 'spacing', true],
  pl: [['padding-left'], 'spacing', true],
  padding: [['padding-top', 'padding-right', 'padding-bottom', 'padding-left'], 'spacing', true],
  paddingX: [['padding-left', 'padding-right'], 'spacing', true],
  paddingY: [['padding-top', 'padding-bottom'], 'spacing', true],
  m: [['margin-top', 'margin-right', 'margin-bottom', 'margin-left'], 'spacing', true],
  mx: [['margin-left', 'margin-right'], 'spacing', true],
  my: [['margin-top', 'margin-bottom'], 'spacing', true],
  mt: [['margin-top'], 'spacing', true],
  mr: [['margin-right'], 'spacing', true],
  mb: [['margin-bottom'], 'spacing', true],
  ml: [['margin-left'], 'spacing', true],
  margin: [['margin-top', 'margin-right', 'margin-bottom', 'margin-left'], 'spacing', true],
  marginX: [['margin-left', 'margin-right'], 'spacing', true],
  marginY: [['margin-top', 'margin-bottom'], 'spacing', true],
  gap: [['row-gap', 'column-gap'], 'spacing', true],
  gapX: [['column-gap'], 'spacing', true],
  gapY: [['row-gap'], 'spacing', true],
  inset: [['top', 'right', 'bottom', 'left'], 'spacing', true],
  insetX: [['left', 'right'], 'spacing', true],
  insetY: [['top', 'bottom'], 'spacing', true],
  scrollMargin: [
    ['scroll-margin-top', 'scroll-margin-right', 'scroll-margin-bottom', 'scroll-margin-left'],
    'spacing',
    true
  ],
  scrollMarginTop: [['scroll-margin-top'], 'spacing', true],
  scrollMarginBottom: [['scroll-margin-bottom'], 'spacing', true],
  scrollPadding: [
    ['scroll-padding-top', 'scroll-padding-right', 'scroll-padding-bottom', 'scroll-padding-left'],
    'spacing',
    true
  ],
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
  borderColor: [
    ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
    'colors',
    false
  ],
  borderTopColor: [['border-top-color'], 'colors', false],
  borderRightColor: [['border-right-color'], 'colors', false],
  borderBottomColor: [['border-bottom-color'], 'colors', false],
  borderLeftColor: [['border-left-color'], 'colors', false],
  borderXColor: [['border-left-color', 'border-right-color'], 'colors', false],
  borderYColor: [['border-top-color', 'border-bottom-color'], 'colors', false],
  outlineColor: [['outline-color'], 'colors', false],
  caretColor: [['caret-color'], 'colors', false],
  accentColor: [['accent-color'], 'colors', false],
  fill: [['fill'], 'colors', false],
  stroke: [['stroke'], 'colors', false],
  textDecorationColor: [['text-decoration-color'], 'colors', false],
  rounded: [
    [
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius'
    ],
    'radii',
    true
  ],
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
  zIndex: [['z-index'], 'zIndex', false],
  opacity: [['opacity'], 'opacity', false],
  borderWidth: [
    ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
    'borderWidths',
    true
  ],
  borderTopWidth: [['border-top-width'], 'borderWidths', true],
  borderBottomWidth: [['border-bottom-width'], 'borderWidths', true],
  flexDir: [['flex-direction'], null, false],
  // space-between-children utilities, resolved against spacing
  spaceX: [['margin-inline-start'], 'spacing', true, ' > :not([hidden]) ~ :not([hidden])'],
  spaceY: [['margin-block-start'], 'spacing', true, ' > :not([hidden]) ~ :not([hidden])']
}

// standard CSS property names (kebab) outside the shorthand table. Strict
// mode uses this to catch typos like paddin or colr while still allowing
// any real CSS property to pass through as a raw declaration
const KNOWN_CSS_PROPS = new Set(
  `display position overflow overflow-x overflow-y visibility cursor pointer-events user-select
flex flex-basis flex-direction flex-wrap flex-grow flex-shrink flex-flow order
justify-content align-items align-content align-self justify-self justify-items
place-items place-content place-self grid-template-columns grid-template-rows grid-template-areas
grid-column grid-row grid-area grid-auto-flow grid-auto-columns grid-auto-rows
object-fit object-position aspect-ratio box-sizing
transform transform-origin transform-style translate rotate scale perspective
transition transition-property transition-duration transition-delay transition-timing-function
animation animation-name animation-duration animation-delay animation-timing-function
animation-iteration-count animation-direction animation-fill-mode animation-play-state animation-timeline
filter backdrop-filter mix-blend-mode background-blend-mode isolation clip-path
background background-color background-image background-size background-position
background-repeat background-attachment row-gap column-gap
scroll-margin-top scroll-margin-right scroll-margin-bottom scroll-margin-left
scroll-padding-top scroll-padding-right scroll-padding-bottom scroll-padding-left
background-clip background-origin border-style border-top-style border-right-style
border-bottom-style border-left-style border-inline-style border-block-style
border-top border-right border-bottom border-left border-inline border-block
border-color border-top-color border-right-color border-bottom-color border-left-color
border-width border-top-width border-right-width border-bottom-width border-left-width
border border-radius outline outline-style outline-width outline-offset
text-align text-decoration text-decoration-line text-decoration-style text-decoration-thickness
text-transform text-overflow text-wrap text-wrap-mode text-wrap-style white-space word-break
overflow-wrap hyphens writing-mode direction unicode-bidi vertical-align text-indent
text-underline-offset text-underline-position text-emphasis text-shadow text-rendering
list-style list-style-type list-style-position list-style-image
table-layout border-collapse border-spacing empty-cells caption-side
resize appearance touch-action scroll-behavior scroll-snap-type scroll-snap-align
scroll-snap-stop overscroll-behavior overscroll-behavior-x overscroll-behavior-y
contain content-visibility will-change content counter-reset counter-increment counter-set
columns column-count column-width column-gap column-rule column-rule-width column-span
break-inside break-before break-after orphans widows tab-size quotes
color-scheme forced-color-adjust print-color-adjust color-interpolation
stroke-width stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin
stroke-miterlimit fill-rule clip-rule fill-opacity stroke-opacity flood-color flood-opacity
stop-color stop-opacity marker-start marker-mid marker-end paint-order
dominant-baseline text-anchor alignment-baseline baseline-shift
font-style font-variant font-variant-caps font-variant-numeric font-kerning
font-feature-settings font-variation-settings font-optical-sizing font-stretch font-size-adjust
min-width min-height max-width max-height width height
inline-size block-size min-inline-size min-block-size max-inline-size max-block-size
margin-inline margin-inline-start margin-inline-end margin-block margin-block-start margin-block-end
padding-inline padding-inline-start padding-inline-end padding-block padding-block-start padding-block-end
inset-inline inset-inline-start inset-inline-end inset-block inset-block-start inset-block-end
scroll-margin-inline scroll-margin-block scroll-padding-inline scroll-padding-block
scroll-timeline scroll-timeline-name view-timeline view-timeline-name timeline-scope
mask mask-image mask-size mask-position mask-repeat mask-clip mask-mode mask-composite
shape-outside shape-margin shape-image-threshold float clear zoom
offset offset-path offset-distance offset-rotate offset-anchor anchor-name anchor-scope
position-anchor position-area position-try field-sizing interpolate-size
overlay transition-behavior backdrop-filter grid-template`.split(/\s+/)
)

function isKnownProp(prop) {
  if (prop in PROPS) return true
  if (prop.startsWith('--') || prop.startsWith('-')) return true
  return KNOWN_CSS_PROPS.has(kebab(prop))
}

function kebab(s) {
  return s.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase())
}

// scan for calls to these names
const FN_NAMES = [
  'css',
  'cx',
  'atoms',
  'flex',
  'stack',
  'vstack',
  'hstack',
  'grid',
  'center',
  'wrap'
]

function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i)
  return 's' + (h >>> 0).toString(36)
}

function cap(s) {
  return s[0].toUpperCase() + s.slice(1)
}
function dashName(s) {
  return s.replaceAll('.', '-').replaceAll('_', '-')
}

// token leaf may be a raw value or { value: raw } or a conditional
// { value: { base, _dark, md, ... } }
function tokenBaseValue(leaf) {
  if (leaf && typeof leaf === 'object' && 'value' in leaf) {
    const v = leaf.value
    if (v && typeof v === 'object') return v.base ?? v._light ?? ''
    return v
  }
  return leaf
}

function flattenTokens(tokens) {
  // { colors: { sig: { accent: 'x' } } } -> { colors: { 'sig.accent': 'x' } }
  const out = {}
  for (const [category, group] of Object.entries(tokens ?? {})) {
    const flat = {}
    const walk = (obj, path) => {
      for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object' && !('value' in v)) walk(v, path ? path + '.' + k : k)
        else flat[path ? path + '.' + k : k] = v
      }
    }
    walk(group ?? {}, '')
    out[category] = flat
  }
  return out
}

// token leafs whose { value } is a conditional object -> list of
// [category, name, { cond: value }] for variable overrides
function conditionalTokens(tokens) {
  const out = []
  for (const [category, group] of Object.entries(tokens ?? {})) {
    const walk = (obj, path) => {
      for (const [k, v] of Object.entries(obj)) {
        const name = path ? path + '.' + k : k
        if (v && typeof v === 'object' && 'value' in v) {
          if (v.value && typeof v.value === 'object') {
            const conds = { ...v.value }
            delete conds.base
            if (Object.keys(conds).length) out.push([category, name, conds])
          }
        } else if (v && typeof v === 'object') walk(v, name)
      }
    }
    walk(group ?? {}, '')
  }
  return out
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function negate(v) {
  return /^\d/.test(v) ? '-' + v : `calc(${v} * -1)`
}

// resolve opacity modifier accent/50 against the color category
function resolveColorValue(raw, flat, vars, varPrefix) {
  const s = String(raw)
  const slash = s.lastIndexOf('/')
  if (slash === -1) return null
  const name = s.slice(0, slash)
  const pct = s.slice(slash + 1)
  if (!/^\d{1,3}$/.test(pct)) return null
  const table = flat.colors
  if (!table || !(name in table)) return null
  const base = vars ? `var(--${varPrefix}-colors-${dashName(name)})` : tokenBaseValue(table[name])
  return `color-mix(in srgb, ${base} ${pct}%, transparent)`
}

// props not in the table still resolve tokens: the kebab-cased name
// picks a category by convention so paddingTop: '4' and pt: '4' emit
// the same atom
function categorize(prop) {
  if (PROPS[prop]) return PROPS[prop]
  const k = kebab(prop)
  let cat = null
  if (/margin|padding|inset|^gap$|-gap|^top$|^right$|^bottom$|^left$/.test(k)) cat = 'spacing'
  else if (/radius/.test(k)) cat = 'radii'
  else if (/color|background|^fill$|^stroke$|caret|accent|^outline$|decoration/.test(k))
    cat = 'colors'
  else if (/width|height|^size$|flex-basis|^aspect/.test(k)) cat = 'sizes'
  else if (/shadow/.test(k)) cat = 'shadows'
  else if (/font-size/.test(k)) cat = 'fontSizes'
  else if (/font-weight/.test(k)) cat = 'fontWeights'
  else if (/font/.test(k)) cat = 'fonts'
  else if (/line-height/.test(k)) cat = 'lineHeights'
  else if (/letter-spacing/.test(k)) cat = 'letterSpacings'
  else if (/z-index/.test(k)) cat = 'zIndex'
  else if (/opacity/.test(k)) cat = 'opacity'
  else if (/border/.test(k)) cat = 'borderWidths'
  const numeric =
    cat === 'spacing' ||
    cat === 'sizes' ||
    cat === 'radii' ||
    cat === 'borderWidths' ||
    cat === 'fontSizes' ||
    cat === 'letterSpacings'
  return [[k], cat, numeric]
}

// turn a raw value for prop into a list of [cssProp, value, important]
// atoms. One css call can emit several atoms per prop.
function resolveAtoms(prop, raw, flat, vars, varPrefix) {
  const entry = categorize(prop)
  const props = entry[0]
  const category = entry[1]
  const numeric = entry[2]
  let value = String(raw)
  let important = false
  if (value.endsWith('!')) {
    important = true
    value = value.slice(0, -1)
  }
  if (category === 'colors') {
    const mixed = resolveColorValue(value, flat, vars, varPrefix)
    if (mixed != null) return props.map((p) => [p, mixed, important])
  }
  let out
  if (value.length > 2 && value.startsWith('[') && value.endsWith(']')) {
    out = value.slice(1, -1).replaceAll('_', ' ')
  } else {
    let negative = false
    if (value.startsWith('-')) {
      negative = true
      value = value.slice(1)
    }
    const table = category ? flat[category] : null
    let hit = null
    let hitCat = category
    if (table && value in table) hit = table[value]
    else if (category === 'sizes' && flat.spacing && value in flat.spacing) {
      hit = flat.spacing[value]
      hitCat = 'spacing'
    }
    if (hit != null) {
      const varName = `--${varPrefix}-${hitCat}-${dashName(value)}`
      out = vars ? `var(${varName})` : String(tokenBaseValue(hit))
      if (negative) out = vars ? `calc(${out} * -1)` : negate(out)
    } else {
      out = value
      if (numeric && out !== '0' && /^\d+(\.\d+)?$/.test(out)) out += 'px'
      if (negative) out = /^[\d.]/.test(out) ? '-' + out : `calc(${out} * -1)`
    }
  }
  return props.map((p) => [p, out, important])
}

// walk a style object emitting [condKey, prop, rawValue] triples.
// condKey is a ':'-joined chain of condition names.
function walkStyles(obj, cond, out, ctx) {
  for (const [key, value] of Object.entries(obj)) {
    if (value == null || value === false) continue
    if (isConditionKey(key, ctx)) {
      if (isPlainObject(value)) walkStyles(value, cond + key + '\x1f', out, ctx)
      continue
    }
    if (key === 'textStyle' || key === 'layerStyle') {
      const map = key === 'textStyle' ? ctx.textStyles : ctx.layerStyles
      const entry = map?.[value]
      if (entry && isPlainObject(entry)) walkStyles(entry, cond, out, ctx)
      continue
    }
    if (isPlainObject(value)) {
      for (const [bp, v] of Object.entries(value)) {
        if (v == null || v === false) continue
        const c = bp === 'base' ? cond : cond + bp + '\x1f'
        out.push([c, key, v])
      }
      continue
    }
    out.push([cond, key, value])
  }
}

// a key is a condition when it is a known _condition, a breakpoint, a
// custom condition name, an arbitrary & selector or an @-rule
function isConditionKey(key, ctx) {
  if (key in ctx.breakpoints) return true
  if (key in ctx.conditions) return true
  if (key[0] === '_') return true
  if (key.includes('&')) return true
  if (key[0] === '@') return true
  return false
}

function buildConditions(config, breakpoints) {
  // containers map becomes _cq<Name> conditions emitting @container rules
  const conditions = { ...SELECTOR_CONDITIONS, ...MEDIA_CONDITIONS }
  for (const [name, size] of Object.entries(config.containers ?? {})) {
    conditions['_cq' + cap(name)] = `@container (min-width: ${size})`
  }
  for (const [name, template] of Object.entries(config.conditions ?? {})) {
    conditions[name] = template
  }
  return { conditions, breakpoints }
}

// expand a ':'-joined condition key into a selector + at-rule wrappers
function expandCond(condKey, cls, ctx) {
  let selector = '.' + cls
  const wrappers = []
  let bpIndex = -1
  const unknown = []
  for (const c of condKey ? condKey.slice(0, -1).split('\x1f') : []) {
    if (c in ctx.breakpoints) {
      wrappers.push(`@media (min-width: ${ctx.breakpoints[c]})`)
      bpIndex = Math.max(bpIndex, Object.keys(ctx.breakpoints).indexOf(c))
    } else if (c in ctx.conditions) {
      const t = ctx.conditions[c]
      if (t[0] === '@') wrappers.push(t)
      else selector = t.replaceAll('&', selector)
    } else if (c.includes('&')) {
      selector = c.replaceAll('&', selector)
    } else if (c[0] === '@') {
      wrappers.push(c)
    } else {
      unknown.push(c)
    }
  }
  return { selector, wrappers, bpIndex, unknown }
}

// universal CSS keywords are valid in any property domain, so a token
// table entry named 'none' or 'auto' must not make the raw keyword a
// cross-domain violation
const CSS_KEYWORDS = new Set([
  'auto',
  'none',
  'normal',
  'inherit',
  'initial',
  'unset',
  'revert',
  'revert-layer',
  'currentcolor',
  'transparent',
  'solid',
  'dashed',
  'dotted',
  'hidden',
  'visible',
  'static',
  'relative',
  'absolute',
  'fixed',
  'sticky',
  'block',
  'inline',
  'inline-block',
  'flex',
  'grid',
  'contents',
  'center',
  'start',
  'end',
  'baseline',
  'stretch',
  'left',
  'right',
  'bold',
  'medium',
  'wrap',
  'nowrap',
  'row',
  'column',
  'pointer',
  'default',
  'contain',
  'cover',
  'fill',
  'both',
  'ease',
  'linear',
  'infinite',
  'forwards',
  'backwards',
  'alternate'
])

// strict-mode validation for a single prop/value pair. Catches typo'd
// props and tokens referenced across domains (color: 'sm' where sm is a
// fontSizes token). Legit raw values like 'red' or 'auto' pass silently.
function checkStyleValue(prop, raw, flat, problems, at) {
  if (!isKnownProp(prop)) {
    problems.push(`${at}: unknown style prop "${prop}"`)
    return
  }
  const category = categorize(prop)[1]
  if (!category) return
  let v = String(raw).replace(/!$/, '')
  if (v.startsWith('-')) v = v.slice(1)
  if (!/^[a-zA-Z][\w.-]*$/.test(v) || CSS_KEYWORDS.has(v.toLowerCase())) return
  const table = flat[category]
  if (table && v in table) return
  if (category === 'sizes' && flat.spacing && v in flat.spacing) return
  for (const [cat, t] of Object.entries(flat)) {
    if (cat !== category && t && v in t) {
      problems.push(`${at}: "${v}" is a ${cat} token, not valid for ${prop} (${category})`)
      return
    }
  }
}

function compileStyles(obj, ctx, flat, vars, varPrefix, at = '') {
  const triples = []
  walkStyles(obj, '', triples, ctx)
  const rules = []
  for (const [condKey, prop, raw] of triples) {
    if (ctx.strict) checkStyleValue(prop, raw, flat, ctx.problems, at)
    const entry = categorize(prop)
    const selSuffix = entry && entry[3] ? entry[3] : ''
    for (const [cssProp, value, imp] of resolveAtoms(prop, raw, flat, vars, varPrefix)) {
      const decl = imp ? `${cssProp}:${value} !important` : `${cssProp}:${value}`
      const cls = hash(condKey + selSuffix + cssProp + '=' + value + (imp ? '!' : ''))
      const { selector, wrappers, bpIndex, unknown } = expandCond(condKey, cls, ctx)
      rules.push({
        cls,
        selector: selector + selSuffix,
        decl,
        wrappers,
        bpIndex,
        unknown,
        at
      })
    }
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

// like extractCalls but keeps the call site so provenance and error
// messages can point at file:line
export function extractCallsDetailed(src, names = FN_NAMES) {
  const re = new RegExp(`\\b(${names.join('|')})\\s*\\(`, 'g')
  const found = []
  let m
  while ((m = re.exec(src))) {
    const lit = extractLiteral(src, m.index + m[0].length)
    if (!lit) continue
    try {
      const value = new Function(`"use strict"; return (${lit.text})`)()
      found.push({ fn: m[1], value, index: m.index, line: lineOf(src, m.index) })
    } catch {
      // literal references runtime values; not statically analyzable
    }
  }
  return found
}

function lineOf(src, index) {
  let line = 1
  for (let i = 0; i < index; i++) if (src[i] === '\n') line++
  return line
}

export function extractCalls(src, names = FN_NAMES) {
  return extractCallsDetailed(src, names).map((c) => c.value)
}

const PREFLIGHT = `*,*::before,*::after{box-sizing:border-box}
html{line-height:1.5;-webkit-text-size-adjust:100%}
body{margin:0}
figure,fieldset,blockquote,dl,dd,h1,h2,h3,h4,h5,h6,p,pre{margin:0}
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

// style objects used inside recipes: base plus every variant option and
// compound css, gathered per slot name (or the recipe root)
function recipeStyleObjects(def, slots) {
  const out = []
  const push = (slot, obj) => {
    if (obj && isPlainObject(obj)) out.push([slot, obj])
  }
  const collect = (styles) => {
    if (!styles) return
    if (slots) for (const s of slots) push(s, styles[s])
    else push('', styles)
  }
  collect(def.base)
  for (const variant of Object.values(def.variants ?? {})) {
    for (const styles of Object.values(variant)) collect(styles)
  }
  for (const cv of def.compoundVariants ?? []) collect(cv.css)
  return out
}

// compile every atom a recipe can emit so the generated runtime only
// picks from classes that exist in styles.css
function compileRecipes(config, ctx, flat, vars, varPrefix) {
  const rules = []
  const spec = []
  for (const [name, def] of Object.entries(config.recipes ?? {})) {
    for (const [, obj] of recipeStyleObjects(def, null)) {
      rules.push(...compileStyles(obj, ctx, flat, vars, varPrefix))
    }
    spec.push([name, def, null])
  }
  for (const [name, def] of Object.entries(config.slotRecipes ?? {})) {
    for (const [, obj] of recipeStyleObjects(def, def.slots ?? [])) {
      rules.push(...compileStyles(obj, ctx, flat, vars, varPrefix))
    }
    spec.push([name, def, def.slots ?? []])
  }
  return { rules, spec }
}

// @property syntax per token category. Registered custom properties
// interpolate during transitions instead of snapping, so animating a
// token (accent color, spacing) actually tweens
const PROPERTY_SYNTAX = {
  colors: '<color>',
  spacing: '<length-percentage>',
  sizes: '<length-percentage>',
  radii: '<length-percentage>',
  borderWidths: '<length>',
  fontSizes: '<length>',
  letterSpacings: '<length>',
  opacity: '<number>',
  zIndex: '<integer>',
  lineHeights: '<number> | <length-percentage>',
  fontWeights: '<number>'
}

function propertyValueOk(syntax, v) {
  if (/[()]/.test(v)) return false
  if (syntax === '<integer>') return /^-?\d+$/.test(v)
  if (syntax.startsWith('<number>'))
    return /^-?[\d.]+(%|[a-z]+)?$/.test(v) || /^-?[\d.]+(px|r?em|ch|ex|%)?$/.test(v)
  if (syntax.startsWith('<length'))
    return /^-?[\d.]+(px|r?em|ch|ex|vh|vw|vmin|vmax|svh|lvh|dvh|cqw|cqh|%)?$/.test(v)
  return true
}

// @property blocks for token variables whose values are literal enough
// to declare an initial-value for
function emitProperties(config, flat) {
  const prefix = config.varPrefix ?? 's'
  const out = []
  for (const [cat, table] of Object.entries(flat)) {
    const syntax = PROPERTY_SYNTAX[cat]
    if (!syntax) continue
    for (const [name, leaf] of Object.entries(table)) {
      const v = String(tokenBaseValue(leaf)).trim()
      if (!propertyValueOk(syntax, v)) continue
      out.push(
        `@property --${prefix}-${cat}-${dashName(name)}{syntax:'${syntax}';inherits:true;initial-value:${v}}`
      )
    }
  }
  return out.join('\n')
}

function emitVariables(config, flat, ctx) {
  const lines = []
  const varOf = (cat, name) => `--${config.varPrefix ?? 's'}-${cat}-${dashName(name)}`
  const root = []
  for (const [cat, table] of Object.entries(flat)) {
    for (const [name, leaf] of Object.entries(table)) {
      root.push(`${varOf(cat, name)}:${tokenBaseValue(leaf)}`)
    }
  }
  if (root.length) lines.push(`:root{${root.join(';')}}`)
  // conditional token values override the variable in their context
  for (const [cat, name, conds] of conditionalTokens(config.tokens)) {
    for (const [cond, value] of Object.entries(conds)) {
      const { wrappers } = expandCond(cond + '\x1f', 'x', ctx)
      const t = ctx.conditions[cond]
      const decl = `${varOf(cat, name)}:${tokenBaseValue(value)}`
      if (t && t[0] === '@') lines.push(`${t}{:root{${decl}}}`)
      else if (cond in ctx.breakpoints)
        lines.push(`@media (min-width: ${ctx.breakpoints[cond]}){:root{${decl}}}`)
      else if (t) {
        // selector conditions apply the variable on the scoped element
        const sel = t.replace(/&/g, '').trim() || ':root'
        lines.push(`${sel}{${decl}}`)
      } else if (cond.includes('&')) {
        lines.push(`${cond.replace(/&/g, '').trim() || ':root'}{${decl}}`)
      }
      void wrappers
    }
  }
  return lines.join('\n')
}

function emitKeyframes(keyframes) {
  const out = []
  for (const [name, steps] of Object.entries(keyframes ?? {})) {
    const body = Object.entries(steps)
      .map(([step, styles]) => {
        const decls = Object.entries(styles)
          .map(([p, v]) => `${kebab(p)}:${v}`)
          .join(';')
        return `${step}{${decls}}`
      })
      .join('')
    out.push(`@keyframes ${name}{${body}}`)
  }
  return out.join('\n')
}

// files matching config.include, posix-relative to cwd alongside the
// absolute path so provenance can report readable locations
export function sourceFiles(config, cwd = process.cwd()) {
  const include = config.include ?? ['./src/**/*.{ts,js,svelte}']
  const res = include.map((g) => globToRe(g.replace(/^\.\//, '')))
  return listFiles(cwd)
    .filter((f) => {
      const rel = relative(cwd, f).split('\\').join('/')
      return res.some((r) => r.test(rel))
    })
    .map((f) => ({ abs: f, rel: relative(cwd, f).split('\\').join('/') }))
}

// strict-mode validation of recipe call sites: chip({ tone: 'accnet' })
// is reported instead of silently producing no variant styles
function checkRecipeCalls(config, src, rel, problems) {
  const defs = { ...(config.recipes ?? {}), ...(config.slotRecipes ?? {}) }
  const names = Object.keys(defs)
  if (!names.length) return
  for (const call of extractCallsDetailed(src, names)) {
    const def = defs[call.fn]
    const variants = def.variants ?? {}
    const at = `${rel}:${call.line}`
    for (const [k, v] of Object.entries(call.value)) {
      if (!(k in variants)) {
        problems.push(`${at}: ${call.fn}() has no variant "${k}"`)
      } else if (!(String(v) in variants[k])) {
        problems.push(
          `${at}: ${call.fn}() variant "${k}" has no option "${v}" (have: ${Object.keys(variants[k]).join(', ')})`
        )
      }
    }
  }
}

export function compile(config, cwd = process.cwd(), files = sourceFiles(config, cwd)) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...config.breakpoints }
  const vars = config.cssVariables !== false
  const varPrefix = config.varPrefix ?? 's'
  const ctx = {
    breakpoints,
    conditions: buildConditions(config, breakpoints).conditions,
    textStyles: config.textStyles ?? {},
    layerStyles: config.layerStyles ?? {},
    strict: !!config.strict,
    problems: []
  }
  const flat = flattenTokens(config.tokens)

  const seen = new Map()
  const warned = new Set()
  const provenance = {}
  const pushRules = (rules) => {
    for (const rule of rules) {
      if (rule.unknown.length) {
        for (const c of rule.unknown) {
          if (ctx.strict) ctx.problems.push(`${rule.at}: unknown condition "${c}"`)
          else if (!warned.has(c)) {
            warned.add(c)
            console.warn(`sigil css: unknown condition ${c}, styles under it were skipped`)
          }
        }
        continue
      }
      if (!seen.has(rule.cls)) {
        seen.set(rule.cls, rule)
        if (rule.at) {
          const i = rule.at.lastIndexOf(':')
          provenance[rule.cls] = {
            f: rule.at.slice(0, i),
            l: Number(rule.at.slice(i + 1)),
            d: rule.decl,
            s: rule.selector,
            w: rule.wrappers
          }
        }
      }
    }
  }
  for (const file of files) {
    const src = readFileSync(file.abs, 'utf8')
    for (const call of extractCallsDetailed(src)) {
      pushRules(compileStyles(call.value, ctx, flat, vars, varPrefix, `${file.rel}:${call.line}`))
    }
    if (ctx.strict) checkRecipeCalls(config, src, file.rel, ctx.problems)
  }
  const { rules: recipeRules } = compileRecipes(config, ctx, flat, vars, varPrefix)
  pushRules(recipeRules)

  const rules = [...seen.values()].sort((a, b) => a.bpIndex - b.bpIndex)
  const blocks = []
  for (const r of rules) {
    const rule = `${r.selector}{${r.decl}}`
    blocks.push(r.wrappers.length ? `${r.wrappers.join('')}{${rule}}` : rule)
  }

  const layered = config.layers !== false
  const base = []
  if (config.preflight !== false) base.push(PREFLIGHT.trimEnd())
  if (vars) base.push(emitVariables(config, flat, ctx))
  const kf = emitKeyframes(config.keyframes)
  if (kf) base.push(kf)

  let pretty
  if (layered) {
    const prop = emitProperties(config, flat)
    pretty =
      '@layer base, components, utilities;\n' +
      (prop ? prop + '\n' : '') +
      `@layer base {\n${base.join('\n')}\n}\n` +
      `@layer utilities {\n${blocks.join('\n')}\n}\n`
  } else {
    pretty = base.join('\n') + '\n' + blocks.join('\n') + '\n'
  }
  const css = config.minify ? minifyCss(pretty) : pretty
  return {
    css,
    count: rules.length,
    files: files.length,
    problems: ctx.problems,
    provenance
  }
}

// conservative whitespace and comment stripper. Leaves + and / alone so
// calc() and color functions stay valid
export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

function tsUnion(values) {
  const keys = Object.keys(values ?? {})
  if (!keys.length) return 'string'
  return keys.map((k) => `'${k}'`).join(' | ') + ' | (string & {})'
}

function generateDts(config, flat, ctx) {
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
    'zIndex',
    'opacity',
    'borderWidths'
  ]
  const unions = cats.map((c) => `type ${cap(c)} = ${tsUnion(flat[c])}`)
  const bps = ['base', ...Object.keys(ctx.breakpoints)].map((b) => `'${b}'`).join(' | ')
  const catOf = (name) => (PROPS[name] ? PROPS[name][1] : null)
  const lines = Object.keys(PROPS).map((p) => {
    const cat = catOf(p)
    const t = cat ? cap(cat) : 'string'
    return `  ${JSON.stringify(p)}?: ResponsiveValue<${t}>`
  })
  const textStyleKeys = tsUnion(config.textStyles ?? {})
  const layerStyleKeys = tsUnion(config.layerStyles ?? {})
  lines.push(`  "textStyle"?: ${textStyleKeys}`)
  lines.push(`  "layerStyle"?: ${layerStyleKeys}`)
  const conds = Object.keys(ctx.conditions)
  const condLines = conds.map((c) => `  ${JSON.stringify(c)}?: StyleObject`)
  const bpLines = Object.keys(ctx.breakpoints).map((b) => `  ${JSON.stringify(b)}?: StyleObject`)
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
export declare function atoms(...styles: Array<StyleObject | false | null | undefined>): string
export declare function cx(...classes: Array<string | false | null | undefined>): string
`
}

function recipeDts(config) {
  const propOf = (def) => {
    const entries = Object.entries(def.variants ?? {}).map(
      ([name, options]) =>
        `    ${JSON.stringify(name)}?: ${Object.keys(options)
          .map((k) => JSON.stringify(k))
          .join(' | ')} | undefined`
    )
    return entries.length ? `{\n${entries.join('\n')}\n  }` : 'Record<string, never>'
  }
  const lines = []
  for (const [name, def] of Object.entries(config.recipes ?? {})) {
    lines.push(
      `type ${cap(name)}Props = ${propOf(def)}`,
      `export declare function ${name}(props?: ${cap(name)}Props): string`
    )
  }
  for (const [name, def] of Object.entries(config.slotRecipes ?? {})) {
    const slots = (def.slots ?? []).map((s) => JSON.stringify(s)).join(' | ')
    lines.push(
      `type ${cap(name)}Props = ${propOf(def)}`,
      `export declare function ${name}(props?: ${cap(name)}Props): Record<${slots || 'string'}, string>`
    )
  }
  return `// generated by sigil-ui css. do not edit.\n${lines.join('\n')}\n`
}

// the generated runtime resolves atoms through the very same functions
// the compiler uses, so class names can never drift apart
function generateRuntime(config, ctx, flat) {
  const vars = config.cssVariables !== false
  const varPrefix = config.varPrefix ?? 's'
  const shared = [
    isPlainObject,
    kebab,
    dashName,
    tokenBaseValue,
    negate,
    resolveColorValue,
    categorize,
    resolveAtoms
  ]
    .map(String)
    .join('\n')
  return `// generated by sigil-ui css. do not edit.
const BPS = new Set(${JSON.stringify(Object.keys(ctx.breakpoints))})
const CONDS = new Set(${JSON.stringify(Object.keys(ctx.conditions))})
const PROPS = ${JSON.stringify(PROPS)}
const FLAT = ${JSON.stringify(flat)}
const TEXT = ${JSON.stringify(config.textStyles ?? {})}
const LAYER = ${JSON.stringify(config.layerStyles ?? {})}
const VARS = ${vars}
const PREFIX = ${JSON.stringify(varPrefix)}
function hash(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i)
  return 's' + (h >>> 0).toString(36)
}
const isObj = isPlainObject
function isCond(k) {
  return k[0] === '_' || k[0] === '@' || k.includes('&') || BPS.has(k) || CONDS.has(k)
}
${shared}
function walk(obj, cond, out) {
  for (const k in obj) {
    const v = obj[k]
    if (v == null || v === false) continue
    if (isCond(k)) {
      if (isObj(v)) walk(v, cond + k + '\x1f', out)
      continue
    }
    if (k === 'textStyle' || k === 'layerStyle') {
      const entry = (k === 'textStyle' ? TEXT : LAYER)[v]
      if (entry && isObj(entry)) walk(entry, cond, out)
      continue
    }
    if (isObj(v)) {
      for (const b in v) {
        const val = v[b]
        if (val == null || val === false) continue
        pushAtom(out, cond + (b === 'base' ? '' : b + '\x1f'), k, val)
      }
      continue
    }
    pushAtom(out, cond, k, v)
  }
}
function pushAtom(out, cond, prop, raw) {
  const entry = categorize(prop)
  const sel = entry[3] || ''
  for (const [p, v, imp] of resolveAtoms(prop, raw, FLAT, VARS, PREFIX)) {
    out.set(cond + sel + p, hash(cond + sel + p + '=' + v + (imp ? '!' : '')))
  }
}
export function atoms(...styles) {
  const out = new Map()
  for (const s of styles) if (s && typeof s === 'object') walk(s, '', out)
  return [...out.values()].join(' ')
}
export const css = atoms
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
`
}

function recipeRuntime(config) {
  const recipes = []
  for (const [name, def] of Object.entries(config.recipes ?? {})) {
    recipes.push(`export const ${name} = makeRecipe(${JSON.stringify(def)}, null)`)
  }
  for (const [name, def] of Object.entries(config.slotRecipes ?? {})) {
    recipes.push(
      `export const ${name} = makeRecipe(${JSON.stringify(def)}, ${JSON.stringify(def.slots ?? [])})`
    )
  }
  if (!recipes.length) return null
  return `// generated by sigil-ui css. do not edit.
import { atoms } from '../css/index.mjs'
function makeRecipe(def, slots) {
  const apply = (props) => {
    const merged = { ...(def.defaultVariants ?? {}), ...(props ?? {}) }
    const pick = []
    if (def.base) pick.push(def.base)
    for (const [name, options] of Object.entries(def.variants ?? {})) {
      const chosen = merged[name]
      if (chosen != null && options[chosen]) pick.push(options[chosen])
    }
    for (const cv of def.compoundVariants ?? []) {
      const { css: extra, ...conds } = cv
      const match = Object.entries(conds).every(([k, v]) => merged[k] === v)
      if (match && extra) pick.push(extra)
    }
    return pick
  }
  if (!slots) return (props) => atoms(...apply(props))
  return (props) => {
    const picked = apply(props)
    const out = {}
    for (const slot of slots) {
      out[slot] = atoms(...picked.map((s) => (s && s[slot]) || undefined))
    }
    return out
  }
}
${recipes.join('\n')}
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

// per-component style blocks extracted from the library at package
// build time. { Button: '.sig-btn{...}...', ... }
export function loadComponentParts(cwd = process.cwd()) {
  const candidates = []
  try {
    const req = createRequire(join(cwd, 'sigil-resolve.cjs'))
    candidates.push(req.resolve('sigil-ui/css-parts.json'))
  } catch {
    // package not resolvable from cwd; fall through to engine-relative
  }
  try {
    candidates.push(new URL('../dist/css-parts.json', import.meta.url))
  } catch {
    // import.meta.url may not be a file url under dev servers
  }
  for (const c of candidates) {
    try {
      if (existsSync(c)) return JSON.parse(readFileSync(c, 'utf8'))
    } catch {
      continue
    }
  }
  return null
}

// component names imported from 'sigil-ui' across the scanned sources.
// Returns 'all' for namespace imports since usage is unknowable
export function detectComponents(files) {
  const names = new Set()
  const re = /import\s+([\s\S]*?)\s+from\s+['"]sigil-ui['"]/g
  for (const file of files) {
    const src = readFileSync(file.abs, 'utf8')
    for (const m of src.matchAll(re)) {
      const clause = m[1].trim()
      if (clause.startsWith('type ')) continue
      if (clause.startsWith('*')) return 'all'
      const inner = clause.match(/\{([\s\S]*)\}/)?.[1]
      if (!inner) continue
      for (const part of inner.split(',')) {
        const name = part
          .trim()
          .split(/\s+as\s+/)[0]
          .trim()
        if (name && !name.startsWith('type ')) names.add(name)
      }
    }
  }
  return names
}

// resolve config.components ('auto' | string[]) into the subset of
// library component CSS the project actually uses
export function resolveComponentCss(config, files, parts = loadComponentParts()) {
  const wanted = config.components
  if (!wanted) return null
  if (!parts) {
    throw new Error(
      'css-parts.json not found. Run the sigil-ui build (or reinstall) so component styles exist.'
    )
  }
  const lookup = new Map(Object.keys(parts).map((k) => [k.toLowerCase(), k]))
  let names
  if (wanted === 'auto') {
    const detected = detectComponents(files)
    names = detected === 'all' ? Object.keys(parts) : [...detected]
  } else {
    names = Array.isArray(wanted) ? wanted : [wanted]
  }
  const resolved = []
  const unknown = []
  for (const n of names) {
    const key = lookup.get(String(n).toLowerCase())
    if (key) resolved.push(key)
    else unknown.push(n)
  }
  const css = resolved.map((k) => parts[k]).join('\n')
  const layered = config.layers !== false
  const body =
    `/* tree-shaken sigil-ui component styles: ${resolved.join(', ')} */\n` +
    (layered ? `@layer components {\n${css}\n}\n` : css + '\n')
  return { names: resolved, unknown, css: body }
}

// all generated outputs as relPath -> content, in memory. build() writes
// them, checkBuild() diffs them against disk for the stale-output guard
export function renderAll(config, cwd = process.cwd()) {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...config.breakpoints }
  const ctx = {
    breakpoints,
    conditions: buildConditions(config, breakpoints).conditions,
    textStyles: config.textStyles ?? {},
    layerStyles: config.layerStyles ?? {}
  }
  const flat = flattenTokens(config.tokens)
  const files = sourceFiles(config, cwd)
  const { css, count, problems, provenance } = compile(config, cwd, files)

  const outputs = new Map()
  outputs.set('styles.css', css)
  outputs.set('styles.min.css', config.minify ? css : minifyCss(css))
  outputs.set('styles.map.json', JSON.stringify(provenance, null, 1) + '\n')
  outputs.set('css/index.mjs', generateRuntime(config, ctx, flat))
  outputs.set('css/index.d.ts', generateDts(config, flat, ctx))
  const pats = generatePatterns()
  outputs.set('patterns/index.mjs', pats.js)
  outputs.set('patterns/index.d.ts', pats.dts)
  const rec = recipeRuntime(config)
  if (rec) {
    outputs.set('recipes/index.mjs', rec)
    outputs.set('recipes/index.d.ts', recipeDts(config))
  }
  const comp = resolveComponentCss(config, files)
  if (comp && comp.names.length) outputs.set('components.css', comp.css)
  return { outputs, count, sourceCount: files.length, problems, components: comp }
}

export function build(config, cwd = process.cwd()) {
  const outdir = resolve(cwd, config.outdir ?? 'styled-system')
  const { outputs, count, sourceCount, problems, components } = renderAll(config, cwd)
  const keep = new Set(outputs.keys())
  let changed = 0

  // remove files the render no longer emits, leave directories alone
  if (existsSync(outdir)) {
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name)
        if (e.isDirectory()) {
          walk(p)
        } else if (!keep.has(relative(outdir, p))) {
          rmSync(p)
          changed++
        }
      }
    }
    walk(outdir)
  }

  // skip writes when the content is identical so watchers stay quiet
  for (const [rel, content] of outputs) {
    const target = join(outdir, rel)
    if (existsSync(target) && readFileSync(target, 'utf8') === content) continue
    mkdirSync(join(target, '..'), { recursive: true })
    writeFileSync(target, content)
    changed++
  }
  return { count, files: sourceCount, outdir, problems, components, changed }
}

// stale-output guard for CI: regenerates everything and reports which
// emitted files differ from (or are missing on) disk
export function checkBuild(config, cwd = process.cwd()) {
  const outdir = resolve(cwd, config.outdir ?? 'styled-system')
  const { outputs, problems } = renderAll(config, cwd)
  const stale = []
  for (const [rel, content] of outputs) {
    const target = join(outdir, rel)
    if (!existsSync(target) || readFileSync(target, 'utf8') !== content) stale.push(rel)
  }
  return { stale, outdir, problems }
}

// provenance lookup for --explain. Searches styles.map.json first, then
// the library component parts for sig-* classes
export function explain(cls, outdir) {
  const name = cls.replace(/^\./, '')
  const mapPath = join(outdir, 'styles.map.json')
  if (existsSync(mapPath)) {
    const map = JSON.parse(readFileSync(mapPath, 'utf8'))
    const hit = map[name]
    if (hit) {
      const at = hit.w?.length ? ` inside ${hit.w.join(' ')}` : ''
      return `${hit.s} { ${hit.d} }${at}\n  from ${hit.f}:${hit.l}`
    }
  }
  const parts = loadComponentParts()
  if (parts) {
    for (const [comp, css] of Object.entries(parts)) {
      if (css.includes('.' + name)) return `.${name} is a sigil-ui ${comp} class (components.css)`
    }
  }
  return null
}
