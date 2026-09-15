---
name: sigil-ui
description: Consume sigil-ui components in a Svelte 5 project. Use when installing the library, wiring the theme, or styling components with Tailwind v4, UnoCSS, Panda CSS or plain CSS.
---

# Using sigil-ui

sigil-ui is a Svelte 5 runes component library that is CSS framework
agnostic. Every component applies stable `sig-*` classes, consumes the
`--sig-*` CSS variable contract, and merges a `class` prop. Zero runtime
dependencies; svelte is the only peer.

## Install

    pnpm add sigil-ui
    import 'sigil-ui/theme.css'        // default token values, optional
    import { Button } from 'sigil-ui'

Without theme.css the components still work; every var has a fallback.
Provide your own `--sig-*` values to theme.

## Components

- Primitives: Button, Badge, Switch, Toggle, Input, Textarea, Select,
  Checkbox, Slider, Avatar, Progress, Skeleton, Spinner, Separator,
  Tooltip, Alert, Stat, Kbd, Empty, Field (label + hint + error wiring,
  children snippet receives control props), ScrollArea, Pagination,
  CountUp, CopyButton, Reveal (IntersectionObserver scroll-in).
- Namespaces: Dialog (Root, Trigger, Portal, Overlay, Content, Title,
  Description, Close), Sheet (same parts, Content takes
  side: left/right/top/bottom), Card (Root, Header, Title, Description,
  Content, Footer), Tabs (Root, List, Trigger, Content), Accordion
  (Root, Item, Trigger, Content), RadioGroup (Root, Item), Breadcrumb
  (Root, Item), Popover (Root, Trigger, Content), DropdownMenu (Root,
  Trigger, Content, Item, Separator), ContextMenu (Root wraps the
  trigger area; Content is the viewport-clamped menu), Table (Root,
  Head, Body, Row, H, Cell, Caption), Command (Root, Input, List,
  Item, Group, Empty, Separator, Dialog), Combobox (Root, Input,
  Content, Item, Empty).
- Data: DataTable (columns/rows generics, sortable headers with
  aria-sort, selectable rows, filter input, sticky header) and
  Pagination (bind:page, sibling windowing).
- Charts: Chart.Line (multi-series), Chart.Bar, Chart.Area,
  Chart.Sparkline, Chart.Donut, Chart.Gauge. Pure SVG, role=img,
  native tooltips, token-driven colors.
- Overlays: Toaster plus the `toast` API
  (`toast(title, opts)`, `toast.success/info/warning/danger`, action
  buttons, `duration`, `toast.dismiss(id)`).
- Layout: PaneGroup, Pane, PaneResizer for resizable splits
  (`direction`, `autoSaveId`, `defaultSize`/`minSize`/`maxSize` percent).
- Dev tools: Measure (live px size badge via ResizeObserver),
  GridOverlay (spacing grid plus overflow outlines), and the
  `findOverflows` / `measure` / `tagOverflows` exports for programmatic
  layout checks.

## Component usage rules

- Props come from `$props()`; bindable state uses `bind:` (`bind:checked`
  on Switch, `bind:open` on Dialog.Root, `bind:value` on Tabs.Root,
  Input and Select).
- Content goes through children snippets: `<Button>Save</Button>` or
  `{#snippet}` for structured slots like Tooltip trigger props.
- Style hooks: pass `class` (merged, never replaces `sig-*`), or target
  `data-variant`, `data-tone`, `data-state`, `data-direction` attributes
  in CSS.
- Toast: mount `<Toaster />` once near the app root, then call
  `toast.success('Saved')` from anywhere. danger and warning announce
  assertively (role=alert), the rest politely (role=status).
- Panes: PaneResizer is a focusable separator. Arrow keys resize by
  keyboardStep percent (default 5). autoSaveId persists the layout.
- Menus and popovers: `bind:open` on Root, Trigger carries the aria
  wiring, Content takes `side` and `align`. Escape and outside pointer
  down close them and restore focus. DropdownMenu items take `onSelect`
  and navigate with arrows plus Home/End.
- Layout debugging: wrap a subtree in `<GridOverlay overflow>` to
  outline elements whose content leaks or clips, or call
  `findOverflows()` / `measure(el)` directly in tests and tools.

## Vanilla usage, no framework

Two entry points cover plain HTML and JavaScript:

- `sigil-ui/components.css` is every component's stylesheet extracted
  to flat classes. Write the documented markup
  (`<button class="sig-btn" data-variant="primary">`) and it looks
  identical to the Svelte output.
- `sigil-ui/headless` is the behavior layer: attachTabs,
  attachAccordion, attachRadioGroup, attachSwitch, attachPaneGroup,
  attachTooltip, createOverlay, createPopover, createMenu,
  createToaster, createTheme, and attachAll(root) which wires every
  recognized structure under a node. The controllers produce the same
  roles, aria attributes and data-state values as the Svelte parts.

## Theming by framework

Pick one. All five produce the same result.

- sigil css: the bundled build-time atomic engine, zero dependencies.
  Create sigil.config.mjs with `defineConfig` from `sigil-ui/css`, run
  `npx sigil-ui css` (`--watch` for rebuilds), then import `{ css }`,
  patterns (`flex`, `stack`, `grid`, `hstack`, `center`, `wrap`) and
  recipes from the generated styled-system/. Style calls must be
  literal objects: the compiler extracts them statically. Tokens emit
  as `--s-<category>-<name>` custom properties so themes can switch at
  runtime. Features: conditions (`_hover`, `_dark`, `_focusVisible`,
  `_open`, `_expanded`, `_checked`, `_disabled`, `_groupHover`,
  `_peerChecked`, `_rtl`, `_motionReduce`, breakpoint keys,
  `@media`/`@container`/`@supports` keys, arbitrary `&` selector keys
  like `'&:has(> img)'`, custom conditions in config), per-property
  responsive values (`{ base: '4', md: '8' }`), arbitrary values
  (`w: '[300px]'`, underscores become spaces), important suffix
  (`p: '4!'`), token opacity (`bg: 'accent/50'`), negative spacing
  (`mt: '-4'`), `spaceX`/`spaceY`, `textStyle`/`layerStyle`, keyframes,
  `defineRecipe`/`defineSlotRecipe` in config. `css(a, b)` merges left
  to right: later args and later object keys win. Unknown values pass
  through as raw CSS.
- Tailwind v4: `@import 'sigil-ui/tailwind.css'` after the tailwindcss
  import. Utilities: `bg-sig-accent`, `text-sig-fg`, `border-sig-border`,
  `rounded-sig`, `shadow-sig`.
- UnoCSS: `import { sigilPreset } from 'sigil-ui/uno'` and add it to the
  presets array after a wind preset.
- Panda CSS: `import { sigilPreset } from 'sigil-ui/panda'` and add it to
  presets in panda.config.ts. Tokens become `sig.accent`, `sig.fg`, etc.
- Plain CSS: `import 'sigil-ui/theme.css'` then override `--sig-*` vars.
  Dark mode activates on `[data-theme="dark"]` or prefers-color-scheme.

## Dark mode

Use `createTheme` from the root export. Call it during component init:

    const theme = createTheme()               // persists to localStorage
    theme.mode = 'dark'                       // 'light' | 'dark' | 'system'
    theme.resolved                            // 'light' | 'dark'
    theme.toggle()

It stamps `data-theme` on `<html>` and syncs across tabs.

## Agent-facing tooling

- `npx sigil-ui docs <Component>` prints props, classes and an example.
- `npx sigil-ui tokens` prints the full `--sig-*` contract.
- `npx sigil-ui theme [name]` lists or prints accent presets shipped
  under `sigil-ui/themes/*`.
- `npx sigil-ui doctor` audits a project for setup gaps.
- `import { manifest } from 'sigil-ui'` or fetch `sigil-ui/manifest.json`
  for structured component metadata.
- The site serves llms.txt and llms-full.txt at its root.

## Gotchas

- The library is runes-only. Consuming apps must run Svelte 5.
- `class` on components accepts clsx-style values (string, array,
  record), not only strings.
- Compound namespaces throw if their parts are used outside their Root.
- Dialog locks body scroll and traps focus while open; keep Dialog
  content inside Portal for correct layering.
