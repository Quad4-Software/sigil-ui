# sigil-ui

A component library for Svelte 5 and plain HTML. Svelte parts are
built on runes with zero runtime dependencies; the same designs work
without a framework through stable sig-* classes and headless
controllers. Everything consumes a --sig-* CSS variable contract, so
Tailwind v4, UnoCSS, Panda CSS, the bundled sigil css engine, or
plain CSS all theme the same components.

## Install

```
pnpm add sigil-ui
```

```svelte
<script>
  import 'sigil-ui/theme.css'
  import { Button, Toaster, toast } from 'sigil-ui'
</script>

<Button onclick={() => toast.success('Saved')}>Save</Button>
<Toaster />
```

theme.css supplies default token values. Without it components still
render; every --sig-* variable has a fallback. Dark mode follows
[data-theme="dark"], prefers-color-scheme, or createTheme().

## Components

Primitives: Button, Badge, Switch, Toggle, Input, Textarea, Select,
Checkbox, RadioGroup, Slider, Avatar, Progress, Skeleton, Spinner,
Separator, Tooltip, Alert, Stat, Kbd, Empty, Breadcrumb, Field,
ScrollArea, Pagination, CountUp, CopyButton, Reveal, AspectRatio,
AvatarGroup, TagsInput, FileUpload, Tree, Presence, Marquee.

Compound namespaces, each shipping Root plus named parts: Dialog,
AlertDialog, Sheet, Card, Tabs, Accordion, Popover, HoverCard,
DropdownMenu, ContextMenu, Menubar, Table, Command, Combobox,
ToggleGroup, Timeline, Stepper. Command.Dialog is a Cmd+K palette
out of the box.

Charts (Chart.Line/Bar/Area/Scatter/Radar/Heatmap/Sparkline/Donut/
Gauge) are pure SVG with role=img and native tooltips. Chart.Uptime
renders status-page pill bars for latency series with an uptime
summary. DataTable adds sorting, row selection, filtering and a
sticky header.

Toasts: mount Toaster once, then call from anywhere:

```ts
toast.success('Saved')
toast.danger('Deploy failed')
```

Resizable panes: pointer drag, keyboard resizing on a focusable
separator, min/max constraints, optional layout persistence.

```svelte
<PaneGroup direction="horizontal" autoSaveId="editor">
  <Pane defaultSize={30} minSize={20}>Sidebar</Pane>
  <PaneResizer />
  <Pane>Content</Pane>
</PaneGroup>
```

Layout inspection: Measure reports live element size, GridOverlay
draws a spacing grid and outlines overflows, and findOverflows() /
measure() / tagOverflows() are exported for programmatic checks.

All components forward native attributes and events, trap focus where
required, wire aria relationships, and honor reduced motion.

## Without Svelte

components.css ships every component's styles as plain classes, and
sigil-ui/headless ships framework-free controllers that wire behavior
to the same markup: tabs, accordions, radios, switches, overlays,
popovers, menus, tooltips, panes and toasts.

```html
<link rel="stylesheet" href="sigil-ui/theme.css" />
<link rel="stylesheet" href="sigil-ui/components.min.css" />
<script type="module">
  import { attachAll } from 'sigil-ui/headless'
  attachAll(document)
</script>
```

## Styling adapters

```ts
import 'sigil-ui/theme.css' // plain CSS token defaults
import 'sigil-ui/tailwind.css' // Tailwind v4 @theme bridge
import { sigilPreset } from 'sigil-ui/uno' // UnoCSS preset
import { sigilPreset } from 'sigil-ui/panda' // Panda preset
```

## sigil css

A build-time, type-safe atomic CSS engine is included and has no
dependencies of its own. Define tokens in sigil.config.mjs, run the
codegen, and use the generated css() function. The compiler scans
source files for style calls and emits one atomic stylesheet.

```
npx sigil-ui css        # generate styled-system/ and styles.css
npx sigil-ui css --watch
npx sigil-ui css --minify   # styles.css minified; styles.min.css is always written
npx sigil-ui css --strict   # fail on unknown props, wrong-domain tokens, bad recipes
npx sigil-ui css --check    # CI guard: fails when styled-system/ is stale
npx sigil-ui css --components auto   # tree-shaken sigil-ui component styles
npx sigil-ui css --explain s2abc     # which source line produced an atom
```

`components: 'auto'` (or `--components Button,Dialog`) emits
styled-system/components.css holding only the sigil-ui component styles
your imports use, so plain-CSS consumers ship kilobytes instead of the
full bundle. Output lands in `@layer base/components/utilities` so your
own CSS overrides predictably, and token variables are registered with
`@property` where the value allows it, so they interpolate in
transitions. `strict: true` in the config turns silent typos
(`paddin`, `color: 'md'`, `chip({ tone: 'accnet' })`) into build errors.

```ts
import { css } from '../styled-system/css'
import { flex } from '../styled-system/patterns'
import { chip } from '../styled-system/recipes'

const card = css(
  { p: '4', bg: 'surface', rounded: 'md' },
  { _hover: { bg: 'surface-hover' }, md: { p: '6' }, w: '[300px]' }
)
```

Tokens emit as `--s-*` custom properties so themes can switch at
runtime. Conditions (`_hover`, `_dark`, `_open`, `_peerChecked`,
`_groupHover`, breakpoint keys like `md`, `@media`/`@container`
keys, arbitrary `&` selector keys), per-property responsive objects,
arbitrary values, important suffixes, token opacity (`accent/50`),
keyframes, recipes and slot recipes are all supported. Later
arguments win on conflicts.

## Theming

Every component reads the `--sig-*` contract, so one variable override
rethemes the library. `createTheme({ accent: '#e11d48' })` sets the
accent and derives hover, ring and the primary chart color.
`--sig-chart-1` through `--sig-chart-5` color every chart series, and
`--sig-accent-muted` is an accent tint that follows the accent
automatically. Five accent presets ship under `sigil-ui/themes/`; list
them with `npx sigil-ui theme`.

## For agents

```
npx sigil-ui list           # component index
npx sigil-ui docs Button    # props, classes, example
npx sigil-ui tokens         # the --sig-* contract
npx sigil-ui doctor         # audit a consumer project
npx sigil-ui theme          # list or print accent presets
```

`import { manifest } from 'sigil-ui'` or fetch `sigil-ui/manifest.json` for
structured metadata. llms.txt is served at the site root, and skills install
with `npx skills add Quad4-Software/sigil-ui`.

## Develop

```
pnpm install
pnpm check           # svelte-check, fails on warnings
pnpm test:coverage   # vitest with coverage gates
pnpm test:e2e        # playwright smoke, real Chromium
pnpm build           # svelte-package to dist/
```

## License

0BSD. Copyright Quad4 Software.
