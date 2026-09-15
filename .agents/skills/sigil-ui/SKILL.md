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
  CountUp, CopyButton, Reveal (IntersectionObserver scroll-in),
  AspectRatio, AvatarGroup (items + max +N overflow), TagsInput
  (bind:tags, Enter/comma adds, Backspace removes), FileUpload
  (bind:files, dropzone), Tree (items: TreeNode[], bind:selected,
  bind:expanded, arrow-key nav), Presence (show + exit animation),
  Marquee (loop, pauseOnHover), NumberInput, PinInput, Rating,
  Editable (click-to-edit), Carousel (Root + Item, dots, loop),
  Loader (spinner/dots/bars/pulse), LikeButton (heart or star,
  aria-pressed), Prose (long-form typography wrapper),
  StreamingText (AI chat reveal, caret while streaming), Suggestion
  (ghost-text completion, Tab to accept), LevelMeter (segmented VU
  meter, static value or live MediaStream/AnalyserNode), ComparisonTable
  (columns + rows of boolean or text cells, highlight column).
- Namespaces: Dialog (Root, Trigger, Portal, Overlay, Content, Title,
  Description, Close), AlertDialog (Root, Trigger, Content, Title,
  Description, Cancel, Action; role=alertdialog), Sheet (same parts,
  Content takes side: left/right/top/bottom), Card (Root, Header,
  Title, Description, Content, Footer), Tabs (Root, List, Trigger,
  Content), Accordion (Root, Item, Trigger, Content), RadioGroup
  (Root, Item), ToggleGroup (Root, Item; type single or multiple),
  Breadcrumb (Root, Item), Popover (Root, Trigger, Content),
  HoverCard (Root, Trigger, Content; openDelay/closeDelay),
  DropdownMenu (Root, Trigger, Content, Item, Separator), ContextMenu
  (Root wraps the trigger area; Content is the viewport-clamped menu),
  Menubar (Root, Menu, Trigger, Content, Item, Separator), Table
  (Root, Head, Body, Row, H, Cell, Caption), Command (Root, Input,
  List, Item, Group, Empty, Separator, Dialog), Combobox (Root, Input,
  Content, Item, Empty), Timeline (Root, Item: title/description/
  time/tone), Stepper (Root bind:step, Item: title/description).
- Data: DataTable (columns/rows generics, sortable headers with
  aria-sort, selectable rows, filter input, sticky header) and
  Pagination (bind:page, sibling windowing).
- Charts: Chart.Line (multi-series), Chart.Bar, Chart.Area,
  Chart.Scatter, Chart.Radar, Chart.Heatmap, Chart.Sparkline,
  Chart.Donut, Chart.Gauge, Chart.Uptime (status-page pill bars for
  latency series: number[] or { ms, status, label }[], warnAt,
  summary), Chart.Waterfall (running-total bridge), Chart.Funnel
  (conversion stages), Chart.Gantt (schedule bars). Waveform renders
  amplitude bars for audio (static bars or live MediaStream/
  AnalyserNode, variants bars/flat/dots, sizes sm/md/lg). Pure SVG,
  role=img, native tooltips, token-driven colors.
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

Three entry points cover plain HTML and JavaScript:

- `sigil-ui/components.css` (or the minified `components.min.css`) is
  every component's stylesheet extracted to flat classes. Write the
  documented markup
  (`<button class="sig-btn" data-variant="primary">`) and it looks
  identical to the Svelte output.
- `sigil-ui/base.css` is optional bare-element styling: box-sizing
  reset, body tokens, themed thin scrollbars, nav lists,
  pre/code/kbd/samp, details/summary, links, mark, abbr, tables,
  `role="button"`, `role="group"`, fieldset/legend, an
  `aria-busy="true"` spinner (including on buttons with text), a
  `sig-sr-only` visually-hidden utility, and `sig-prose` long-form
  typography with `sig-prose-sm`, `sig-prose-lg` and `sig-prose-invert`
  variants. Everything reads the `--sig-*` contract.
- `sigil-ui/headless` is the behavior layer: attachTabs,
  attachAccordion, attachRadioGroup, attachCheckbox, attachSwitch,
  attachToggle, attachToggleGroup, attachSlider, attachTagsInput,
  attachFileUpload, attachPagination, attachTree, attachNumberInput,
  attachPinInput, attachRating, attachEditable, attachCarousel,
  attachPaneGroup, attachTooltip, createHoverCard, createOverlay,
  createPopover, createMenu, createToaster, createTheme, and
  attachAll(root) which wires every recognized structure under a
  node. Overlays (dialog, sheet, popover, menu) need explicit
  create calls since they pair a trigger with portaled content. The
  controllers produce the same roles, aria attributes and data-state
  values as the Svelte parts.

## Theming by framework

Pick one. All five produce the same result.

- sigil css: the bundled build-time atomic engine, zero dependencies.
  Scaffold a config with `npx sigil-ui css --init`, or write
  sigil.config.mjs by hand with `defineConfig` from `sigil-ui/css`. Run
  `npx sigil-ui css` (`--watch` for rebuilds, `--minify` or
  `minify: true` to minify styles.css; styles.min.css is always
  emitted), then import `{ css }`,
  patterns (`flex`, `stack`, `grid`, `hstack`, `center`, `wrap`) and
  recipes from the generated styled-system/. Style calls must be
  literal objects: the compiler extracts them statically. Tokens emit
  as `--s-<category>-<name>` custom properties so themes can switch at
  runtime. Output is wrapped in `@layer base, components, utilities`
  (`layers: false` opts out) and token vars get `@property`
  registrations when the value is literal, so they interpolate in
  transitions. Features: conditions (`_hover`, `_dark`, `_focusVisible`,
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
- Quality flags: `strict: true` (or `--strict`) fails the build on
  unknown props, tokens referenced across domains (`color: 'md'` where
  md is a radii token), unknown conditions and bad recipe variants.
  `--check` is a CI guard that fails when styled-system/ is stale.
  `--explain <class>` maps an atom back to its source file and line via
  styles.map.json.
- Tree-shaken component styles: `components: 'auto'` in config (or
  `--components Button,Dialog`) emits styled-system/components.css with
  only the sigil-ui styles for the components imported in the scanned
  sources. Plain-CSS consumers can then ship that file instead of the
  full components.css bundle.
- Tailwind v4: `@import 'sigil-ui/tailwind.css'` after the tailwindcss
  import. Utilities: `bg-sig-accent`, `text-sig-fg`, `border-sig-border`,
  `rounded-sig`, `shadow-sig`.
- UnoCSS: `import { sigilPreset } from 'sigil-ui/uno'` and add it to the
  presets array after a wind preset.
- Panda CSS: `import { sigilPreset } from 'sigil-ui/panda'` and add it to
  presets in panda.config.ts. Tokens become `sig.accent`, `sig.fg`, etc.
- Plain CSS: `import 'sigil-ui/theme.css'` then override `--sig-*` vars.
  Dark mode activates on `[data-theme="dark"]` or prefers-color-scheme.
  The contract includes colors, radius, shadow and `--sig-space-0`
  through `--sig-space-16` spacing steps.

## Dark mode

Use `createTheme` from the root export. Call it during component init:

    const theme = createTheme()               // persists to localStorage
    theme.mode = 'dark'                       // 'light' | 'dark' | 'system'
    theme.resolved                            // 'light' | 'dark'
    theme.toggle()
    theme.accent = '#e11d48'                  // retheme: derives hover, ring, chart-1
    // or pass { accent: '#e11d48', accentFg: '#fff' } to createTheme

Chart series read `--sig-chart-1` through `--sig-chart-5` (each falls
back to a semantic token). `--sig-accent-muted` is an accent tint that
follows `--sig-accent` automatically.

It stamps `data-theme` on `<html>` and syncs across tabs.

## Agent-facing tooling

- `npx sigil-ui docs <Component>` prints props, classes and an example.
- `npx sigil-ui tokens` prints the full `--sig-*` contract.
- `npx sigil-ui theme [name]` lists or prints accent presets shipped
  under `sigil-ui/themes/*`.
- `npx sigil-ui doctor` audits a project for setup gaps;
  `--contrast` also checks `--sig-*` text pairs for WCAG AA contrast.
- `cdn/` in the repo holds committed bundles for jsdelivr or
  statically.io: `sigil.min.css` (theme + base + components),
  individual sheets, the headless modules and `demo.html`.
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
