---
name: sigil-ui-dev
description: Develop sigil-ui itself. Use when adding components, changing the token contract, editing the manifest, or extending the CLI in the sigil-ui repo.
---

# Developing sigil-ui

Read AGENTS.md for commands and layout. This skill is the contribution
checklist.

## Adding a component

1. Create `src/lib/<name>/<name>.svelte` plus `index.ts` barrel.
2. Props interface: extend the matching `svelte/elements` attribute type.
   Declare `class` merging via `cn('sig-<name>', className)`. Bindable
   props need `$bindable()`. There is no primitive library dependency:
   compound components share state through a ctx.ts module like
   dialog/ctx.ts or pane/ctx.ts.
3. Style in a `:global(.sig-*)` block, every value through
   `var(--sig-*, fallback)`. State selectors use data attributes
   (`data-variant`, `data-state`, `data-tone`).
4. Export from `src/lib/index.ts`. Namespaces export as
   `export * as Name from './name/index.js'`.
5. Add a manifest entry: props, classes, data attributes, example. The
   manifest test fails if a documented class never appears in source or a
   `--sig-*` token in theme.css is undocumented.
6. Write tests in `src/tests/<name>.test.ts`. Compound components get a
   fixture under `src/tests/fixtures/`.
7. Add a demo section in `src/demo/App.svelte` and the site.
8. Run `pnpm check && pnpm lint && pnpm test:coverage && pnpm build`.

## Token contract changes

`src/lib/theme/sigil.css` is the source of truth for values;
`src/lib/manifest.ts` tokens array is the source of truth for docs.
Changing one without the other fails `manifest.test.ts`. When adding a
token also update `tailwind.css`, `uno.ts` and `panda.ts`; the adapter
tests iterate the manifest so coverage gaps surface there.

## CLI

`bin/sigil.mjs` is zero-dependency Node and reads `dist/manifest.js`.
New commands go in the switch at the bottom; update the HELP text and the
llms-full CLI section is generated automatically from the manifest, so
describe the command in HELP only.

## Releases

Tags `v*` trigger publish.yml: npm (OIDC trusted publishing when
NPM_TOKEN is unset, token path when set) and GitHub Packages (name
rewritten to `@<owner>/sigil-ui`). Built stylesheets and manifest.json
attach to the GitHub release. Bump `version` in package.json and
manifest.ts together before tagging.

## Benchmarks

`pnpm -F sigil-bench bench` regenerates site/src/bench.ts (median of 5
runs: cold, warm, change rebuild, CSS size, deps, install size, peak
RSS, config lines, composite score). `pnpm -F sigil-bench bench:browser`
loads the built site and cdn/demo.html in Chromium and writes
site/src/browser.ts with request, transfer and timing metrics. Both
generated files are prettier-ignored.
