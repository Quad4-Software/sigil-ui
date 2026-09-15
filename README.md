# sigil-ui

A Svelte 5 component library built on runes, with zero runtime
dependencies. Components apply stable sig-* classes and consume a
--sig-* CSS variable contract, so the same components work with
Tailwind v4, UnoCSS, Panda CSS, the bundled sigil css engine, or
plain CSS.

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
ScrollArea, Pagination, CountUp, CopyButton, Reveal.

Compound namespaces, each shipping Root plus named parts: Dialog,
Sheet, Card, Tabs, Accordion, Popover, DropdownMenu, ContextMenu,
Table, Command, Combobox. Command.Dialog is a Cmd+K palette out of
the box.

Charts (Chart.Line/Bar/Area/Sparkline/Donut/Gauge) are pure SVG with
role=img and native tooltips. DataTable adds sorting, row selection,
filtering and a sticky header.

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
<link rel="stylesheet" href="sigil-ui/components.css" />
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
```

```ts
import { css } from '../styled-system/css'

const card = css({
  p: '4',
  bg: 'surface',
  rounded: 'md',
  _hover: { bg: 'surface-hover' },
  _groupHover: { borderColor: 'accent' },
  md: { p: '6' },
  w: '[300px]' // arbitrary value
})
```

Token names are checked at compile time and surfaced in the generated
types. Values that are not tokens pass through as raw CSS.

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
