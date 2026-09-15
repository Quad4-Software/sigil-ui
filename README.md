# sigil-ui

A component library and a CSS framework in one zero-dependency
package. The component side ships 60+ accessible Svelte 5 components
built on runes, with framework-free headless controllers so the same
sig-* markup also runs in React, Vue, Solid or plain HTML. The CSS
side is a styling contract (sig-* classes over --sig-* tokens) plus
sigil css, a bundled build-time atomic engine. Tailwind v4, UnoCSS,
Panda CSS and plain CSS all plug into the same contract.

> [!WARNING]
> This project is still alpha level framework/library and being actively worked on.

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
Loader, Separator, Tooltip, Alert, Stat, Kbd, Empty, Breadcrumb,
Field, ScrollArea, Pagination, CountUp, CopyButton, Reveal,
AspectRatio, AvatarGroup, TagsInput, FileUpload, Tree, Presence,
Marquee, NumberInput, PinInput, Rating, Editable, Waveform,
LikeButton, Prose.

Compound namespaces, each shipping Root plus named parts: Dialog,
AlertDialog, Sheet, Card, Tabs, Accordion, Popover, HoverCard,
DropdownMenu, ContextMenu, Menubar, Table, Command, Combobox,
ToggleGroup, Timeline, Stepper, Carousel. Command.Dialog is a Cmd+K
palette out of the box.

Charts (Chart.Line/Bar/Area/Scatter/Radar/Heatmap/Sparkline/Donut/
Gauge/Waterfall/Funnel/Gantt) are pure SVG with role=img and native
tooltips. Chart.Uptime renders status-page pill bars for latency
series with an uptime summary, Chart.Waterfall renders running-total
bridges with up, down and total columns, and Chart.Funnel/Gantt cover
conversion stages and schedules. Waveform renders voice-note amplitude
bars with click or arrow-key seeking, or pass a MediaStream /
AnalyserNode to fill bars live for recording UIs. DataTable adds
sorting, row selection, filtering and a sticky header.

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

components.css ships every component's styles as plain classes,
base.css adds optional bare-element resets (nav, pre, code, details,
links, role=button, role=group, aria-busy spinners), and
sigil-ui/headless ships framework-free controllers that wire behavior
to the same markup: tabs, accordions, radios, checkboxes, switches,
toggles, sliders, tags, file uploads, pagination, trees, number and
pin inputs, ratings, editables, carousels, panes, tooltips, hover
cards, overlays, popovers, menus and toasts. The controllers are
plain DOM JavaScript, so they run in React, Vue, Solid or a static
page.

```html
<link rel="stylesheet" href="sigil-ui/theme.css" />
<link rel="stylesheet" href="sigil-ui/base.css" />
<link rel="stylesheet" href="sigil-ui/components.min.css" />
<script type="module">
  import { attachAll } from 'sigil-ui/headless'
  attachAll(document)
</script>
```

base.css also themes scrollbars, selection, headings, mark, abbr,
tables and sub/sup, and ships a sig-prose class for long-form
typography (headings, lists, blockquotes, tables, figures) with
sig-prose-sm, sig-prose-lg and sig-prose-invert variants.

## CDN

The cdn/ directory is committed at every tag, so jsdelivr and
statically can serve it straight from GitHub. sigil.min.css bundles
theme + base + components.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/Quad4-Software/sigil-ui@master/cdn/sigil.min.css"
/>
<script type="module">
  import { attachAll } from 'https://cdn.jsdelivr.net/gh/Quad4-Software/sigil-ui@master/cdn/headless/index.js'
  attachAll(document)
</script>
```

Swap cdn.jsdelivr.net/gh for cdn.statically.io/gh to use statically.
Pin a tag for immutable caching. Individual sheets live at
cdn/theme.css, cdn/base.css and cdn/components.min.css, and
cdn/demo.html is a working kitchen-sink page proving the whole path.
GitHub releases also attach the built sheets and manifest.json for a
two-curl vendored install.

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
npx sigil-ui css init   # write a starter sigil.config.mjs
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
npx sigil-ui doctor --contrast   # plus WCAG contrast on --sig-* pairs
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
