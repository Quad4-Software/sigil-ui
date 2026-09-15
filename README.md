# sigil-ui

Svelte 5 (runes) components that do not care about your CSS framework.
Every component applies stable sig-* classes, consumes a --sig-* CSS
variable contract, and merges a class prop. Tailwind v4, UnoCSS, Panda
CSS and plain CSS all theme the same components. Runtime deps are runed
and clsx, nothing else.

## Install

    pnpm add sigil-ui

```ts
import 'sigil-ui/theme.css' // default tokens, optional
import { Button, Toaster, toast } from 'sigil-ui'
```

Without theme.css everything still works; every token has a fallback.
Override any --sig-* variable to retheme at once. Dark mode follows
[data-theme="dark"], prefers-color-scheme, or createTheme().

## Components

Primitives: Button, Badge, Switch, Input, Select, Checkbox, Avatar,
Progress, Skeleton, Separator, Tooltip, Alert, Stat.

Namespaces: Dialog, Card, Tabs, Accordion. Each ships Root plus named
parts (Dialog.Root, Card.Header, Tabs.Trigger, Accordion.Item, ...).

Toasts: mount Toaster once, then call toast.success('Saved') and friends
from anywhere.

Panes: PaneGroup, Pane, PaneResizer give accessible resizable splits with
pointer drag, arrow keys, min/max constraints and optional layout
persistence via autoSaveId.

All of it forwards native attributes and events, traps focus where
required, wires aria relationships, and honors reduced motion.

## Framework adapters

- Tailwind v4: import sigil-ui/tailwind.css after the tailwindcss import.
- UnoCSS: sigilPreset from sigil-ui/uno.
- Panda CSS: sigilPreset from sigil-ui/panda.
- Plain CSS: sigil-ui/theme.css or your own --sig-* values.

## For agents

- npx sigil-ui docs Button prints props, classes and an example.
- import { manifest } from 'sigil-ui' or fetch sigil-ui/manifest.json.
- llms.txt and llms-full.txt live at the site root.
- Skills install with npx skills add Quad4-Software/sigil-ui.

## Develop

    pnpm install
    pnpm dev            # demo playground
    pnpm build          # svelte-package to dist + manifest.json
    pnpm check          # svelte-check, fails on warnings
    pnpm test:coverage  # vitest on jsdom with coverage gates

See AGENTS.md for the contributor contract.

License: 0BSD. Copyright Quad4 Software.
