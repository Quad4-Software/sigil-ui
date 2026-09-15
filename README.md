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

theme.css supplies default token values. Without it the components
still render; every --sig-* variable has a fallback. Override the
variables to retheme everything at once. Dark mode follows
[data-theme="dark"], prefers-color-scheme, or createTheme().

## Components

Primitives: Button, Badge, Switch, Toggle, Input, Textarea, Select,
Checkbox, RadioGroup, Slider, Avatar, Progress, Skeleton, Spinner,
Separator, Tooltip, Alert, Stat, Kbd, Empty, Breadcrumb, Field.

Compound namespaces, each shipping Root plus named parts: Dialog,
Sheet, Card, Tabs, Accordion, Popover, DropdownMenu, Table.

Toasts: mount Toaster once, then call from anywhere:

```ts
toast.success('Saved')
toast.danger('Deploy failed', { description: 'Rollback started' })
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

Layout inspection for humans and agents: Measure reports live element
size, GridOverlay draws a spacing grid and outlines overflowing
elements, and findOverflows() / measure() / tagOverflows() are
exported for programmatic checks.

All components forward native attributes and events, trap focus where
required, wire aria relationships, and honor reduced motion.

## Styling adapters

```
import 'sigil-ui/theme.css'      // plain CSS token defaults
import 'sigil-ui/tailwind.css'   // Tailwind v4 @theme bridge
```

```ts
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
```

```ts
import { css } from '../styled-system/css'

const card = css({
  p: '4',
  bg: 'surface',
  rounded: 'md',
  _hover: { bg: 'surface-hover' },
  md: { p: '6' }
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
```

```ts
import { manifest } from 'sigil-ui'
// or fetch sigil-ui/manifest.json
```

llms.txt and llms-full.txt are served at the site root. Skills install
with:

```
npx skills add Quad4-Software/sigil-ui
```

## Develop

```
pnpm install
pnpm dev             # demo playground
pnpm check           # svelte-check, fails on warnings
pnpm test:coverage   # vitest with coverage gates
pnpm build           # svelte-package to dist/
```

See AGENTS.md for the contributor contract.

## License

0BSD. Copyright Quad4 Software.
