# Changelog

## Unreleased

### Added

- `Loader`: spinner, dots, bars and pulse indicators in three sizes with `role="status"`
- `Waveform`: voice-note amplitude bars with played-fraction coloring, a playing drift animation, and click or arrow-key seeking via `role="slider"`; `live` accepts a `MediaStream` or `AnalyserNode` and fills bars in real time for recording UIs
- `LikeButton`: heart or star reaction button with `aria-pressed`, optional count and a transform-only pop animation
- `Chart.Waterfall`: running-total bridge columns with up, down and total kinds and dashed connectors
- `Chart.Funnel` and `Chart.Gantt`: trapezoid conversion stages and schedule bars
- `Prose`: long-form typography wrapper around the `sig-prose` class set
- base.css: themed thin scrollbars (WebKit pseudo-elements plus Firefox scrollbar-color), selection, heading margins, mark, abbr, tables, sub/sup, and a `sig-prose` opt-in typography class for long-form content with `sig-prose-sm`, `sig-prose-lg` and `sig-prose-invert` variants
- base.css: `button[aria-busy]` and `[role="button"][aria-busy]` now show an inline spinner even when the button has visible text
- `.sig-table` styles bare `thead`, `th`, `td`, `tbody tr` and `caption` descendants through zero-specificity `:where()` selectors so server-rendered markup needs no part classes
- `--sig-space-0` through `--sig-space-16` spacing tokens in the contract, mapped in the Tailwind, UnoCSS and Panda adapters
- `cdn/` committed at build time: `sigil.min.css` (theme + base + components), individual sheets, the headless modules and `cdn/demo.html`, a kitchen-sink page proving the zero-install path
- `sigil css --init` scaffolds `sigil.config.mjs` and prints next steps (the `init` positional works too)
- `LevelMeter`: segmented VU-style meter with safe, warn and peak zones, a static `value` or live `MediaStream`/`AnalyserNode`, horizontal or vertical
- `StreamingText`: smooth text reveal for AI chat responses with a caret while `streaming`, speed in chars/sec, instant under reduced motion
- `Suggestion`: inline ghost-text completion, `interactive` renders a button that accepts on Tab, ArrowRight, Enter, Space or click and dismisses on Escape
- `ComparisonTable`: feature-grid table rendering check icons for true cells, muted dashes for false and text otherwise, with a highlighted column
- `Waveform` gains `variant` (bars, flat, dots) and `size` (sm, md, lg); dots scale fixed dots so live mode animates transforms only
- base.css: `sig-sr-only` visually-hidden utility
- bench: median of 5 runs, a change-rebuild metric (one file edited), peak build memory via /proc polling, config-line counts, and a composite score; `bench/browser.mjs` measures real Chromium page loads (requests, wire bytes, timings, JS heap) of the docs site and CDN demo
- The site shows a short `ComparisonTable` against the other engines and a real page-load table
- `sigil doctor --contrast` audits `--sig-*` text pairs in both theme scopes against WCAG AA
- npm publish supports OIDC trusted publishing when `NPM_TOKEN` is unset, and GitHub releases attach the built stylesheets and `manifest.json`
- The docs site serves `theme.css`, `base.css`, `components.min.css`, `manifest.json`, `llms.txt` and `llms-full.txt` at stable root paths

### Changed

- `sigil css` writes only files whose content changed and removes stale outputs instead of wiping outdir, so dev watchers stop reloading on no-op builds
- Light-theme `--sig-muted`, `--sig-success` and `--sig-warning` darkened slightly so the guaranteed text pairs pass WCAG AA 4.5:1
- Carousel prev/next buttons now center on the slide viewport instead of the whole carousel including the dots row
- Marquee track runs on the compositor (will-change plus translate3d) so the loop no longer jitters at subpixel steps
- Chart.Heatmap default cell is 17px (was 14) and cell fills transition on data change; Chart.Bar columns and Chart.Uptime pills transition height for live data

## 0.10.0

### Added

- Command palette namespace: `Command.Root`, `Input`, `List`, `Item`, `Group`, `Empty`, `Separator`, and `Command.Dialog` with a mod+k toggle
- `Combobox` namespace: filterable autocomplete with `role="combobox"`, `aria-activedescendant` and listbox semantics
- `ContextMenu` namespace: right-click menu opened at the pointer, viewport-clamped
- `ScrollArea` with thin custom scrollbars and `data-orientation`
- `Chart.Area` (smooth Catmull-Rom curve) and `Chart.Gauge` (semicircle)
- `Chart.Line` multi-series support (`series` prop, palette colors, `legend`), native `<title>` tooltips on dots
- `DataTable`: `selectable` row checkboxes with `bind:selected`, `filterable` search input with `bind:filter`, `stickyHeader`, `rowKey`
- `sigil-ui/headless`: framework-free DOM controllers (dialog, sheet, tabs, accordion, radio, switch, popover, menu, tooltip, panes, toaster, theme) for vanilla HTML/JS
- `sigil-ui/components.css`: every component's `sig-*` styles extracted into a single stylesheet for use without Svelte
- `sigil-ui/themes/*`: accent presets (blue, emerald, orange, rose, violet) and `sigil-ui theme` CLI command
- `sigil-ui css --watch`: rebuild `styled-system/` when sources change
- sigil css: arbitrary values (`w: '[300px]'`), `_groupHover`, `_groupFocus`, `_open`, `_closed` conditions
- sigil css engine rewrite: tokens emit as `--s-*` custom properties for runtime theme switching, longhand atomic classes with last-wins merging across `css()` arguments, recipes and slot recipes via `defineRecipe`/`defineSlotRecipe`, `textStyle`/`layerStyle`, keyframes, custom and container conditions, peer/group/rtl/motion conditions, token opacity modifiers (`accent/50`), `!` important suffix, negative spacing, `spaceX`/`spaceY` logical sibling margins, arbitrary `&` selector and `@`-rule keys
- axe-core accessibility test suite
- `ToggleGroup` namespace: Root (`bind:value`, `type` single or multiple, arrow keys) and Item (`aria-pressed`)
- `HoverCard` namespace: Root (`bind:open`, `openDelay`, `closeDelay`), Trigger, Content
- `TagsInput` (`bind:tags`, Enter/comma adds, Backspace removes, `max`, `duplicates`), `FileUpload` (`bind:files` dropzone), `AspectRatio`, `AvatarGroup` (`items`, `max` with +N overflow)
- `Tree` (`items` nested nodes, `bind:selected`, `bind:expanded`, arrow-key navigation), `Timeline` and `Stepper` namespaces
- `AlertDialog` namespace: `role="alertdialog"` confirmation dialog built on Dialog, with Cancel and Action parts
- `Menubar` namespace: application menubar with arrow-key navigation across menus
- `Chart.Heatmap`, `Chart.Radar` and `Chart.Scatter` visualizations
- `Presence` (enter/exit animation wrapper that holds children mounted while the exit runs) and `Marquee` (seamless loop, `pauseOnHover`)
- `Chart.Uptime`: status-page pill bars for latency series (`warnAt` threshold, explicit `status` per sample, optional uptime/avg summary)
- `sigil-ui/components.min.css`: minified build of the vanilla stylesheet, published alongside `components.css`
- sigil css: `minify` config option and `--minify` CLI flag; `styles.min.css` is emitted on every build
- `Dialog.Root` accepts `onOpenChange`
- sigil css: `strict` config option and `--strict` flag fail the build on unknown style props, tokens referenced across domains (`color: 'md'` where md is a radii token), unknown conditions and invalid recipe variants, with file:line locations
- sigil css: `--check` flag is a CI guard that fails when `styled-system/` output is stale
- sigil css: `--explain <class>` prints the declaration and source location of any atom via the generated `styles.map.json`; `sig-*` classes resolve to their owning component
- sigil css: `--components Button,Dialog` or `components: 'auto'` emits `styled-system/components.css` with only the sigil-ui component styles the project uses; `auto` detects them from `sigil-ui` imports
- sigil css: output is wrapped in `@layer base, components, utilities` so consumer CSS overrides generated rules predictably (`layers: false` opts out)
- sigil css: token variables are registered with `@property` when the value is literal, so colors, lengths and numbers interpolate in transitions
- `--sig-chart-1` through `--sig-chart-5` chart palette tokens, consumed by every Chart series with `--sig-accent` fallbacks
- `--sig-accent-muted` accent tint token derived from `--sig-accent`
- `createTheme({ accent, accentFg })` sets the accent and derives hover, ring and chart-1; `theme.accent` is settable at runtime
- `Stat` renders a neutral `data-dir="flat"` delta for zero changes
- `NumberInput` (`bind:value`, min/max/step, hold-to-repeat buttons), `PinInput` (`bind:value`, per-cell boxes, paste, `mask`), `Rating` (`bind:value`, arrow keys, `readOnly`) and `Editable` (`bind:value`, click to edit, Enter commits, Escape reverts) primitives
- `Carousel` namespace: Root (`bind:index`, `loop`, arrow keys) and Item slides
- `Button` `loading` prop: `aria-busy`, a spinner and disabled interaction
- `sigil-ui/base.css`: optional bare-element resets and semantic styling for nav lists, pre/code/kbd/samp, details/summary, links, `role="button"`, `role="group"`, fieldset/legend, and an `aria-busy="true"` spinner
- headless controllers for checkbox, toggle, toggle-group, slider, tags-input, file-upload, pagination, tree, hover-card, number-input, pin-input, rating, editable and carousel, all wired into `attachAll`
- `bench/` workspace: cross-framework build benchmark (sigil css vs Tailwind v4, UnoCSS, Panda CSS) measuring cold build, CSS output and transitive dependency counts; results feed the site comparison table

### Fixed

- sigil css: `borderLeftColor` and `borderRightColor` were missing from the prop table and the strict-mode allowlist

- `Timeline` rail no longer stops short of the next dot; the connector is now a dashed line spanning the item gap
- `sig-pane` is a column flex container so nested `PaneGroup`s fill correctly
- `sig-pane-group` no longer forces unoverridable 100% sizes, which broke utility-class sizing

## 0.0.0

Initial development version. Svelte 5 runes components, `sig-*` class contract, `--sig-*` tokens, Tailwind v4 / UnoCSS / Panda / vanilla adapters, `sigil css` build-time atomic engine, agent-facing manifest and CLI.
