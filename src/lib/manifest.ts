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
          type: "'neutral' | 'accent' | 'danger' | 'success' | 'warning' | 'info'",
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
    },
    {
      name: 'Textarea',
      path: 'textarea',
      description: 'Styled native textarea with bindable value and invalid state.',
      props: [
        {
          name: 'value',
          type: 'string',
          default: "''",
          bindable: true,
          description: 'Bindable textarea value.'
        },
        {
          name: 'invalid',
          type: 'boolean',
          default: 'false',
          description: 'Sets aria-invalid and danger border.'
        },
        classProp
      ],
      classes: ['sig-textarea'],
      dataAttributes: ['data-invalid'],
      example: `<script>\n  import { Textarea } from 'sigil-ui'\n  let bio = $state('')\n</script>\n\n<Textarea bind:value={bio} placeholder="Tell us about yourself" />`
    },
    {
      name: 'RadioGroup',
      path: 'radio-group',
      description:
        'RadioGroup namespace: Root (bindable value, roving tabindex, arrow keys) and Item (role=radio, aria-checked).',
      props: [
        {
          name: 'value',
          type: 'string',
          default: "''",
          bindable: true,
          description: 'Bindable selected value on RadioGroup.Root.'
        },
        {
          name: 'value',
          type: 'string',
          description: 'Required option value on RadioGroup.Item.'
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the group or a single item.'
        },
        {
          name: 'onValueChange',
          type: '(value: string) => void',
          description: 'Called on selection change on RadioGroup.Root.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-radio-group', 'sig-radio', 'sig-radio-dot', 'sig-radio-label'],
      dataAttributes: ['data-state', 'data-disabled', 'data-value'],
      example: `<script>\n  import { RadioGroup } from 'sigil-ui'\n  let plan = $state('free')\n</script>\n\n<RadioGroup.Root bind:value={plan}>\n  <RadioGroup.Item value="free">Free</RadioGroup.Item>\n  <RadioGroup.Item value="pro">Pro</RadioGroup.Item>\n</RadioGroup.Root>`
    },
    {
      name: 'Slider',
      path: 'slider',
      description:
        'Styled native range input with bindable value and filled track via a --sig-slider-pct custom property.',
      props: [
        {
          name: 'value',
          type: 'number',
          default: '0',
          bindable: true,
          description: 'Bindable numeric value.'
        },
        { name: 'min', type: 'number', default: '0', description: 'Minimum.' },
        { name: 'max', type: 'number', default: '100', description: 'Maximum.' },
        { name: 'step', type: 'number', default: '1', description: 'Step.' },
        { name: 'label', type: 'string', description: 'Accessible label via aria-label.' },
        classProp
      ],
      classes: ['sig-slider'],
      dataAttributes: ['data-disabled'],
      example: `<script>\n  import { Slider } from 'sigil-ui'\n  let volume = $state(40)\n</script>\n\n<Slider bind:value={volume} label="Volume" />`
    },
    {
      name: 'Toggle',
      path: 'toggle',
      description: 'Pressed/unpressed button with aria-pressed and data-state.',
      props: [
        {
          name: 'pressed',
          type: 'boolean',
          default: 'false',
          bindable: true,
          description: 'Bindable pressed state.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-toggle'],
      dataAttributes: ['data-state', 'data-disabled'],
      example: `<script>\n  import { Toggle } from 'sigil-ui'\n  let bold = $state(false)\n</script>\n\n<Toggle bind:pressed={bold} aria-label="Bold">B</Toggle>`
    },
    {
      name: 'Kbd',
      path: 'kbd',
      description: 'Keyboard key cap for shortcuts and hints.',
      props: [classProp, childrenProp],
      classes: ['sig-kbd'],
      dataAttributes: [],
      example: `<script>\n  import { Kbd } from 'sigil-ui'\n</script>\n\n<p>Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></p>`
    },
    {
      name: 'Breadcrumb',
      path: 'breadcrumb',
      description:
        'Breadcrumb namespace: Root renders nav + ol with aria-label, Item renders li with auto slash separators and aria-current on the last entry.',
      props: [
        {
          name: 'label',
          type: 'string',
          default: "'Breadcrumb'",
          description: 'aria-label for the nav landmark on Root.'
        },
        {
          name: 'current',
          type: 'boolean',
          default: 'false',
          description: 'Marks the item as the current page via aria-current.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-breadcrumb', 'sig-crumbs', 'sig-crumb'],
      dataAttributes: ['data-current'],
      example: `<script>\n  import { Breadcrumb } from 'sigil-ui'\n</script>\n\n<Breadcrumb.Root>\n  <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>\n  <Breadcrumb.Item><a href="/lib">Library</a></Breadcrumb.Item>\n  <Breadcrumb.Item current>Current</Breadcrumb.Item>\n</Breadcrumb.Root>`
    },
    {
      name: 'Popover',
      path: 'popover',
      description:
        'Popover namespace: Root (bindable open), Trigger (aria-haspopup=dialog), Content (anchored, side/align). Outside click and Escape close, focus restored to trigger.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          default: 'false',
          bindable: true,
          description: 'Bindable open state on Popover.Root.'
        },
        {
          name: 'side',
          type: "'top' | 'bottom' | 'left' | 'right'",
          default: "'bottom'",
          description: 'Side of the trigger on Popover.Content.'
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'center'",
          description: 'Alignment along the side on Popover.Content.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-pop-wrap', 'sig-pop-trigger', 'sig-pop-content'],
      dataAttributes: ['data-state', 'data-side', 'data-align'],
      example: `<script>\n  import { Popover, Button } from 'sigil-ui'\n</script>\n\n<Popover.Root>\n  <Popover.Trigger>Details</Popover.Trigger>\n  <Popover.Content side="bottom">Anchored content.</Popover.Content>\n</Popover.Root>`
    },
    {
      name: 'DropdownMenu',
      path: 'dropdown-menu',
      description:
        'Menu namespace: Root (bindable open), Trigger (aria-haspopup=menu), Content (role=menu, arrow keys, Home/End), Item (role=menuitem, onSelect), Separator.',
      props: [
        {
          name: 'open',
          type: 'boolean',
          default: 'false',
          bindable: true,
          description: 'Bindable open state on DropdownMenu.Root.'
        },
        {
          name: 'onSelect',
          type: '() => void',
          description: 'Called when the item is picked on DropdownMenu.Item.'
        },
        {
          name: 'side',
          type: "'top' | 'bottom'",
          default: "'bottom'",
          description: 'Side of the trigger on DropdownMenu.Content.'
        },
        {
          name: 'align',
          type: "'start' | 'center' | 'end'",
          default: "'start'",
          description: 'Alignment on DropdownMenu.Content.'
        },
        classProp,
        childrenProp
      ],
      classes: [
        'sig-menu-wrap',
        'sig-menu-trigger',
        'sig-menu-content',
        'sig-menu-item',
        'sig-menu-sep'
      ],
      dataAttributes: ['data-state', 'data-side', 'data-align', 'data-disabled'],
      example: `<script>\n  import { DropdownMenu, Button } from 'sigil-ui'\n</script>\n\n<DropdownMenu.Root>\n  <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>\n  <DropdownMenu.Content>\n    <DropdownMenu.Item onSelect={() => save()}>Save</DropdownMenu.Item>\n    <DropdownMenu.Separator />\n    <DropdownMenu.Item onSelect={() => remove()}>Delete</DropdownMenu.Item>\n  </DropdownMenu.Content>\n</DropdownMenu.Root>`
    },
    {
      name: 'Empty',
      path: 'empty',
      description:
        'Empty state block with dashed border, optional icon snippet, title, description, and action slot.',
      props: [
        { name: 'title', type: 'string', description: 'Heading line.' },
        { name: 'description', type: 'string', description: 'Secondary line.' },
        { name: 'icon', type: 'Snippet', description: 'Decorative icon, aria-hidden.' },
        classProp,
        childrenProp
      ],
      classes: [
        'sig-empty',
        'sig-empty-icon',
        'sig-empty-title',
        'sig-empty-desc',
        'sig-empty-actions'
      ],
      dataAttributes: [],
      example: `<script>\n  import { Empty, Button } from 'sigil-ui'\n</script>\n\n<Empty title="No results" description="Try a different search.">\n  <Button>Clear filters</Button>\n</Empty>`
    },
    {
      name: 'Measure',
      path: 'measure',
      description:
        'Dev tool: wraps content, shows a live pixel size badge driven by ResizeObserver, and passes width/height to children snippet props.',
      props: [
        {
          name: 'badge',
          type: 'boolean',
          default: 'true',
          description: 'Show the pixel readout badge.'
        },
        { name: 'decimals', type: 'number', default: '0', description: 'Badge precision.' },
        classProp,
        childrenProp
      ],
      classes: ['sig-measure', 'sig-measure-badge'],
      dataAttributes: [],
      example: `<script>\n  import { Measure, Card } from 'sigil-ui'\n</script>\n\n<Measure>\n  <Card.Root>...</Card.Root>\n</Measure>`
    },
    {
      name: 'GridOverlay',
      path: 'grid-overlay',
      description:
        'Dev tool: fixed overlay that draws a spacing grid and can outline elements whose content leaks or clips. Pair with findOverflows() and tagOverflows() from sigil-ui.',
      props: [
        { name: 'size', type: 'number', default: '8', description: 'Grid cell size in px.' },
        {
          name: 'overflow',
          type: 'boolean',
          default: 'false',
          description: 'Outline overflowing elements in danger color.'
        },
        {
          name: 'interval',
          type: 'number',
          default: '0',
          description: 'Re-scan overflows every N ms. 0 scans once.'
        },
        {
          name: 'onScan',
          type: '(issues: OverflowIssue[]) => void',
          description: 'Called after each overflow scan.'
        },
        classProp
      ],
      classes: ['sig-grid-overlay'],
      dataAttributes: ['data-overflow', 'data-sig-overflow'],
      example: `<script>\n  import { GridOverlay } from 'sigil-ui'\n  let debug = $state(true)\n</script>\n\n{#if debug}\n  <GridOverlay size={8} overflow interval={1000} />\n{/if}`
    },
    {
      name: 'Spinner',
      path: 'spinner',
      description:
        'Loading indicator with role=status and an aria-label. Respects prefers-reduced-motion.',
      props: [
        { name: 'label', type: 'string', default: 'Loading', description: 'Accessible name.' },
        classProp
      ],
      classes: ['sig-spinner'],
      dataAttributes: [],
      example: `<script>\n  import { Spinner } from 'sigil-ui'\n</script>\n\n<Spinner />`
    },
    {
      name: 'Field',
      path: 'field',
      description:
        'Form field wrapper: label, control, hint and error with generated id, aria-describedby and aria-invalid wiring. The children snippet receives the props to spread on the control.',
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label text, bound to the control via for/id.'
        },
        { name: 'hint', type: 'string', description: 'Help text under the control.' },
        {
          name: 'error',
          type: 'string',
          description: 'Error text; replaces the hint and sets role=alert plus aria-invalid.'
        },
        {
          name: 'labelProps',
          type: 'HTMLLabelAttributes',
          description: 'Extra props for the label.'
        },
        classProp,
        childrenProp
      ],
      classes: ['sig-field', 'sig-field-label', 'sig-field-hint', 'sig-field-error'],
      dataAttributes: [],
      example: `<script>\n  import { Field, Input } from 'sigil-ui'\n</script>\n\n<Field label="Email" hint="We never share it." error={err}>\n  {#snippet children({ props })}\n    <Input {...props} type="email" />\n  {/snippet}\n</Field>`
    },
    {
      name: 'Table',
      path: 'table',
      description:
        'Table namespace: Root (scroll wrapper + table), Head, Body, Row, H, Cell, Caption. Semantic table markup with token-driven borders and hover fill.',
      props: [classProp, childrenProp],
      classes: [
        'sig-table-wrap',
        'sig-table',
        'sig-table-head',
        'sig-table-body',
        'sig-table-row',
        'sig-table-h',
        'sig-table-cell',
        'sig-table-caption'
      ],
      dataAttributes: [],
      example: `<script>\n  import { Table } from 'sigil-ui'\n</script>\n\n<Table.Root>\n  <Table.Head>\n    <Table.Row><Table.H>Name</Table.H><Table.H>Status</Table.H></Table.Row>\n  </Table.Head>\n  <Table.Body>\n    <Table.Row><Table.Cell>api</Table.Cell><Table.Cell>up</Table.Cell></Table.Row>\n  </Table.Body>\n</Table.Root>`
    },
    {
      name: 'Sheet',
      path: 'sheet',
      description:
        'Sheet namespace: Root (bind:open), Trigger, Portal, Overlay, Content (side: left/right/top/bottom), Title, Description, Close. Edge-anchored dialog with focus trap, scroll lock, Escape and overlay dismissal, focus restore.',
      props: [
        { name: 'open', type: 'boolean', bindable: true, description: 'Sheet.Root open state.' },
        {
          name: 'side',
          type: "'left' | 'right' | 'top' | 'bottom'",
          default: 'right',
          description: 'Edge the Sheet.Content slides in from.'
        },
        classProp,
        childrenProp
      ],
      classes: [
        'sig-sheet',
        'sig-sheet-trigger',
        'sig-sheet-overlay',
        'sig-sheet-title',
        'sig-sheet-description',
        'sig-sheet-close'
      ],
      dataAttributes: ['data-side'],
      example: `<script>\n  import { Sheet, Button } from 'sigil-ui'\n</script>\n\n<Sheet.Root>\n  <Sheet.Trigger class="sig-btn">Open</Sheet.Trigger>\n  <Sheet.Portal>\n    <Sheet.Overlay />\n    <Sheet.Content side="right">\n      <Sheet.Title>Details</Sheet.Title>\n      <Sheet.Description>Panel content.</Sheet.Description>\n      <Sheet.Close class="sig-btn">Close</Sheet.Close>\n    </Sheet.Content>\n  </Sheet.Portal>\n</Sheet.Root>`
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
    },
    {
      name: 'sigil css',
      entry: 'sigil-ui/css',
      usage: `// sigil.config.mjs\nimport { defineConfig } from 'sigil-ui/css'\n\nexport default defineConfig({\n  include: ['./src/**/*.{svelte,ts}'],\n  tokens: { colors: { sig: { accent: 'var(--sig-accent)' } } }\n})\n\n// then: npx sigil-ui css\n// use: import { css } from '../styled-system/css'`
    }
  ]
}
