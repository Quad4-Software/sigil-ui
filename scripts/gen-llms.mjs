// Generates llms.txt and llms-full.txt from the packaged manifest into
// site/public so the deployed site serves both at the root. Run after
// pnpm build in the package root.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const outDir = join(root, 'site', 'public')
const { manifest } = await import(join(root, 'dist', 'manifest.js'))

const index = `# sigil-ui

> Svelte 5 (runes) component library. CSS framework agnostic: every component
> consumes the --sig-* CSS variable contract and merges a class prop, so
> Tailwind v4, UnoCSS, Panda CSS or plain CSS can theme it. JS framework
> agnostic: sigil-ui/headless ships framework-free controllers that wire the
> same markup in React, Vue, Solid or plain JS. Zero runtime component
> dependencies. Machine-readable metadata: /manifest.json.

## Docs

- [Full component docs](llms-full.txt): props, classes, data attributes, examples
- [Token contract](#tokens): every --sig-* variable with light and dark defaults
- [Component manifest](manifest.json): structured JSON for agents

## Components

${manifest.components.map((c) => `- ${c.name}: ${c.description.split('.')[0]}.`).join('\n')}

## Adapters

${manifest.adapters.map((a) => `- ${a.name}: ${a.entry}`).join('\n')}

## Install

\`\`\`
pnpm add sigil-ui
import 'sigil-ui/theme.css'
\`\`\`
`

const lines = [
  '# sigil-ui full reference',
  '',
  `package: ${manifest.package} (svelte peer ${manifest.sveltePeer})`,
  `theme entry: ${manifest.themeEntry}`,
  '',
  '## Components'
]

for (const c of manifest.components) {
  lines.push('', `### ${c.name}`, '', c.description, '')
  lines.push('Props:')
  for (const p of c.props) {
    const bits = [p.type]
    if (p.bindable) bits.push('bindable')
    if (p.default) bits.push(`default ${p.default}`)
    lines.push(`- ${p.name} (${bits.join(', ')}): ${p.description}`)
  }
  lines.push(`CSS classes: ${c.classes.join(', ')}`)
  lines.push(`Data attributes: ${c.dataAttributes.join(', ')}`)
  lines.push('', '```svelte', c.example, '```')
}

lines.push('', '## Tokens', '')
for (const t of manifest.tokens) {
  lines.push(`- ${t.name}: light ${t.light}, dark ${t.dark}. ${t.description}`)
}

lines.push('', '## Adapters', '')
for (const a of manifest.adapters) {
  lines.push(`### ${a.name} (${a.entry})`, '', '```', a.usage, '```', '')
}

lines.push(
  '',
  '## CLI',
  '',
  'npx sigil-ui list | docs <name> | tokens | adapters | manifest | doctor'
)

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'llms.txt'), index + '\n')
writeFileSync(join(outDir, 'llms-full.txt'), lines.join('\n') + '\n')
console.log('site/public/llms.txt and llms-full.txt written')
