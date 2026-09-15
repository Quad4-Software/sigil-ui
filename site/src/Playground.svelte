<script lang="ts">
  import {
    Alert,
    Avatar,
    Badge,
    Button,
    Checkbox,
    Field,
    Input,
    NumberInput,
    Pagination,
    PinInput,
    Progress,
    Rating,
    Select,
    Slider,
    Spinner,
    Stepper,
    Switch,
    Tabs,
    TagsInput,
    Textarea,
    Toggle,
    ToggleGroup
  } from 'sigil-ui'
  import { css } from '../styled-system/css'
  import { flex, stack } from '../styled-system/patterns'
  import AccentPicker from './AccentPicker.svelte'
  import Code from './Code.svelte'

  interface Props {
    accent: string | undefined
    onaccent: (value: string | undefined) => void
  }

  let { accent, onaccent }: Props = $props()

  type Val = string | number | boolean | string[]

  type Ctl =
    | { kind: 'select'; key: string; label: string; options: readonly string[] }
    | { kind: 'switch'; key: string; label: string }
    | { kind: 'slider'; key: string; label: string; min: number; max: number }
    | { kind: 'text'; key: string; label: string }
    | { kind: 'number'; key: string; label: string; min?: number; max?: number; step?: number }

  interface Entry {
    name: string
    group: string
    defaults: Record<string, Val>
    controls: Ctl[]
    code: (v: Record<string, Val>) => { svelte: string; html: string }
  }

  const boolAttr = (name: string, on: Val | undefined) => (on ? ` ${name}` : '')
  const optProp = (name: string, value: Val | undefined, fallback: Val) =>
    value === fallback ? '' : ` ${name}="${value}"`

  const star =
    '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.26 6.6.56-5 4.4 1.5 6.48L12 16.9 5.99 19.7l1.5-6.48-5-4.4 6.6-.56z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>'

  const entries: Entry[] = [
    {
      name: 'Button',
      group: 'actions',
      defaults: { variant: 'primary', loading: false, disabled: false, label: 'Save changes' },
      controls: [
        {
          kind: 'select',
          key: 'variant',
          label: 'Variant',
          options: ['primary', 'secondary', 'ghost', 'danger']
        },
        { kind: 'switch', key: 'loading', label: 'Loading' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'label', label: 'Label' }
      ],
      code: (v) => ({
        svelte: `<Button${optProp('variant', v.variant, 'primary')}${boolAttr('loading', v.loading)}${boolAttr('disabled', v.disabled)}>${v.label}</Button>`,
        html: `<button class="sig-btn" data-variant="${v.variant}"${v.loading ? ' aria-busy="true" disabled' : v.disabled ? ' disabled' : ''}>${v.loading ? '<span class="sig-btn-spinner" aria-hidden="true"></span>' : ''}${v.label}</button>`
      })
    },
    {
      name: 'Toggle',
      group: 'actions',
      defaults: { pressed: false, label: 'Bold' },
      controls: [
        { kind: 'switch', key: 'pressed', label: 'Pressed' },
        { kind: 'text', key: 'label', label: 'Label' }
      ],
      code: (v) => ({
        svelte: `<Toggle pressed={${v.pressed}}>${v.label}</Toggle>`,
        html: `<button type="button" class="sig-toggle" aria-pressed="${v.pressed}" data-state="${v.pressed ? 'on' : 'off'}">${v.label}</button>`
      })
    },
    {
      name: 'ToggleGroup',
      group: 'actions',
      defaults: { value: 'left' },
      controls: [
        { kind: 'select', key: 'value', label: 'Value', options: ['left', 'center', 'right'] }
      ],
      code: (v) => {
        const items = (['left', 'center', 'right'] as const)
          .map(
            (o) =>
              `    <button type="button" class="sig-toggle-item" data-state="${o === v.value ? 'on' : 'off'}" aria-pressed="${o === v.value}" data-value="${o}">${o[0]?.toUpperCase() ?? ''}${o.slice(1)}</button>`
          )
          .join('\n')
        return {
          svelte: `<ToggleGroup.Root value="${v.value}">\n  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>\n  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>\n  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>\n</ToggleGroup.Root>`,
          html: `<div class="sig-toggle-group" role="group">\n${items}\n</div>`
        }
      }
    },
    {
      name: 'Input',
      group: 'inputs',
      defaults: { placeholder: 'you@example.com', invalid: false, disabled: false },
      controls: [
        { kind: 'text', key: 'placeholder', label: 'Placeholder' },
        { kind: 'switch', key: 'invalid', label: 'Invalid' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => ({
        svelte: `<Input placeholder="${v.placeholder}"${v.invalid ? ' aria-invalid="true"' : ''}${boolAttr('disabled', v.disabled)} />`,
        html: `<input class="sig-input" placeholder="${v.placeholder}"${v.invalid ? ' aria-invalid="true"' : ''}${boolAttr('disabled', v.disabled)} />`
      })
    },
    {
      name: 'Textarea',
      group: 'inputs',
      defaults: { placeholder: 'Write something', rows: 3, disabled: false },
      controls: [
        { kind: 'text', key: 'placeholder', label: 'Placeholder' },
        { kind: 'number', key: 'rows', label: 'Rows', min: 2, max: 8 },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => ({
        svelte: `<Textarea placeholder="${v.placeholder}" rows={${v.rows}}${boolAttr('disabled', v.disabled)} />`,
        html: `<textarea class="sig-textarea" placeholder="${v.placeholder}" rows="${v.rows}"${boolAttr('disabled', v.disabled)}></textarea>`
      })
    },
    {
      name: 'Select',
      group: 'inputs',
      defaults: { disabled: false },
      controls: [{ kind: 'switch', key: 'disabled', label: 'Disabled' }],
      code: (v) => ({
        svelte: `<Select${boolAttr('disabled', v.disabled)}>\n  <option>Deploy</option>\n  <option>Rollback</option>\n  <option>Pause</option>\n</Select>`,
        html: `<span class="sig-select-wrap">\n  <select class="sig-select"${boolAttr('disabled', v.disabled)}>\n    <option>Deploy</option>\n    <option>Rollback</option>\n    <option>Pause</option>\n  </select>\n</span>`
      })
    },
    {
      name: 'Checkbox',
      group: 'inputs',
      defaults: { checked: true, disabled: false, label: 'Accept terms' },
      controls: [
        { kind: 'switch', key: 'checked', label: 'Checked' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'label', label: 'Label' }
      ],
      code: (v) => ({
        svelte: `<Checkbox checked={${v.checked}}${boolAttr('disabled', v.disabled)} aria-label="${v.label}" />`,
        html: `<input type="checkbox" class="sig-checkbox"${v.checked ? ' checked' : ''}${boolAttr('disabled', v.disabled)} aria-label="${v.label}" />`
      })
    },
    {
      name: 'Switch',
      group: 'inputs',
      defaults: { checked: true, disabled: false },
      controls: [
        { kind: 'switch', key: 'checked', label: 'Checked' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => ({
        svelte: `<Switch checked={${v.checked}}${boolAttr('disabled', v.disabled)} aria-label="Notifications" />`,
        html: `<button type="button" class="sig-switch" role="switch" aria-checked="${v.checked}" data-state="${v.checked ? 'checked' : 'unchecked'}"${boolAttr('disabled', v.disabled)}>\n  <span class="sig-switch-thumb"></span>\n</button>`
      })
    },
    {
      name: 'Slider',
      group: 'inputs',
      defaults: { value: 40, disabled: false },
      controls: [
        { kind: 'slider', key: 'value', label: 'Value', min: 0, max: 100 },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => ({
        svelte: `<Slider value={${v.value}} label="Volume"${boolAttr('disabled', v.disabled)} />`,
        html: `<span class="sig-slider">\n  <input type="range" min="0" max="100" value="${v.value}" aria-label="Volume" style="--sig-slider-pct: ${v.value}%"${boolAttr('disabled', v.disabled)} />\n</span>`
      })
    },
    {
      name: 'NumberInput',
      group: 'inputs',
      defaults: { value: 2, min: 0, max: 10, step: 1, disabled: false },
      controls: [
        { kind: 'number', key: 'value', label: 'Value' },
        { kind: 'number', key: 'min', label: 'Min' },
        { kind: 'number', key: 'max', label: 'Max' },
        { kind: 'number', key: 'step', label: 'Step' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => ({
        svelte: `<NumberInput value={${v.value}} min={${v.min}} max={${v.max}} step={${v.step}} label="Quantity"${boolAttr('disabled', v.disabled)} />`,
        html: `<div class="sig-number-input"${v.disabled ? ' data-disabled' : ''}>\n  <button type="button" class="sig-number-btn sig-number-dec" aria-label="Decrease"></button>\n  <input class="sig-number-field" role="spinbutton" value="${v.value}" aria-valuemin="${v.min}" aria-valuemax="${v.max}" aria-label="Quantity"${boolAttr('disabled', v.disabled)} />\n  <button type="button" class="sig-number-btn sig-number-inc" aria-label="Increase"></button>\n</div>`
      })
    },
    {
      name: 'PinInput',
      group: 'inputs',
      defaults: { length: 6, masked: false, disabled: false },
      controls: [
        { kind: 'slider', key: 'length', label: 'Length', min: 4, max: 8 },
        { kind: 'switch', key: 'masked', label: 'Masked' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => {
        const cells = Array.from(
          { length: Number(v.length) },
          () =>
            `  <input class="sig-pin-cell" type="${v.masked ? 'password' : 'text'}" inputmode="numeric" maxlength="1"${boolAttr('disabled', v.disabled)} />`
        ).join('\n')
        return {
          svelte: `<PinInput length={${v.length}}${boolAttr('masked', v.masked)}${boolAttr('disabled', v.disabled)} />`,
          html: `<div class="sig-pin-input" role="group" aria-label="One-time code">\n${cells}\n</div>`
        }
      }
    },
    {
      name: 'Rating',
      group: 'inputs',
      defaults: { value: 3, readonly: false },
      controls: [
        { kind: 'slider', key: 'value', label: 'Value', min: 0, max: 5 },
        { kind: 'switch', key: 'readonly', label: 'Read only' }
      ],
      code: (v) => {
        const stars = Array.from({ length: 5 }, (_, i) => {
          const n = i + 1
          return `  <button type="button" class="sig-rating-star" role="radio" aria-checked="${n === Number(v.value)}" aria-label="${n} of 5"${n <= Number(v.value) ? ' data-filled' : ''}${v.readonly ? ' disabled' : ''}>${star}</button>`
        }).join('\n')
        return {
          svelte: `<Rating value={${v.value}}${boolAttr('readonly', v.readonly)} />`,
          html: `<span class="sig-rating" role="radiogroup" aria-label="Rating"${v.readonly ? ' data-readonly' : ''}>\n${stars}\n</span>`
        }
      }
    },
    {
      name: 'TagsInput',
      group: 'inputs',
      defaults: { tags: 'svelte, runes', placeholder: 'Add tag', disabled: false },
      controls: [
        { kind: 'text', key: 'tags', label: 'Tags (comma separated)' },
        { kind: 'text', key: 'placeholder', label: 'Placeholder' },
        { kind: 'switch', key: 'disabled', label: 'Disabled' }
      ],
      code: (v) => {
        const list = String(v.tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
        const tagsHtml = list
          .map(
            (t) =>
              `  <span class="sig-tag">${t} <button type="button" class="sig-tag-remove" aria-label="Remove ${t}">×</button></span>`
          )
          .join('\n')
        return {
          svelte: `<TagsInput tags={[${list.map((t) => `'${t}'`).join(', ')}]} placeholder="${v.placeholder}"${boolAttr('disabled', v.disabled)} />`,
          html: `<div class="sig-tags-input"${v.disabled ? ' data-disabled' : ''}>\n${tagsHtml}\n  <input class="sig-tags-field" placeholder="${v.placeholder}"${boolAttr('disabled', v.disabled)} />\n</div>`
        }
      }
    },
    {
      name: 'Badge',
      group: 'feedback',
      defaults: { tone: 'accent', label: 'New' },
      controls: [
        {
          kind: 'select',
          key: 'tone',
          label: 'Tone',
          options: ['neutral', 'accent', 'success', 'warning', 'danger', 'info']
        },
        { kind: 'text', key: 'label', label: 'Label' }
      ],
      code: (v) => ({
        svelte: `<Badge tone="${v.tone}">${v.label}</Badge>`,
        html: `<span class="sig-badge" data-tone="${v.tone}">${v.label}</span>`
      })
    },
    {
      name: 'Alert',
      group: 'feedback',
      defaults: {
        tone: 'info',
        title: 'Heads up',
        body: 'Something happened that you should know about.'
      },
      controls: [
        {
          kind: 'select',
          key: 'tone',
          label: 'Tone',
          options: ['default', 'success', 'warning', 'danger', 'info']
        },
        { kind: 'text', key: 'title', label: 'Title' },
        { kind: 'text', key: 'body', label: 'Body' }
      ],
      code: (v) => ({
        svelte: `<Alert tone="${v.tone}" title="${v.title}">\n  ${v.body}\n</Alert>`,
        html: `<div role="status" data-tone="${v.tone}" class="sig-alert">\n  <p class="sig-alert-title">${v.title}</p>\n  <div class="sig-alert-body">${v.body}</div>\n</div>`
      })
    },
    {
      name: 'Progress',
      group: 'feedback',
      defaults: { value: 64, indeterminate: false },
      controls: [
        { kind: 'slider', key: 'value', label: 'Value', min: 0, max: 100 },
        { kind: 'switch', key: 'indeterminate', label: 'Indeterminate' }
      ],
      code: (v) => ({
        svelte: v.indeterminate
          ? `<Progress label="Upload" />`
          : `<Progress value={${v.value}} label="Upload" />`,
        html: `<div class="sig-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100"${v.indeterminate ? ' data-indeterminate' : ` aria-valuenow="${v.value}"`}>\n  <div class="sig-progress-bar"${v.indeterminate ? '' : ` style="width: ${v.value}%"`}></div>\n</div>`
      })
    },
    {
      name: 'Spinner',
      group: 'feedback',
      defaults: { label: 'Loading' },
      controls: [{ kind: 'text', key: 'label', label: 'Label' }],
      code: (v) => ({
        svelte: `<Spinner label="${v.label}" />`,
        html: `<span role="status" aria-label="${v.label}" class="sig-spinner"></span>`
      })
    },
    {
      name: 'Avatar',
      group: 'data',
      defaults: { fallback: 'Ada Lovelace' },
      controls: [{ kind: 'text', key: 'fallback', label: 'Name' }],
      code: (v) => ({
        svelte: `<Avatar fallback="${v.fallback}" />`,
        html: `<span class="sig-avatar"><span class="sig-avatar-fallback">${String(v.fallback)
          .split(/\s+/)
          .map((w) => w[0] ?? '')
          .join('')
          .slice(0, 2)
          .toUpperCase()}</span></span>`
      })
    },
    {
      name: 'Tabs',
      group: 'data',
      defaults: { value: 'usage' },
      controls: [
        {
          kind: 'select',
          key: 'value',
          label: 'Active tab',
          options: ['usage', 'billing', 'security']
        }
      ],
      code: (v) => {
        const triggers = (['usage', 'billing', 'security'] as const)
          .map(
            (o) =>
              `    <button role="tab" class="sig-tab" data-state="${o === v.value ? 'active' : 'inactive'}" aria-selected="${o === v.value}">${o[0]?.toUpperCase() ?? ''}${o.slice(1)}</button>`
          )
          .join('\n')
        return {
          svelte: `<Tabs.Root value="${v.value}">\n  <Tabs.List>\n    <Tabs.Trigger value="usage">Usage</Tabs.Trigger>\n    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>\n    <Tabs.Trigger value="security">Security</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="${v.value}">…</Tabs.Content>\n</Tabs.Root>`,
          html: `<div class="sig-tabs">\n  <div class="sig-tablist" role="tablist">\n${triggers}\n  </div>\n  <div role="tabpanel" class="sig-tabpanel">${v.value} settings</div>\n</div>`
        }
      }
    },
    {
      name: 'Pagination',
      group: 'data',
      defaults: { page: 4, pages: 9 },
      controls: [
        { kind: 'slider', key: 'page', label: 'Page', min: 1, max: 9 },
        { kind: 'number', key: 'pages', label: 'Pages', min: 3, max: 20 }
      ],
      code: (v) => ({
        svelte: `<Pagination page={${v.page}} pages={${v.pages}} />`,
        html: `<nav class="sig-pagination" aria-label="Pagination">\n  <button class="sig-page-btn" aria-label="Previous page">‹</button>\n  <button class="sig-page-btn" data-active>${v.page}</button>\n  <button class="sig-page-btn">${Math.min(Number(v.pages), Number(v.page) + 1)}</button>\n  <button class="sig-page-btn" aria-label="Next page">›</button>\n</nav>`
      })
    },
    {
      name: 'Stepper',
      group: 'data',
      defaults: { step: 2 },
      controls: [{ kind: 'slider', key: 'step', label: 'Current step', min: 1, max: 3 }],
      code: (v) => {
        const titles = ['Account', 'Details', 'Confirm']
        const items = titles
          .map((t, i) => {
            const state =
              i + 1 < Number(v.step)
                ? 'complete'
                : i + 1 === Number(v.step)
                  ? 'current'
                  : 'upcoming'
            return `  <li class="sig-step" data-state="${state}">\n    <button type="button" class="sig-step-button">\n      <span class="sig-step-indicator"></span>\n      <span class="sig-step-text"><span class="sig-step-title">${t}</span></span>\n    </button>\n  </li>`
          })
          .join('\n')
        return {
          svelte: `<Stepper.Root step={${v.step}}>\n${titles.map((t) => `  <Stepper.Item title="${t}" />`).join('\n')}\n</Stepper.Root>`,
          html: `<ol class="sig-stepper">\n${items}\n</ol>`
        }
      }
    }
  ]

  const groups = [...new Set(entries.map((e) => e.group))]

  const fallbackEntry: Entry = {
    name: 'Button',
    group: 'actions',
    defaults: {},
    controls: [],
    code: () => ({ svelte: '', html: '' })
  }

  let filter = $state('')
  let selected = $state('Button')
  let vals = $state<Record<string, Val>>({ ...(entries[0]?.defaults ?? {}) })
  let codeTab = $state<'svelte' | 'html' | 'theme'>('svelte')
  let previewTheme = $state<'page' | 'light' | 'dark'>('page')

  const visible = $derived(
    entries.filter((e) => e.name.toLowerCase().includes(filter.trim().toLowerCase()))
  )
  const entry = $derived(entries.find((e) => e.name === selected) ?? fallbackEntry)

  function pick(name: string) {
    const e = entries.find((x) => x.name === name)
    if (!e) return
    selected = name
    vals = { ...e.defaults }
  }

  const str = (key: string): string => String(vals[key] ?? '')
  const num = (key: string): number => Number(vals[key] ?? 0)
  const bool = (key: string): boolean => Boolean(vals[key])
  const v = <T extends Val>(key: string): T => vals[key] as T

  const generated = $derived(entry.code(vals))

  const themeCode = $derived(
    accent
      ? `:root {\n  --sig-accent: ${accent};\n  --sig-accent-hover: color-mix(in oklab, ${accent} 85%, black);\n  --sig-ring: ${accent};\n  --sig-chart-1: ${accent};\n}`
      : `/* defaults come from sigil-ui/theme.css\n   set --sig-accent on :root to retheme every component */`
  )

  const sideBtn = (active: boolean) =>
    css({
      display: 'block',
      w: 'full',
      textAlign: 'left',
      px: '2',
      py: '1.5',
      fontSize: 'sm',
      border: 'none',
      bg: 'transparent',
      color: 'sig.fg',
      cursor: 'pointer',
      rounded: 'sig',
      borderLeft: '2px solid',
      borderLeftColor: active ? 'sig.accent' : 'transparent',
      _hover: { bg: 'sig.surface-hover' }
    })

  const tabBtn = (active: boolean) =>
    css({
      px: '3',
      py: '1.5',
      fontSize: 'sm',
      fontWeight: 'medium',
      border: '1px solid',
      borderColor: 'sig.border',
      rounded: 'sig',
      cursor: 'pointer',
      bg: active ? 'sig.accent' : 'transparent',
      color: active ? 'sig.accent-fg' : 'sig.fg'
    })
</script>

<div class={css({ mt: '4' })}>
  <div
    class={flex({
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '4'
    })}
  >
    <div>
      <h2 class={css({ fontSize: '2xl', fontWeight: 'semibold', letterSpacing: 'tight', m: '0' })}>
        Playground
      </h2>
      <p class={css({ mt: '1', color: 'sig.muted', fontSize: 'sm' })}>
        Every prop wired live. Copy Svelte or the same markup as vanilla HTML.
      </p>
    </div>
    <AccentPicker {accent} {onaccent} />
  </div>

  <div
    class={css({
      display: 'grid',
      mt: '6',
      gap: '5',
      gridTemplateColumns: { base: '1fr', lg: '13rem 1fr' }
    })}
  >
    <aside>
      <Input placeholder="Filter components" bind:value={filter} aria-label="Filter components" />
      <nav class={stack({ mt: '3', gap: '3' })}>
        {#each groups as group (group)}
          {@const items = visible.filter((e) => e.group === group)}
          {#if items.length}
            <div>
              <p
                class={css({
                  m: '0',
                  mb: '1',
                  fontSize: 'xs',
                  fontWeight: 'medium',
                  color: 'sig.muted',
                  textTransform: 'uppercase',
                  letterSpacing: 'wide'
                })}
              >
                {group}
              </p>
              {#each items as item (item.name)}
                <button
                  type="button"
                  class={sideBtn(item.name === selected)}
                  aria-current={item.name === selected || undefined}
                  onclick={() => pick(item.name)}
                >
                  {item.name}
                </button>
              {/each}
            </div>
          {/if}
        {/each}
      </nav>
    </aside>

    <div class={stack({ gap: '4' })}>
      <div>
        <div class={flex({ alignItems: 'center', justifyContent: 'space-between', mb: '2' })}>
          <span class={css({ fontSize: 'xs', fontWeight: 'medium', color: 'sig.muted' })}>
            Preview
          </span>
          <ToggleGroup.Root
            value={previewTheme}
            type="single"
            aria-label="Preview theme"
            onValueChange={(value) => {
              if (value) previewTheme = value as 'page' | 'light' | 'dark'
            }}
          >
            <ToggleGroup.Item value="page">page</ToggleGroup.Item>
            <ToggleGroup.Item value="light">light</ToggleGroup.Item>
            <ToggleGroup.Item value="dark">dark</ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div
          data-theme={previewTheme === 'page' ? undefined : previewTheme}
          class={css({
            minH: '16rem',
            display: 'grid',
            placeItems: 'center',
            p: '6',
            rounded: 'sig',
            border: '1px solid',
            borderColor: 'sig.border',
            bg: 'var(--sig-surface)'
          })}
        >
          {#if selected === 'Button'}
            <Button
              variant={v<'primary' | 'secondary' | 'ghost' | 'danger'>('variant')}
              loading={bool('loading')}
              disabled={bool('disabled')}>{str('label')}</Button
            >
          {:else if selected === 'Toggle'}
            <Toggle pressed={bool('pressed')} onclick={() => (vals.pressed = !vals.pressed)}
              >{str('label')}</Toggle
            >
          {:else if selected === 'ToggleGroup'}
            <ToggleGroup.Root value={str('value')} onValueChange={(value) => (vals.value = value)}>
              <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
              <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
              <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
            </ToggleGroup.Root>
          {:else if selected === 'Input'}
            <div class={css({ w: 'full', maxW: 'sm' })}>
              <Input
                placeholder={str('placeholder')}
                aria-invalid={bool('invalid') || undefined}
                disabled={bool('disabled')}
              />
            </div>
          {:else if selected === 'Textarea'}
            <div class={css({ w: 'full', maxW: 'sm' })}>
              <Textarea
                placeholder={str('placeholder')}
                rows={num('rows')}
                disabled={bool('disabled')}
              />
            </div>
          {:else if selected === 'Select'}
            <div class={css({ w: 'full', maxW: 'sm' })}>
              <Select disabled={bool('disabled')}>
                <option>Deploy</option>
                <option>Rollback</option>
                <option>Pause</option>
              </Select>
            </div>
          {:else if selected === 'Checkbox'}
            <label class={flex({ alignItems: 'center', gap: '2', fontSize: 'sm' })}>
              <Checkbox
                checked={bool('checked')}
                onchange={(e) => (vals.checked = e.currentTarget.checked)}
                disabled={bool('disabled')}
              />
              {str('label')}
            </label>
          {:else if selected === 'Switch'}
            <Switch
              checked={bool('checked')}
              onclick={() => (vals.checked = !vals.checked)}
              disabled={bool('disabled')}
              aria-label="Notifications"
            />
          {:else if selected === 'Slider'}
            <div class={css({ w: 'full', maxW: 'sm' })}>
              <Slider
                value={num('value')}
                oninput={(e) => (vals.value = Number(e.currentTarget.value))}
                label="Volume"
                disabled={bool('disabled')}
              />
            </div>
          {:else if selected === 'NumberInput'}
            <NumberInput
              value={num('value')}
              onChange={(value) => (vals.value = value)}
              min={num('min')}
              max={num('max')}
              step={num('step')}
              label="Quantity"
              disabled={bool('disabled')}
            />
          {:else if selected === 'PinInput'}
            <PinInput
              length={num('length')}
              masked={bool('masked')}
              disabled={bool('disabled')}
              label="One-time code"
            />
          {:else if selected === 'Rating'}
            <Rating
              value={num('value')}
              onChange={(value) => (vals.value = value)}
              readonly={bool('readonly')}
            />
          {:else if selected === 'TagsInput'}
            <div class={css({ w: 'full', maxW: 'md' })}>
              <TagsInput
                tags={str('tags')
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)}
                onValueChange={(tags) => (vals.tags = tags.join(', '))}
                placeholder={str('placeholder')}
                disabled={bool('disabled')}
              />
            </div>
          {:else if selected === 'Badge'}
            <Badge
              tone={v<'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'>('tone')}
              >{str('label')}</Badge
            >
          {:else if selected === 'Alert'}
            <div class={css({ w: 'full', maxW: 'md' })}>
              <Alert
                tone={v<'default' | 'success' | 'warning' | 'danger' | 'info'>('tone')}
                title={str('title')}>{str('body')}</Alert
              >
            </div>
          {:else if selected === 'Progress'}
            <div class={css({ w: 'full', maxW: 'md' })}>
              {#if bool('indeterminate')}
                <Progress label="Upload" />
              {:else}
                <Progress value={num('value')} label="Upload" />
              {/if}
            </div>
          {:else if selected === 'Spinner'}
            <Spinner label={str('label')} />
          {:else if selected === 'Avatar'}
            <Avatar fallback={str('fallback')} />
          {:else if selected === 'Tabs'}
            <div class={css({ w: 'full', maxW: 'md' })}>
              <Tabs.Root value={str('value')}>
                <Tabs.List>
                  <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
                  <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
                  <Tabs.Trigger value="security">Security</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value={str('value')}>{str('value')} settings</Tabs.Content>
              </Tabs.Root>
            </div>
          {:else if selected === 'Pagination'}
            <Pagination page={num('page')} pages={num('pages')} />
          {:else if selected === 'Stepper'}
            <div class={css({ w: 'full', maxW: 'md' })}>
              <Stepper.Root step={num('step')}>
                <Stepper.Item title="Account" />
                <Stepper.Item title="Details" />
                <Stepper.Item title="Confirm" />
              </Stepper.Root>
            </div>
          {/if}
        </div>
      </div>

      <div class={flex({ flexWrap: 'wrap', gap: '4', alignItems: 'flex-end' })}>
        {#each entry.controls as ctl (ctl.key)}
          {#if ctl.kind === 'select'}
            <Field label={ctl.label}>
              {#snippet children(props)}
                <Select
                  {...props}
                  value={str(ctl.key)}
                  onchange={(e) => (vals[ctl.key] = e.currentTarget.value)}
                >
                  {#each ctl.options as o (o)}
                    <option value={o}>{o}</option>
                  {/each}
                </Select>
              {/snippet}
            </Field>
          {:else if ctl.kind === 'switch'}
            <label class={flex({ alignItems: 'center', gap: '2', fontSize: 'sm', pb: '1' })}>
              <Switch
                checked={bool(ctl.key)}
                onclick={() => (vals[ctl.key] = !vals[ctl.key])}
                aria-label={ctl.label}
              />
              {ctl.label}
            </label>
          {:else if ctl.kind === 'slider'}
            <Field label="{ctl.label}: {vals[ctl.key]}">
              {#snippet children(props)}
                <div class={css({ w: '36' })}>
                  <Slider
                    {...props}
                    value={num(ctl.key)}
                    oninput={(e) => (vals[ctl.key] = Number(e.currentTarget.value))}
                    min={ctl.min}
                    max={ctl.max}
                  />
                </div>
              {/snippet}
            </Field>
          {:else if ctl.kind === 'number'}
            <Field label={ctl.label}>
              {#snippet children(props)}
                <Input
                  {...props}
                  type="number"
                  value={num(ctl.key)}
                  oninput={(e) => (vals[ctl.key] = Number(e.currentTarget.value))}
                  min={ctl.min}
                  max={ctl.max}
                  step={ctl.step}
                />
              {/snippet}
            </Field>
          {:else}
            <Field label={ctl.label}>
              {#snippet children(props)}
                <Input
                  {...props}
                  value={str(ctl.key)}
                  oninput={(e) => (vals[ctl.key] = e.currentTarget.value)}
                />
              {/snippet}
            </Field>
          {/if}
        {/each}
      </div>

      <div>
        <div class={flex({ gap: '2', mb: '2' })} role="group" aria-label="Code format">
          <button
            type="button"
            class={tabBtn(codeTab === 'svelte')}
            onclick={() => (codeTab = 'svelte')}>Svelte</button
          >
          <button
            type="button"
            class={tabBtn(codeTab === 'html')}
            onclick={() => (codeTab = 'html')}>Vanilla HTML</button
          >
          <button
            type="button"
            class={tabBtn(codeTab === 'theme')}
            onclick={() => (codeTab = 'theme')}>Theme</button
          >
        </div>
        <Code title={codeTab === 'theme' ? 'css' : codeTab === 'html' ? 'html' : 'svelte'}>
          {codeTab === 'theme' ? themeCode : codeTab === 'html' ? generated.html : generated.svelte}
        </Code>
      </div>
    </div>
  </div>
</div>
