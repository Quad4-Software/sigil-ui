export interface SigilProp {
  name: string
  type: string
  default?: string
  bindable?: boolean
  description: string
}

export interface SigilComponent {
  name: string
  path: string
  description: string
  props: SigilProp[]
  classes: string[]
  dataAttributes: string[]
  example: string
}

export interface SigilToken {
  name: string
  light: string
  dark: string
  description: string
}

export interface SigilAdapter {
  name: string
  entry: string
  usage: string
}

export interface SigilManifest {
  package: string
  version: string
  sveltePeer: string
  themeEntry: string
  components: SigilComponent[]
  tokens: SigilToken[]
  adapters: SigilAdapter[]
}

const classProp: SigilProp = {
  name: 'class',
  type: 'ClassValue',
  description: 'Merged with the base class. Pass framework utility classes here.'
}

const childrenProp: SigilProp = {
  name: 'children',
  type: 'Snippet',
  description: 'Content rendered inside the element.'
}

export const manifest: SigilManifest = {
  package: 'sigil-ui',
  version: '0.0.0',
  sveltePeer: '^5.0.0',
  themeEntry: 'sigil-ui/theme.css',
  components: [
    {
      name: 'Button',
      path: 'button',
      description:
        'Button with variant styling driven by data-variant and the --sig-* token contract. Forwards all native button attributes and events.',
      props: [
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'ghost' | 'danger'",
          default: "'primary'",
          description: 'Visual variant, rendered as data-variant on the element.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-btn'],
      dataAttributes: ['data-variant'],
      example: `<script>\n  import { Button } from 'sigil-ui'\n</script>\n\n<Button variant="secondary" onclick={save}>Save</Button>`
    },
    {
      name: 'Badge',
      path: 'badge',
      description:
        'Inline status label. Tone is rendered as data-tone so any CSS framework can restyle it.',
      props: [
        {
          name: 'tone',
          type: "'neutral' | 'accent' | 'danger'",
          default: "'neutral'",
          description: 'Color tone, rendered as data-tone on the element.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-badge'],
      dataAttributes: ['data-tone'],
      example: `<script>\n  import { Badge } from 'sigil-ui'\n</script>\n\n<Badge tone="accent">beta</Badge>`
    },
    {
      name: 'Switch',
      path: 'switch',
      description:
        'Toggle using role=switch and aria-checked. checked is bindable. Render state is exposed as data-state checked/unchecked.',
      props: [
        {
          name: 'checked',
          type: 'boolean',
          default: 'false',
          bindable: true,
          description: 'Bindable on/off state.'
        },
        classProp,
        {
          name: 'children',
          type: 'Snippet<[{ checked: boolean }]>',
          description: 'Custom content replacing the default thumb.'
        }
      ],
      classes: ['sig-switch', 'sig-switch-thumb'],
      dataAttributes: ['data-state', 'data-disabled'],
      example: `<script>\n  import { Switch } from 'sigil-ui'\n  let on = $state(false)\n</script>\n\n<Switch bind:checked={on} aria-label="notifications" />`
    },
    {
      name: 'Input',
      path: 'input',
      description:
        'Styled native text input. value is bindable. Set aria-invalid for error state. Forwards all native input attributes.',
      props: [
        {
          name: 'value',
          type: 'string | number',
          bindable: true,
          description: 'Bindable input value.'
        },
        { name: 'type', type: 'string', default: "'text'", description: 'Native input type.' },
        classProp
      ],
      classes: ['sig-input'],
      dataAttributes: [],
      example: `<script>\n  import { Input } from 'sigil-ui'\n  let name = $state('')\n</script>\n\n<Input bind:value={name} placeholder="Name" aria-label="Name" />`
    },
    {
      name: 'Select',
      path: 'select',
      description:
        'Styled native select with a chevron affordance. value is bindable. Options are provided as children.',
      props: [
        {
          name: 'value',
          type: 'string',
          bindable: true,
          description: 'Bindable selected value.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-select-wrap', 'sig-select'],
      dataAttributes: [],
      example: `<script>\n  import { Select } from 'sigil-ui'\n  let plan = $state('free')\n</script>\n\n<Select bind:value={plan} aria-label="Plan">\n  <option value="free">Free</option>\n  <option value="pro">Pro</option>\n</Select>`
    },
    {
      name: 'Checkbox',
      path: 'checkbox',
      description:
        'Styled native checkbox. checked is bindable. Pair with a label element for an accessible name.',
      props: [
        {
          name: 'checked',
          type: 'boolean',
          default: 'false',
          bindable: true,
          description: 'Bindable checked state.'
        },
        classProp
      ],
      classes: ['sig-checkbox'],
      dataAttributes: [],
      example: `<script>\n  import { Checkbox } from 'sigil-ui'\n  let ok = $state(false)\n</script>\n\n<label><Checkbox bind:checked={ok} /> Accept terms</label>`
    },
    {
      name: 'Avatar',
      path: 'avatar',
      description:
        'Round avatar with image and initials fallback. Falls back automatically when the image fails to load.',
      props: [
        { name: 'src', type: 'string', description: 'Image URL.' },
        { name: 'alt', type: 'string', description: 'Accessible name for the avatar.' },
        {
          name: 'fallback',
          type: 'string',
          description: 'Name used to derive up to two initials when no image is shown.'
        },
        classProp
      ],
      classes: ['sig-avatar', 'sig-avatar-img', 'sig-avatar-fallback'],
      dataAttributes: [],
      example: `<script>\n  import { Avatar } from 'sigil-ui'\n</script>\n\n<Avatar src={user.avatar} alt={user.name} fallback={user.name} />`
    },
    {
      name: 'Progress',
      path: 'progress',
      description:
        'Progress bar with role=progressbar and aria value wiring. Omit value for an indeterminate loading state. Honors reduced motion.',
      props: [
        { name: 'value', type: 'number', description: 'Current value. Omit for indeterminate.' },
        { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
        { name: 'label', type: 'string', description: 'Accessible label via aria-label.' },
        classProp
      ],
      classes: ['sig-progress', 'sig-progress-bar'],
      dataAttributes: ['data-indeterminate'],
      example: `<script>\n  import { Progress } from 'sigil-ui'\n</script>\n\n<Progress value={68} label="Upload progress" />`
    },
    {
      name: 'Skeleton',
      path: 'skeleton',
      description:
        'Loading placeholder block with a pulse animation. aria-hidden. Honors reduced motion. Size it with class or style.',
      props: [classProp],
      classes: ['sig-skeleton'],
      dataAttributes: [],
      example: `<script>\n  import { Skeleton } from 'sigil-ui'\n</script>\n\n<Skeleton style="height: 2rem; width: 12rem" />`
    },
    {
      name: 'Alert',
      path: 'alert',
      description:
        'Inline message with tone colors. danger and warning use role=alert, other tones use role=status.',
      props: [
        {
          name: 'tone',
          type: "'default' | 'success' | 'warning' | 'danger' | 'info'",
          default: "'default'",
          description: 'Color tone and live region role.'
        },
        { name: 'title', type: 'string', description: 'Bold heading line.' },
        classProp,
        childrenProp
      ],
      classes: ['sig-alert', 'sig-alert-title', 'sig-alert-body'],
      dataAttributes: ['data-tone'],
      example: `<script>\n  import { Alert } from 'sigil-ui'\n</script>\n\n<Alert tone="warning" title="Storage almost full">Free space is below 10%.</Alert>`
    },
    {
      name: 'Separator',
      path: 'separator',
      description:
        'Horizontal or vertical rule. Decorative by default (role=none). Set decorative={false} to expose role=separator.',
      props: [
        {
          name: 'orientation',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Line direction.'
        },
        {
          name: 'decorative',
          type: 'boolean',
          default: 'true',
          description: 'When false, renders role=separator with aria-orientation.'
        },
        classProp
      ],
      classes: ['sig-separator'],
      dataAttributes: ['data-orientation'],
      example: `<script>\n  import { Separator } from 'sigil-ui'\n</script>\n\n<Separator />`
    },
    {
      name: 'Stat',
      path: 'stat',
      description:
        'Dashboard metric: uppercase label, large value, optional signed delta colored by direction.',
      props: [
        { name: 'label', type: 'string', description: 'Small uppercase label.' },
        { name: 'value', type: 'string | number', description: 'Primary metric value.' },
        {
          name: 'delta',
          type: 'number',
          description:
            'Signed change. Positive renders up in success color, negative down in danger.'
        },
        { name: 'deltaLabel', type: 'string', description: 'Unit suffix after delta, e.g. "%".' },
        classProp,
        childrenProp
      ],
      classes: ['sig-stat', 'sig-stat-label', 'sig-stat-value', 'sig-stat-delta'],
      dataAttributes: ['data-dir'],
      example: `<script>\n  import { Stat } from 'sigil-ui'\n</script>\n\n<Stat label="Revenue" value="$48.2k" delta={12.5} deltaLabel="%" />`
    },
    {
      name: 'Tooltip',
      path: 'tooltip',
      description:
        'Hover and focus tooltip. The children snippet receives props to spread on the trigger so aria-describedby is wired. Pure CSS show/hide.',
      props: [
        { name: 'text', type: 'string', description: 'Tooltip text.' },
        {
          name: 'side',
          type: "'top' | 'bottom'",
          default: "'top'",
          description: 'Placement relative to the trigger.'
        },
        {
          name: 'children',
          type: 'Snippet<[{ props: Record<string, string> }]>',
          description: 'Trigger element. Spread props onto it for aria-describedby.'
        },
        classProp
      ],
      classes: ['sig-tip-wrap', 'sig-tip'],
      dataAttributes: ['data-side'],
      example: `<script>\n  import { Tooltip, Button } from 'sigil-ui'\n</script>\n\n<Tooltip text="Save changes">\n  {#snippet children({ props })}\n    <Button {...props}>Save</Button>\n  {/snippet}\n</Tooltip>`
    },
    {
      name: 'Card',
      path: 'card',
      description:
        'Surface namespace: Root, Header, Title, Description, Content, Footer. The base unit for dashboard layouts.',
      props: [
        {
          name: 'class',
          type: 'ClassValue',
          description: 'Accepted on every part.'
        },
        childrenProp
      ],
      classes: [
        'sig-card',
        'sig-card-header',
        'sig-card-title',
        'sig-card-description',
        'sig-card-content',
        'sig-card-footer'
      ],
      dataAttributes: [],
      example: `<script>\n  import { Card, Stat } from 'sigil-ui'\n</script>\n\n<Card.Root>\n  <Card.Header>\n    <Card.Title>Traffic</Card.Title>\n    <Card.Description>Last 30 days</Card.Description>\n  </Card.Header>\n  <Card.Content>\n    <Stat label="Visits" value="128k" delta={8} deltaLabel="%" />\n  </Card.Content>\n</Card.Root>`
    },
    {
      name: 'Tabs',
      path: 'tabs',
      description:
        'Tabs namespace: Root (bindable value), List, Trigger, Content. Full keyboard support: arrows, Home, End, roving tabindex, automatic activation.',
      props: [
        {
          name: 'value',
          type: 'string',
          bindable: true,
          description: 'Bindable selected tab on Tabs.Root. Trigger and Content take a value prop.'
        },
        {
          name: 'class',
          type: 'ClassValue',
          description: 'Accepted on every part.'
        },
        childrenProp
      ],
      classes: ['sig-tabs', 'sig-tablist', 'sig-tab', 'sig-tabpanel'],
      dataAttributes: ['data-state'],
      example: `<script>\n  import { Tabs } from 'sigil-ui'\n  let tab = $state('usage')\n</script>\n\n<Tabs.Root bind:value={tab}>\n  <Tabs.List>\n    <Tabs.Trigger value="usage">Usage</Tabs.Trigger>\n    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="usage">Usage panel</Tabs.Content>\n  <Tabs.Content value="billing">Billing panel</Tabs.Content>\n</Tabs.Root>`
    },
    {
      name: 'Accordion',
      path: 'accordion',
      description:
        'Accordion namespace: Root, Item (value), Trigger, Content. Buttons use aria-expanded and aria-controls, panels use role=region. Set multiple on Root to allow several open items.',
      props: [
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          description: 'Allow more than one open item on Accordion.Root.'
        },
        {
          name: 'value',
          type: 'string',
          description: 'Item identifier on Accordion.Item.'
        },
        {
          name: 'class',
          type: 'ClassValue',
          description: 'Accepted on every part.'
        },
        childrenProp
      ],
      classes: [
        'sig-accordion',
        'sig-acc-item',
        'sig-acc-heading',
        'sig-acc-trigger',
        'sig-acc-chevron',
        'sig-acc-content'
      ],
      dataAttributes: ['data-state'],
      example: `<script>\n  import { Accordion } from 'sigil-ui'\n</script>\n\n<Accordion.Root>\n  <Accordion.Item value="a">\n    <Accordion.Trigger>Section A</Accordion.Trigger>\n    <Accordion.Content>Details for A.</Accordion.Content>\n  </Accordion.Item>\n</Accordion.Root>`
    },
    {
      name: 'Dialog',
      path: 'dialog',
      description:
        'Modal dialog namespace: Root (bindable open), Trigger, Portal, Overlay, Content, Title, Description, Close. Focus trap, Escape to close, scroll lock, focus restore, aria-labelledby/aria-describedby wiring. No external primitive library.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          default: 'false',
          bindable: true,
          description: 'Bindable open state on Dialog.Root.'
        },
        {
          name: 'class',
          type: 'ClassValue',
          description: 'Accepted on Trigger, Overlay, Content, Title, Description and Close.'
        },
        childrenProp
      ],
      classes: [
        'sig-dialog-trigger',
        'sig-dialog-overlay',
        'sig-dialog',
        'sig-dialog-title',
        'sig-dialog-description',
        'sig-dialog-close'
      ],
      dataAttributes: [],
      example: `<script>\n  import { Dialog, Button } from 'sigil-ui'\n  let open = $state(false)\n</script>\n\n<Dialog.Root bind:open>\n  <Dialog.Trigger>Open</Dialog.Trigger>\n  <Dialog.Portal>\n    <Dialog.Overlay />\n    <Dialog.Content>\n      <Dialog.Title>Delete project</Dialog.Title>\n      <Dialog.Description>This cannot be undone.</Dialog.Description>\n      <Dialog.Close>Cancel</Dialog.Close>\n    </Dialog.Content>\n  </Dialog.Portal>\n</Dialog.Root>`
    },
    {
      name: 'Toaster',
      path: 'toast',
      description:
        'Toast system. Mount Toaster once, call toast.success() and friends from anywhere. Timed dismissal with hover and focus pause, action buttons, danger and warning use role=alert.',
      props: [
        {
          name: 'position',
          type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
          default: "'bottom-right'",
          description: 'Screen corner for the toast stack.'
        },
        classProp
      ],
      classes: [
        'sig-toaster',
        'sig-toast',
        'sig-toast-text',
        'sig-toast-title',
        'sig-toast-desc',
        'sig-toast-action',
        'sig-toast-close'
      ],
      dataAttributes: ['data-position', 'data-tone'],
      example: `<script>\n  import { Toaster, toast, Button } from 'sigil-ui'\n</script>\n\n<Toaster />\n<Button onclick={() => toast.success('Saved')}>Save</Button>`
    },
    {
      name: 'PaneGroup',
      path: 'pane',
      description:
        'Resizable split panes (PaneGroup, Pane, PaneResizer). Pointer drag with pointer capture, keyboard resizing on the separator, min/max constraints, optional layout persistence via autoSaveId.',
      props: [
        {
          name: 'direction',
          type: "'horizontal' | 'vertical'",
          default: "'horizontal'",
          description: 'Split direction on PaneGroup.'
        },
        {
          name: 'autoSaveId',
          type: 'string',
          description: 'Persist sizes to localStorage under this key on PaneGroup.'
        },
        {
          name: 'keyboardStep',
          type: 'number',
          default: '5',
          description: 'Percent moved per arrow key press on PaneGroup.'
        },
        { name: 'defaultSize', type: 'number', description: 'Initial percent on Pane.' },
        {
          name: 'minSize',
          type: 'number',
          default: '0',
          description: 'Minimum percent on Pane.'
        },
        {
          name: 'maxSize',
          type: 'number',
          default: '100',
          description: 'Maximum percent on Pane.'
        },
        {
          name: 'onLayout',
          type: '(sizes: number[]) => void',
          description: 'Called on PaneGroup when a drag or key resize ends.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-pane-group', 'sig-pane', 'sig-pane-resizer', 'sig-pane-handle'],
      dataAttributes: ['data-direction', 'data-state', 'data-index'],
      example: `<script>\n  import { PaneGroup, Pane, PaneResizer } from 'sigil-ui'\n</script>\n\n<PaneGroup direction="horizontal" autoSaveId="dash" style="height: 24rem">\n  <Pane defaultSize={30} minSize={20}>Sidebar</Pane>\n  <PaneResizer />\n  <Pane>Main</Pane>\n</PaneGroup>`
    }
  ],
  tokens: [
    { name: '--sig-bg', light: '#ffffff', dark: '#09090b', description: 'Page and surface base' },
    { name: '--sig-fg', light: '#18181b', dark: '#fafafa', description: 'Primary text' },
    { name: '--sig-muted', light: '#71717a', dark: '#a1a1aa', description: 'Secondary text' },
    { name: '--sig-surface', light: '#f4f4f5', dark: '#18181b', description: 'Raised fill' },
    {
      name: '--sig-surface-hover',
      light: '#e4e4e7',
      dark: '#27272a',
      description: 'Raised fill on hover'
    },
    { name: '--sig-border', light: '#d4d4d8', dark: '#3f3f46', description: 'Borders' },
    { name: '--sig-accent', light: '#4f46e5', dark: '#818cf8', description: 'Primary accent' },
    {
      name: '--sig-accent-hover',
      light: '#4338ca',
      dark: '#6366f1',
      description: 'Accent on hover'
    },
    { name: '--sig-accent-fg', light: '#ffffff', dark: '#09090b', description: 'Text on accent' },
    { name: '--sig-danger', light: '#dc2626', dark: '#ef4444', description: 'Destructive actions' },
    {
      name: '--sig-danger-hover',
      light: '#b91c1c',
      dark: '#dc2626',
      description: 'Danger on hover'
    },
    { name: '--sig-danger-fg', light: '#ffffff', dark: '#09090b', description: 'Text on danger' },
    { name: '--sig-success', light: '#16a34a', dark: '#4ade80', description: 'Positive outcome' },
    {
      name: '--sig-success-fg',
      light: '#ffffff',
      dark: '#09090b',
      description: 'Text on success'
    },
    { name: '--sig-warning', light: '#d97706', dark: '#fbbf24', description: 'Caution state' },
    {
      name: '--sig-warning-fg',
      light: '#ffffff',
      dark: '#09090b',
      description: 'Text on warning'
    },
    { name: '--sig-info', light: '#2563eb', dark: '#60a5fa', description: 'Neutral information' },
    { name: '--sig-info-fg', light: '#ffffff', dark: '#09090b', description: 'Text on info' },
    { name: '--sig-ring', light: '#4f46e5', dark: '#818cf8', description: 'Focus ring' },
    {
      name: '--sig-overlay',
      light: 'rgb(0 0 0 / 0.5)',
      dark: 'rgb(0 0 0 / 0.7)',
      description: 'Dialog scrim'
    },
    { name: '--sig-radius', light: '0.375rem', dark: '0.375rem', description: 'Corner radius' },
    {
      name: '--sig-shadow',
      light: '0 10px 30px rgb(0 0 0 / 0.15)',
      dark: '0 10px 30px rgb(0 0 0 / 0.5)',
      description: 'Overlay shadow'
    }
  ],
  adapters: [
    {
      name: 'Tailwind CSS v4',
      entry: 'sigil-ui/tailwind.css',
      usage: `@import 'tailwindcss';\n@import 'sigil-ui/tailwind.css';\n\n/* utilities like bg-sig-accent, text-sig-fg, border-sig-border, rounded-sig */`
    },
    {
      name: 'UnoCSS',
      entry: 'sigil-ui/uno',
      usage: `import { sigilPreset } from 'sigil-ui/uno'\n\nexport default defineConfig({\n  presets: [presetWind4(), sigilPreset]\n})`
    },
    {
      name: 'Panda CSS',
      entry: 'sigil-ui/panda',
      usage: `import { sigilPreset } from 'sigil-ui/panda'\n\nexport default defineConfig({\n  presets: [sigilPreset]\n})`
    },
    {
      name: 'No framework',
      entry: 'sigil-ui/theme.css',
      usage: `import 'sigil-ui/theme.css'\n\n/* or override any --sig-* var in your own stylesheet */`
    }
  ]
}
