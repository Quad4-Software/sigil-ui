# Changelog

## Unreleased

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

### Fixed

- `Timeline` rail no longer stops short of the next dot; the connector is now a dashed line spanning the item gap
- `sig-pane` is a column flex container so nested `PaneGroup`s fill correctly
- `sig-pane-group` no longer forces unoverridable 100% sizes, which broke utility-class sizing

## 0.0.0

Initial development version. Svelte 5 runes components, `sig-*` class contract, `--sig-*` tokens, Tailwind v4 / UnoCSS / Panda / vanilla adapters, `sigil css` build-time atomic engine, agent-facing manifest and CLI.
