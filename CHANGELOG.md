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

### Fixed

- `sig-pane` is a column flex container so nested `PaneGroup`s fill correctly
- `sig-pane-group` no longer forces unoverridable 100% sizes, which broke utility-class sizing

## 0.0.0

Initial development version. Svelte 5 runes components, `sig-*` class contract, `--sig-*` tokens, Tailwind v4 / UnoCSS / Panda / vanilla adapters, `sigil css` build-time atomic engine, agent-facing manifest and CLI.
