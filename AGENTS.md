# AGENTS.md

sigil-ui is a Svelte 5 (runes) component library. It is CSS framework
agnostic: components apply stable `sig-*` classes, consume the `--sig-*`
CSS variable contract, and merge a `class` prop, so Tailwind v4, UnoCSS,
Panda CSS or plain CSS can all theme the same components. All behavior is
implemented in-house on runes; there are zero runtime dependencies.

## Commands

- `pnpm install`
- `pnpm dev` — demo playground (src/demo, plain Vite app)
- `pnpm build` — svelte-package src/lib to dist plus dist/manifest.json
- `pnpm check` — svelte-check, fails on warnings (authoritative gate)
- `pnpm check:tsgo` — svelte-check on the TypeScript 7 native sidecar
- `pnpm lint` / `pnpm format` / `pnpm format:check`
- `pnpm test` — vitest + testing-library on jsdom
- `pnpm test:coverage` — same with v8 thresholds on src/lib
- `pnpm pack:check` — publint on the packed artifact
- `pnpm llms` — regenerate site/public/llms.txt and llms-full.txt from the
  manifest (requires `pnpm build` first)
- `pnpm -F sigil-site build` — build the docs/showcase site to site/dist
- `node bin/sigil.mjs <cmd>` — the CLI (list, docs, tokens, adapters,
  manifest, doctor); needs `pnpm build` first

## Layout

- `src/lib/<component>/` — one dir per component: `*.svelte` plus an
  `index.ts` barrel
- `src/lib/manifest.ts` — single source of truth for component, token and
  adapter metadata. The CLI, llms.txt and dist/manifest.json all derive
  from it, and tests enforce that it stays in sync with the source
- `src/lib/theme/sigil.css` — default `--sig-*` values, light and dark
- `src/lib/theme/tailwind.css` — Tailwind v4 `@theme inline` bridge
- `src/lib/uno.ts`, `src/lib/panda.ts` — adapter presets, exported as
  `sigil-ui/uno` and `sigil-ui/panda`
- `css/engine.mjs` — the bundled build-time atomic CSS engine, exported
  as `sigil-ui/css` and driven by `sigil-ui css`. It scans source files
  for style calls, resolves config tokens to `--s-*` custom properties,
  and emits styled-system/ (styles.css plus a typed self-contained
  css() runtime, patterns, and recipe/slot-recipe functions). The
  generated runtime embeds the same resolver functions the compiler
  uses so emitted classes and runtime classes always match
- `src/lib/theme/theme.svelte.ts` — `createTheme()` rune store
- `src/lib/toast/toast.svelte.ts` — global toast store plus the `toast` API
- `src/lib/pane/` — resizable split panes: pane-group, pane, pane-resizer,
  shared context in ctx.ts
- `src/lib/utils/focus.ts` — focus trap helpers used by Dialog
- `src/lib/utils/inspect.ts` — layout inspection: findOverflows, measure,
  tagOverflows, consumed by Measure and GridOverlay
- `src/lib/utils/cn.ts` — class merging (clsx-compatible ClassValue)
- `src/lib/utils/persisted.svelte.ts` — localStorage-backed reactive
  state with cross-tab storage-event sync
- `src/tests/` — vitest suites; shared component harnesses live in
  `src/tests/fixtures/`
- `bin/sigil.mjs` — zero-dependency CLI shipped in the package
- `site/` — docs and showcase site, deployed to GitHub Pages. It is
  styled by the bundled engine via site/sigil.config.mjs; the generated
  `styled-system/` is gitignored and rebuilt by `pnpm -C site codegen`

## Rules

- Runes only: `$props`, `$state`, `$derived`, `$effect`, `$bindable`,
  snippets. Never `export let` or `$:` statements.
- Components apply `sig-*` classes through `cn()` and style them in
  `:global()` blocks. The class names are a public styling API; do not
  scoped-hash them and do not rename them casually.
- Every color, radius and shadow goes through `var(--sig-*, fallback)`.
  No raw color literals in components.
- A new component means: new dir under src/lib, barrel export in
  src/lib/index.ts, manifest entry, tests, and a demo section. The
  manifest test fails if classes or tokens are undocumented.
- `svelte` stays a peer dependency and the only one. There are zero
  runtime dependencies. Do not add a primitive or utility library;
  implement behavior with runes, DOM APIs and shared context like
  dialog/ctx.ts or pane/ctx.ts.
- typescript stays on 6.x for svelte-check and typescript-eslint;
  @typescript/native is the sidecar only.
- Dependencies are pinned exactly and must be at least 7 days old
  (pnpm-workspace.yaml enforces it). Do not weaken install hardening
  (strictDepBuilds, blockExoticSubdeps, trustPolicy, no hoisting) to make
  anything pass.
- Plain ASCII prose: no em dashes, no en dashes as punctuation, no emojis,
  no semicolons in comments, no curly quotes. Comments name identifiers
  without backticks.

## Testing expectations

- Component tests use @testing-library/svelte on jsdom with
  `createRawSnippet` for children props and fixtures for compound
  components.
- jsdom does not suppress clicks on disabled buttons; assert
  `toBeDisabled()` instead of absence of the handler call.
- Coverage thresholds live in vite.config.ts and are a merge gate, not a
  target to game. Write tests that verify behavior, not coverage.
