<script lang="ts">
  import {
    Accordion,
    Alert,
    AlertDialog,
    AspectRatio,
    Avatar,
    AvatarGroup,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Chart,
    Checkbox,
    Combobox,
    Command,
    ContextMenu,
    CopyButton,
    CountUp,
    createTheme,
    DataTable,
    Dialog,
    DropdownMenu,
    Empty,
    Field,
    FileUpload,
    GridOverlay,
    HoverCard,
    Input,
    Kbd,
    manifest,
    Marquee,
    Measure,
    Menubar,
    Pagination,
    Pane,
    PaneGroup,
    PaneResizer,
    Popover,
    Presence,
    Progress,
    RadioGroup,
    Reveal,
    ScrollArea,
    Select,
    Sheet,
    Skeleton,
    Slider,
    Spinner,
    Stat,
    Stepper,
    Switch,
    Table,
    Tabs,
    TagsInput,
    Textarea,
    Timeline,
    toast,
    Toaster,
    Toggle,
    ToggleGroup,
    Tooltip,
    Tree
  } from 'sigil-ui'
  import { Check, Copy, Moon, Sun } from '@lucide/svelte'
  import { css } from '../styled-system/css'
  import { flex, stack } from '../styled-system/patterns'
  import { chip } from '../styled-system/recipes'
  import { sizes, fmt } from './sizes'
  import Code from './Code.svelte'
  import GithubIcon from './GithubIcon.svelte'
  import Logo from './Logo.svelte'
  import ManifestPanel from './ManifestPanel.svelte'
  import Spec from './Spec.svelte'

  const theme = createTheme()
  const jump = (hash: string) => () =>
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  let switched = $state(false)
  let dialogOpen = $state(false)
  let agreed = $state(true)
  let plan = $state('pro')
  let radioPlan = $state('free')
  let tab = $state('usage')
  let volume = $state(40)
  let bold = $state(false)
  let debug = $state(false)
  let sheetOpen = $state(false)
  let servicePage = $state(1)
  let paletteOpen = $state(false)
  let pickedFruit = $state('')
  let align = $state('left')
  let formats = $state<string[]>(['bold'])
  let tags = $state(['svelte', 'runes'])
  let files = $state<File[]>([])
  let wizard = $state(1)
  let cardShown = $state(true)
  let confirmOpen = $state(false)
  let apiFilter = $state('')

  let pgComponent = $state<'Button' | 'Badge' | 'Alert'>('Button')
  let pgVariant = $state<'primary' | 'secondary' | 'ghost' | 'danger'>('primary')
  let pgBadgeTone = $state<'neutral' | 'accent' | 'danger' | 'success' | 'warning' | 'info'>(
    'accent'
  )
  let pgAlertTone = $state<'default' | 'success' | 'warning' | 'danger' | 'info'>('info')
  let pgDisabled = $state(false)
  let pgText = $state('Save changes')

  const pgCode = $derived.by(() => {
    if (pgComponent === 'Badge') return `<Badge tone="${pgBadgeTone}">${pgText}</Badge>`
    if (pgComponent === 'Alert')
      return `<Alert tone="${pgAlertTone}" title="${pgText}">\n  Supporting description goes here.\n</Alert>`
    const variant = pgVariant === 'primary' ? '' : ` variant="${pgVariant}"`
    const disabled = pgDisabled ? ' disabled' : ''
    return `<Button${variant}${disabled}>${pgText}</Button>`
  })

  const ping = [
    42, 38, 55, 47, 61, 44, 39, 58, 66, 49, 43, 52, 240, 48, 45, 0, 51, 44, 57, 63, 46, 41, 53, 190,
    47, 44, 50, 0, 55, 42
  ]

  const footprint = [
    `library ${fmt(sizes.js.gz)} gz`,
    `components.min.css ${fmt(sizes.componentsMin.gz)} gz`,
    `headless ${fmt(sizes.headless.gz)} gz`,
    `engine ${fmt(sizes.engine.gz)}`
  ]

  const treeItems = [
    {
      id: 'src',
      label: 'src',
      children: [
        {
          id: 'lib',
          label: 'lib',
          children: [
            { id: 'button', label: 'button' },
            { id: 'dialog', label: 'dialog' }
          ]
        },
        { id: 'tests', label: 'tests' }
      ]
    },
    { id: 'site', label: 'site', children: [{ id: 'pages', label: 'pages' }] },
    { id: 'pkg', label: 'package.json' }
  ]
  const heat = [
    [2, 5, 1, 8, 4, 0, 3],
    [6, 3, 9, 2, 7, 5, 1],
    [1, 8, 4, 6, 3, 9, 5]
  ]
  const heatDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const scatter = [
    { x: 1, y: 3 },
    { x: 2, y: 7 },
    { x: 3, y: 4 },
    { x: 4, y: 9 },
    { x: 5, y: 6 },
    { x: 6, y: 11 },
    { x: 7, y: 8 },
    { x: 8, y: 13 }
  ]

  const traffic = [12, 18, 14, 22, 19, 28, 26, 34, 31, 42, 38, 47]
  const latency = [220, 180, 240, 160, 190, 140, 170, 150, 165, 132]
  const deploys = [
    { label: 'Mon', value: 4 },
    { label: 'Tue', value: 7 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 9 },
    { label: 'Fri', value: 6 }
  ]
  const share = [
    { label: 'api', value: 46 },
    { label: 'web', value: 34 },
    { label: 'workers', value: 20 }
  ]
  const services = [
    { name: 'api', status: 'up', uptime: '99.98%', requests: 1284021 },
    { name: 'web', status: 'up', uptime: '99.91%', requests: 842310 },
    { name: 'workers', status: 'up', uptime: '100%', requests: 98110 },
    { name: 'ingest', status: 'degraded', uptime: '98.41%', requests: 410876 },
    { name: 'scheduler', status: 'up', uptime: '99.99%', requests: 12204 },
    { name: 'edge-cache', status: 'up', uptime: '99.87%', requests: 2201450 },
    { name: 'mailer', status: 'down', uptime: '91.02%', requests: 8012 },
    { name: 'search', status: 'up', uptime: '99.76%', requests: 300655 }
  ]
  const stats = [
    `${manifest.components.length} components`,
    '0 runtime deps',
    '0 primitive libs',
    `${manifest.adapters.length} styling adapters`,
    'vanilla headless'
  ]

  const installCode = 'pnpm add sigil-ui\n\nnpx sigil-ui list\nnpx sigil-ui docs Button'
  const useCode =
    "import 'sigil-ui/theme.css'\nimport { Button } from 'sigil-ui'\n\n<Button variant=\"secondary\" onclick={save}>Save</Button>"
  const cliCode =
    'npx sigil-ui list\nnpx sigil-ui docs Button\nnpx sigil-ui tokens\nnpx sigil-ui doctor'
  const metaCode =
    "import { manifest } from 'sigil-ui'\n// or fetch sigil-ui/manifest.json\n// llms.txt and llms-full.txt are served at this site's root"
  const vanillaCssCode =
    '<link rel="stylesheet" href="sigil-ui/theme.css" />\n<link rel="stylesheet" href="sigil-ui/components.css" />\n\n<button class="sig-btn" data-variant="primary">Save</button>'
  const vanillaJsCode =
    "import { attachTabs, createOverlay, attachAll, createTheme } from 'sigil-ui/headless'\n\nattachAll(document.body)\n// or wire one structure:\nattachTabs(document.querySelector('.sig-tabs'))\ncreateTheme()"

  const section = css({
    scrollMarginTop: '20',
    borderTop: '1px solid',
    borderColor: 'color-mix(in oklab, var(--sig-fg) 8%, transparent)',
    py: '10'
  })
  const kicker = css({
    fontFamily: 'mono',
    fontSize: 'xs',
    fontWeight: 'medium',
    letterSpacing: 'wider',
    textTransform: 'uppercase',
    color: 'sig.accent',
    mb: '2'
  })
  const h2 = css({ fontSize: '2xl', fontWeight: 'semibold', letterSpacing: 'tight' })
  const lead = css({ mt: '2', color: 'sig.muted' })
  const link = css({ color: 'sig.muted', _hover: { color: 'sig.fg' } })
  const navLink = css({
    fontSize: 'sm',
    fontWeight: 'medium',
    color: 'sig.muted',
    textDecoration: 'none',
    textUnderlineOffset: '5px',
    transition: 'color 150ms',
    _hover: { color: 'sig.fg', textDecoration: 'underline' }
  })
  const wide = css({ gridColumn: '1 / -1' })
  const iconBtn = css({
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    bg: 'transparent',
    border: 'none',
    p: '0',
    color: 'sig.muted',
    _hover: { color: 'sig.fg' }
  })
</script>

<a
  href="#top"
  class={css({
    position: 'absolute',
    left: '-9999px',
    top: '0',
    zIndex: '50',
    _focusVisible: {
      position: 'fixed',
      left: '3',
      top: '3',
      bg: 'sig.accent',
      color: 'sig.accent-fg',
      px: '3',
      py: '2',
      rounded: 'sig',
      fontSize: 'sm'
    }
  })}
>
  Skip to content
</a>

<header
  class={css({
    position: 'sticky',
    top: '0',
    zIndex: '10',
    borderBottom: '1px solid',
    borderColor: 'sig.border',
    backgroundColor: 'color-mix(in oklab, var(--sig-bg) 82%, transparent)',
    backdropFilter: 'blur(10px)'
  })}
>
  <div
    class={flex({
      mx: 'auto',
      maxW: '6xl',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: '4',
      h: '14'
    })}
  >
    <a
      href="#top"
      class={flex({
        alignItems: 'center',
        gap: '2',
        fontWeight: 'semibold',
        color: 'sig.fg',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        flexShrink: '0'
      })}
    >
      <Logo size={22} />
      sigil-ui
    </a>
    <nav class={flex({ alignItems: 'center', gap: '5', fontSize: 'sm' })}>
      <span class={css({ display: { base: 'none', md: 'flex' }, alignItems: 'center', gap: '5' })}>
        <a class={navLink} href="#playground">playground</a>
        <a class={navLink} href="#components">components</a>
        <a class={navLink} href="#adapters">adapters</a>
        <a class={navLink} href="#vanilla">vanilla</a>
        <a class={navLink} href="#tokens">tokens</a>
        <a class={navLink} href="#api">api</a>
      </span>
      <button
        class={iconBtn}
        aria-label="Open command palette"
        onclick={() => (paletteOpen = true)}
      >
        <Kbd>⌘K</Kbd>
      </button>
      <a
        class={iconBtn}
        href="https://github.com/Quad4-Software/sigil-ui"
        rel="noopener"
        aria-label="sigil-ui on GitHub"
      >
        <GithubIcon size={17} />
      </a>
      <button class={iconBtn} aria-label="Toggle theme" onclick={() => theme.toggle()}>
        {#if theme.resolved === 'dark'}
          <Sun size={16} />
        {:else}
          <Moon size={16} />
        {/if}
      </button>
    </nav>
  </div>
</header>

<main id="top" class={css({ mx: 'auto', maxW: '6xl', px: '4', pb: '24' })}>
  <section class={css({ position: 'relative', pt: '10', pb: '12' })}>
    <div
      aria-hidden="true"
      class={css({ position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none' })}
    >
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          background:
            'radial-gradient(60rem 26rem at 50% -6rem, color-mix(in oklab, var(--sig-accent) 14%, transparent), transparent 70%)'
        })}
      ></div>
      <div
        class={css({
          position: 'absolute',
          inset: '0',
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--sig-fg) 10%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(52rem 26rem at 50% 0%, black 30%, transparent 80%)'
        })}
      ></div>
    </div>
    <div class={css({ position: 'relative' })}>
      <h1
        class={css({
          fontSize: { base: '4xl', sm: '5xl', lg: '6xl' },
          maxW: '3xl',
          fontWeight: 'bold',
          letterSpacing: 'tight',
          lineHeight: 'tight',
          textWrap: 'balance'
        })}
      >
        Accessible components for
        <span class={css({ color: 'sig.accent' })}>Svelte 5 and vanilla JS</span>
      </h1>
      <p
        class={css({
          mt: '4',
          maxW: '2xl',
          fontSize: 'lg',
          color: 'sig.muted',
          lineHeight: 'relaxed'
        })}
      >
        Buttons, dialogs, tables, charts, toasts and resizable panes with accessibility built in.
        Style them with Tailwind, UnoCSS, Panda CSS, the bundled sigil css engine, or plain CSS.
        Zero runtime dependencies, no lock-in.
      </p>
      <div class={flex({ mt: '6', flexWrap: 'wrap', gap: '3' })}>
        <a
          href="#components"
          class={`sig-btn ${css({ textDecoration: 'none' })}`}
          data-variant="primary"
        >
          Browse components
        </a>
        <a
          href="https://github.com/Quad4-Software/sigil-ui"
          rel="noopener"
          class={`sig-btn ${css({ textDecoration: 'none' })}`}
          data-variant="secondary"
        >
          <GithubIcon size={15} /> GitHub
        </a>
      </div>
      <div class={flex({ mt: '6', flexWrap: 'wrap', gap: '2' })}>
        {#each stats as stat (stat)}
          <span class={chip({ tone: stat === '0 runtime deps' ? 'accent' : undefined })}
            >{stat}</span
          >
        {/each}
      </div>
      <p class={css({ mt: '3', fontFamily: 'mono', fontSize: 'xs', color: 'sig.muted' })}>
        {footprint.join('  ·  ')}
      </p>
    </div>
    <div
      class={css({
        display: 'grid',
        mt: '8',
        gap: '3',
        gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' }
      })}
    >
      <Code title="install">{installCode}</Code>
      <Code title="use">{useCode}</Code>
    </div>
  </section>

  <section id="playground" class={section}>
    <p class={kicker}>Live props, generated markup</p>
    <h2 class={h2}>Playground</h2>
    <p class={lead}>
      Flip the props, watch the component react, copy the generated code. The panes are the
      library's own resizable PaneGroup.
    </p>
    <PaneGroup
      direction="horizontal"
      class={css({
        mt: '6',
        h: '96',
        overflow: 'hidden',
        rounded: 'sig',
        border: '1px solid',
        borderColor: 'color-mix(in oklab, var(--sig-fg) 9%, transparent)'
      })}
    >
      <Pane defaultSize={28} minSize={20}>
        <div class={stack({ flex: '1', gap: '4', bg: 'sig.surface', p: '4', overflowY: 'auto' })}>
          <div class={stack({ gap: '2' })}>
            <span class={css({ fontSize: 'xs', fontWeight: 'medium', color: 'sig.muted' })}>
              Component
            </span>
            <ToggleGroup.Root bind:value={pgComponent} aria-label="Playground component">
              <ToggleGroup.Item value="Button">Button</ToggleGroup.Item>
              <ToggleGroup.Item value="Badge">Badge</ToggleGroup.Item>
              <ToggleGroup.Item value="Alert">Alert</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          {#if pgComponent === 'Button'}
            <Field label="Variant">
              {#snippet children(props)}
                <Select {...props} bind:value={pgVariant}>
                  <option value="primary">primary</option>
                  <option value="secondary">secondary</option>
                  <option value="ghost">ghost</option>
                  <option value="danger">danger</option>
                </Select>
              {/snippet}
            </Field>
            <label class={flex({ alignItems: 'center', gap: '2', fontSize: 'sm' })}>
              <Switch bind:checked={pgDisabled} aria-label="Disabled" /> Disabled
            </label>
          {:else if pgComponent === 'Badge'}
            <Field label="Tone">
              {#snippet children(props)}
                <Select {...props} bind:value={pgBadgeTone}>
                  <option value="neutral">neutral</option>
                  <option value="accent">accent</option>
                  <option value="success">success</option>
                  <option value="warning">warning</option>
                  <option value="danger">danger</option>
                  <option value="info">info</option>
                </Select>
              {/snippet}
            </Field>
          {:else}
            <Field label="Tone">
              {#snippet children(props)}
                <Select {...props} bind:value={pgAlertTone}>
                  <option value="default">default</option>
                  <option value="success">success</option>
                  <option value="warning">warning</option>
                  <option value="danger">danger</option>
                  <option value="info">info</option>
                </Select>
              {/snippet}
            </Field>
          {/if}
          <Field label={pgComponent === 'Alert' ? 'Title' : 'Label'}>
            {#snippet children(props)}
              <Input {...props} bind:value={pgText} />
            {/snippet}
          </Field>
        </div>
      </Pane>
      <PaneResizer />
      <Pane>
        <PaneGroup direction="vertical">
          <Pane minSize={30}>
            <div
              class={css({
                flex: '1',
                display: 'grid',
                placeItems: 'center',
                p: '4',
                overflowY: 'auto'
              })}
            >
              {#if pgComponent === 'Badge'}
                <Badge tone={pgBadgeTone}>{pgText}</Badge>
              {:else if pgComponent === 'Alert'}
                <Alert tone={pgAlertTone} title={pgText}>Supporting description goes here.</Alert>
              {:else}
                <Button variant={pgVariant} disabled={pgDisabled}>{pgText}</Button>
              {/if}
            </div>
          </Pane>
          <PaneResizer />
          <Pane defaultSize={38} minSize={20}>
            <div class={css({ flex: '1', overflowY: 'auto', bg: 'sig.surface' })}>
              <pre
                class={css({
                  p: '4',
                  fontFamily: 'mono',
                  fontSize: 'sm',
                  color: 'sig.fg',
                  whiteSpace: 'pre-wrap'
                })}>{pgCode}</pre>
            </div>
          </Pane>
        </PaneGroup>
      </Pane>
    </PaneGroup>
  </section>

  <section id="components" class={section}>
    <p class={kicker}>{manifest.components.length} parts, one styling contract</p>
    <h2 class={h2}>Components</h2>
    <p class={lead}>Live. Every class and data attribute below is a public styling hook.</p>

    <div
      class={css({
        display: 'grid',
        mt: '8',
        gap: '6',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(2, 1fr)' }
      })}
    >
      {#snippet statusCell(row: { status: string })}
        <Badge tone={row.status === 'up' ? 'success' : row.status === 'down' ? 'danger' : 'warning'}
          >{row.status}</Badge
        >
      {/snippet}
      {#snippet reqCell(row: { requests: number })}
        {row.requests.toLocaleString()}
      {/snippet}
      <Reveal class={wide}
        ><Spec
          label="Dashboard"
          hint="Card, Stat, Progress, CountUp, Sparkline"
          for={['Card', 'Stat', 'Progress', 'CountUp', 'Chart']}
        >
          <div
            class={css({
              display: 'grid',
              gap: '4',
              gridTemplateColumns: { base: '1fr', sm: 'repeat(3, 1fr)' }
            })}
          >
            <Card.Root>
              <Card.Content class={stack({ gap: '3' })}>
                <div class={stack({ gap: '1', alignItems: 'start' })}>
                  <span
                    class={css({
                      fontSize: 'xs',
                      fontWeight: 'medium',
                      textTransform: 'uppercase',
                      letterSpacing: 'wider',
                      color: 'sig.muted'
                    })}>Requests</span
                  >
                  <span
                    class={css({
                      fontSize: '2xl',
                      fontWeight: 'bold',
                      lineHeight: 'none',
                      color: 'sig.fg'
                    })}
                  >
                    <CountUp value={1284021} format={(n) => Math.round(n).toLocaleString()} />
                  </span>
                  <Badge tone="success">+12.5%</Badge>
                </div>
                <Chart.Sparkline data={traffic} label="Requests over 12 hours" filled />
              </Card.Content>
            </Card.Root>
            <Card.Root>
              <Card.Content class={stack({ gap: '3' })}>
                <Stat label="Churn" value="1.9%" delta={-0.4} deltaLabel="pts" />
                <Chart.Sparkline data={latency} label="Latency trend" />
              </Card.Content>
            </Card.Root>
            <Card.Root>
              <Card.Header>
                <Card.Title>Storage</Card.Title>
                <Card.Description>68% of quota</Card.Description>
              </Card.Header>
              <Card.Content>
                <Progress value={68} label="Storage used" />
              </Card.Content>
            </Card.Root>
          </div>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec label="Charts" hint="pure SVG, viewBox-scaled, role=img" for="Chart">
          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              alignItems: 'start'
            })}
          >
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Line</span>
              <Chart.Line data={traffic} label="Traffic" dots />
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Bar</span>
              <Chart.Bar data={deploys} label="Deploys per day" />
            </div>
            <div class={stack({ gap: '2', alignItems: 'center' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Donut</span>
              <Chart.Donut data={share} label="Traffic share" size={170}>
                <span class={css({ fontSize: 'lg', fontWeight: 'semibold' })}>100%</span>
              </Chart.Donut>
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Radar</span>
              <Chart.Radar
                labels={['Speed', 'Uptime', 'Scale', 'Cost', 'Reach']}
                data={[8, 6, 7, 5, 9]}
                label="Service scores"
                size={200}
              />
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Heatmap</span>
              <Chart.Heatmap
                data={heat}
                xLabels={heatDays}
                yLabels={['api', 'web', 'jobs']}
                label="Requests by hour"
              />
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Scatter</span>
              <Chart.Scatter data={scatter} label="Latency vs size" />
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>
                Uptime · ping latency, status-page pills
              </span>
              <Chart.Uptime data={ping} warnAt={150} summary label="Edge latency, last 30 min" />
            </div>
          </div>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec
          label="Panes"
          hint="drag the separator or focus it and use arrow keys"
          for="PaneGroup"
        >
          <PaneGroup
            direction="horizontal"
            class={css({
              h: '80',
              overflow: 'hidden',
              rounded: 'sig',
              border: '1px solid',
              borderColor: 'sig.border'
            })}
          >
            <Pane defaultSize={30} minSize={15}>
              <div class={stack({ flex: '1', gap: '1', bg: 'sig.surface', p: '3' })}>
                {#each ['dashboard', 'analytics', 'settings'] as item (item)}
                  <span
                    class={css({
                      rounded: 'sig',
                      px: '2',
                      py: '1.5',
                      fontSize: 'xs',
                      color: 'sig.muted',
                      _first: { bg: 'sig.bg', color: 'sig.fg' }
                    })}>{item}</span
                  >
                {/each}
              </div>
            </Pane>
            <PaneResizer />
            <Pane>
              <PaneGroup direction="vertical">
                <Pane minSize={30}>
                  <div
                    class={stack({
                      flex: '1',
                      gap: '1.5',
                      p: '4',
                      fontFamily: 'mono',
                      fontSize: 'xs'
                    })}
                  >
                    <span class={css({ color: 'sig.muted' })}>// App.svelte</span>
                    <span
                      ><span class={css({ color: 'sig.accent' })}>import</span>
                      {'{ PaneGroup, Pane }'}
                      from 'sigil-ui'</span
                    >
                    <span class={css({ color: 'sig.muted' })}>&nbsp;</span>
                    <span
                      ><span class={css({ color: 'sig.accent' })}>&lt;PaneGroup</span>
                      direction="horizontal"&gt;</span
                    >
                  </div>
                </Pane>
                <PaneResizer />
                <Pane defaultSize={30} minSize={15}>
                  <div
                    class={stack({
                      flex: '1',
                      gap: '1',
                      bg: 'sig.surface',
                      p: '3',
                      fontFamily: 'mono',
                      fontSize: 'xs',
                      color: 'sig.muted'
                    })}
                  >
                    <span>$ pnpm dev</span>
                    <span class={css({ color: 'sig.success' })}>ready in 240ms</span>
                  </div>
                </Pane>
              </PaneGroup>
            </Pane>
          </PaneGroup>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec
          label="Forms"
          hint="Input, Textarea, Select, Checkbox, RadioGroup, Slider, Switch, Toggle"
          for={[
            'Input',
            'Textarea',
            'Select',
            'Checkbox',
            'RadioGroup',
            'Slider',
            'Switch',
            'Toggle',
            'ToggleGroup',
            'Field'
          ]}
        >
          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }
            })}
          >
            <div class={stack({ gap: '3' })}>
              <Field label="Project name" hint="Shown on the dashboard.">
                {#snippet children(props)}
                  <Input {...props} placeholder="sigil-ui" />
                {/snippet}
              </Field>
              <Textarea placeholder="Description" aria-label="Description" />
              <Select bind:value={plan} aria-label="Plan">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="team">Team</option>
              </Select>
              <Slider bind:value={volume} label="Volume" />
              <p class={css({ fontSize: 'sm', color: 'sig.muted' })}>Volume {volume}%</p>
            </div>
            <div class={stack({ gap: '3' })}>
              <RadioGroup.Root bind:value={radioPlan}>
                <RadioGroup.Item value="free">Free plan</RadioGroup.Item>
                <RadioGroup.Item value="pro">Pro plan</RadioGroup.Item>
                <RadioGroup.Item value="team" disabled>Team plan</RadioGroup.Item>
              </RadioGroup.Root>
              <label class={flex({ alignItems: 'center', gap: '2', fontSize: 'sm' })}>
                <Checkbox bind:checked={agreed} /> Email me a weekly digest
              </label>
              <div class={flex({ alignItems: 'center', gap: '3' })}>
                <Switch bind:checked={switched} aria-label="demo switch" />
                <Toggle bind:pressed={bold} aria-label="Bold">B</Toggle>
                <span class={css({ fontSize: 'sm', color: 'sig.muted' })}>
                  {switched ? 'on' : 'off'}, {bold ? 'bold' : 'plain'}
                </span>
              </div>
              <div class={stack({ gap: '2' })}>
                <ToggleGroup.Root bind:value={align} aria-label="Text align">
                  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
                  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
                  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
                </ToggleGroup.Root>
                <ToggleGroup.Root type="multiple" bind:value={formats} aria-label="Text format">
                  <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
                  <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
                  <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
                </ToggleGroup.Root>
              </div>
            </div>
          </div>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec label="Data entry" hint="TagsInput, FileUpload" for={['TagsInput', 'FileUpload']}>
          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }
            })}
          >
            <div class={stack({ gap: '3' })}>
              <span class={css({ fontSize: 'sm', color: 'sig.muted' })}>
                Enter or comma adds, Backspace removes. {tags.length} tags.
              </span>
              <TagsInput bind:tags max={6} placeholder="Add a keyword" />
            </div>
            <FileUpload bind:files multiple hint="Drop to attach, click to browse" />
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec label="Buttons" hint="variants driven by data-variant" for="Button">
          <div class={flex({ flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
            <Button class={css({ rounded: 'full' })}>rounded via class</Button>
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec
          label="Overlays"
          hint="Dialog traps focus, Popover and Menu dismiss on outside click"
          for={['Dialog', 'Popover', 'DropdownMenu', 'Sheet', 'HoverCard', 'AlertDialog']}
        >
          <div class={flex({ flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>
            <Dialog.Root bind:open={dialogOpen}>
              <Dialog.Trigger class="sig-btn" data-variant="secondary">Open dialog</Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content>
                  <Dialog.Title>sigil-ui dialog</Dialog.Title>
                  <Dialog.Description>
                    Focus is trapped, aria attributes are wired, Escape dismisses. Restyle any part
                    through its sig-* class.
                  </Dialog.Description>
                  <Dialog.Close class="sig-btn" data-variant="primary">Close</Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <Popover.Root>
              <Popover.Trigger class="sig-btn" data-variant="secondary">Popover</Popover.Trigger>
              <Popover.Content side="bottom" align="start">
                <p class={css({ fontSize: 'sm' })}>Anchored content, side and align props.</p>
              </Popover.Content>
            </Popover.Root>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger class="sig-btn" data-variant="secondary">
                Menu
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onSelect={() => toast.info('Profile')}>Profile</DropdownMenu.Item
                >
                <DropdownMenu.Item onSelect={() => toast.info('Settings')}
                  >Settings</DropdownMenu.Item
                >
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => toast.danger('Signed out')}>
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <Sheet.Root bind:open={sheetOpen}>
              <Sheet.Trigger class="sig-btn" data-variant="secondary">Sheet</Sheet.Trigger>
              <Sheet.Portal>
                <Sheet.Overlay />
                <Sheet.Content side="right">
                  <Sheet.Title>sigil-ui sheet</Sheet.Title>
                  <Sheet.Description>
                    Edge-anchored panel with the same focus trap, Escape and overlay dismissal as
                    Dialog.
                  </Sheet.Description>
                  <Sheet.Close class="sig-btn" data-variant="primary">Close</Sheet.Close>
                </Sheet.Content>
              </Sheet.Portal>
            </Sheet.Root>

            <HoverCard.Root>
              <HoverCard.Trigger class="sig-btn" data-variant="secondary">
                Hover card
              </HoverCard.Trigger>
              <HoverCard.Content>
                <div class={stack({ gap: '1' })}>
                  <span class={css({ fontSize: 'sm', fontWeight: 'medium' })}>@sigil</span>
                  <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>
                    Opens on hover or focus, waits for the pointer.
                  </span>
                </div>
              </HoverCard.Content>
            </HoverCard.Root>

            <AlertDialog.Root bind:open={confirmOpen}>
              <AlertDialog.Trigger class="sig-btn" data-variant="danger">
                Alert dialog
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Title>Delete deployment?</AlertDialog.Title>
                <AlertDialog.Description>
                  This removes the deployment record. It cannot be undone.
                </AlertDialog.Description>
                <div class={flex({ mt: '4', justifyContent: 'flex-end', gap: '2' })}>
                  <AlertDialog.Cancel />
                  <AlertDialog.Action
                    tone="danger"
                    onclick={() => toast.success('Deployment deleted')}
                  >
                    Delete
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec
          label="Feedback"
          hint="Badge, Avatar, Tooltip, Alert, Skeleton, Toaster"
          for={['Badge', 'Avatar', 'Tooltip', 'Alert', 'Skeleton', 'Toaster']}
        >
          <div class={stack({ gap: '3' })}>
            <div class={flex({ flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>
              <Badge>neutral</Badge>
              <Badge tone="accent">accent</Badge>
              <Badge tone="danger">danger</Badge>
              <Avatar fallback="Ada Lovelace" alt="Ada Lovelace" />
              <Spinner />
              <Tooltip text="Pure CSS, aria-describedby wired">
                {#snippet children({ props })}
                  <Button variant="secondary" {...props}>Tooltip</Button>
                {/snippet}
              </Tooltip>
              <Button variant="secondary" onclick={() => toast.success('Deploy finished')}>
                Success toast
              </Button>
              <Button
                variant="secondary"
                onclick={() =>
                  toast.danger('Deploy failed', {
                    description: 'Rollback started automatically.',
                    action: { label: 'Retry', onclick: () => toast.info('Retrying') }
                  })}
              >
                Error toast
              </Button>
            </div>
            <Alert tone="info" title="Scheduled maintenance">
              The API will be read-only on Sunday between 02:00 and 03:00 UTC.
            </Alert>
            <Skeleton class={css({ h: '8', maxW: 'md' })} />
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec label="Table" hint="semantic markup, token borders, row hover" for="Table">
          <Table.Root>
            <Table.Head>
              <Table.Row>
                <Table.H scope="col">Service</Table.H>
                <Table.H scope="col">Status</Table.H>
                <Table.H scope="col">Uptime</Table.H>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>api</Table.Cell>
                <Table.Cell><Badge tone="success">up</Badge></Table.Cell>
                <Table.Cell>99.98%</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>web</Table.Cell>
                <Table.Cell><Badge tone="warning">degraded</Badge></Table.Cell>
                <Table.Cell>98.41%</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>workers</Table.Cell>
                <Table.Cell><Badge tone="success">up</Badge></Table.Cell>
                <Table.Cell>100%</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec
          label="Data table"
          hint="sortable columns, aria-sort, Pagination"
          for={['DataTable', 'Pagination']}
        >
          {@const cols = [
            { key: 'name', label: 'Service', sortable: true },
            { key: 'status', label: 'Status', sortable: true, cell: statusCell },
            { key: 'uptime', label: 'Uptime', sortable: true, align: 'right' as const },
            {
              key: 'requests',
              label: 'Requests',
              sortable: true,
              align: 'right' as const,
              cell: reqCell
            }
          ]}
          <DataTable columns={cols} rows={services} caption="Service health, last 24h" />
          <div class={flex({ mt: '4', alignItems: 'center', justifyContent: 'space-between' })}>
            <span class={css({ fontSize: 'sm', color: 'sig.muted' })}>
              Page {servicePage} of 6
            </span>
            <Pagination bind:page={servicePage} pages={6} />
          </div>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec
          label="Navigation"
          hint="Menubar, Tabs, Accordion, Breadcrumb, Kbd"
          for={['Menubar', 'Tabs', 'Accordion', 'Breadcrumb', 'Kbd']}
        >
          <div class={stack({ gap: '5' })}>
            <Menubar.Root>
              <Menubar.Menu>
                <Menubar.Trigger>File</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item onSelect={() => toast.info('New file')}>New file</Menubar.Item>
                  <Menubar.Item onSelect={() => toast.info('Save')}>Save</Menubar.Item>
                  <Menubar.Separator />
                  <Menubar.Item onSelect={() => toast.info('Quit')}>Quit</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger>Edit</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item onSelect={() => toast.info('Copy')}>Copy</Menubar.Item>
                  <Menubar.Item onSelect={() => toast.info('Paste')} disabled>Paste</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
              <Menubar.Menu>
                <Menubar.Trigger>View</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item onSelect={() => theme.toggle()}>Toggle theme</Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>
            </Menubar.Root>
            <Breadcrumb.Root>
              <Breadcrumb.Item><a href="#components">Home</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="#components">Library</a></Breadcrumb.Item>
              <Breadcrumb.Item current>Navigation</Breadcrumb.Item>
            </Breadcrumb.Root>
            <Tabs.Root bind:value={tab}>
              <Tabs.List>
                <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
                <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="usage">
                <p class={css({ fontSize: 'sm', color: 'sig.muted' })}>
                  Arrow keys move between tabs. Home and End jump.
                </p>
              </Tabs.Content>
              <Tabs.Content value="billing">
                <p class={css({ fontSize: 'sm', color: 'sig.muted' })}>Billing panel content.</p>
              </Tabs.Content>
            </Tabs.Root>
            <Accordion.Root>
              <Accordion.Item value="a">
                <Accordion.Trigger>Is a CSS framework required?</Accordion.Trigger>
                <Accordion.Content>
                  No. Components ship with their own structural styles and --sig-* fallbacks.
                  Adapters are optional.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="b">
                <Accordion.Trigger>How do agents consume it?</Accordion.Trigger>
                <Accordion.Content>
                  Through the manifest.json export, llms.txt docs and the npx sigil-ui CLI.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
            <p class={css({ fontSize: 'sm', color: 'sig.muted' })}>
              Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open a command menu.
            </p>
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec
          label="Command palette"
          hint="Cmd+K menu, keyboard filter and navigation"
          for="Command"
        >
          <div class={stack({ gap: '4' })}>
            <p class={css({ fontSize: 'sm', color: 'sig.muted' })}>
              Try <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>, or:
            </p>
            <Button variant="secondary" onclick={() => (paletteOpen = true)}>Open palette</Button>
            <Command.Root
              class={css({ rounded: 'sig', border: '1px solid', borderColor: 'sig.border' })}
            >
              <Command.Input placeholder="Type a command" />
              <Command.List>
                <Command.Empty>No results.</Command.Empty>
                <Command.Item value="docs" keywords={['documentation', 'help']}>
                  Open docs
                </Command.Item>
                <Command.Item value="theme" keywords={['dark', 'light']}>Toggle theme</Command.Item>
                <Command.Item value="repo" keywords={['github', 'source']}>
                  Open repository
                </Command.Item>
              </Command.List>
            </Command.Root>
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec label="Combobox" hint="filterable listbox with aria-activedescendant" for="Combobox">
          <div class={stack({ gap: '3' })}>
            <Combobox.Root bind:value={pickedFruit}>
              <Combobox.Input placeholder="Pick a fruit" />
              <Combobox.Content>
                <Combobox.Empty>No fruit found.</Combobox.Empty>
                {#each ['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape', 'Mango'] as fruit (fruit)}
                  <Combobox.Item value={fruit}>{fruit}</Combobox.Item>
                {/each}
              </Combobox.Content>
            </Combobox.Root>
            <p class={css({ fontSize: 'sm', color: 'sig.muted' })}>
              Selected: {pickedFruit || 'none'}
            </p>
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec
          label="Context menu"
          hint="right-click the box, viewport-clamped menu"
          for="ContextMenu"
        >
          <ContextMenu.Root>
            <div
              class={css({
                rounded: 'sig',
                border: '1px dashed',
                borderColor: 'sig.border',
                p: '8',
                textAlign: 'center',
                fontSize: 'sm',
                color: 'sig.muted'
              })}
            >
              Right-click here
            </div>
            <ContextMenu.Content>
              <ContextMenu.Item value="copy" onSelect={() => toast.success('Copied')}>
                Copy
              </ContextMenu.Item>
              <ContextMenu.Item value="rename">Rename</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item value="delete" disabled>Delete</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </Spec></Reveal
      >

      <Reveal
        ><Spec label="Scroll area" hint="custom scrollbar, vertical or horizontal" for="ScrollArea">
          <ScrollArea
            class={css({ h: '40', rounded: 'sig', border: '1px solid', borderColor: 'sig.border' })}
          >
            <div class={stack({ p: '3', gap: '2' })}>
              {#each services as svc (svc.name)}
                <div
                  class={flex({
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'sm'
                  })}
                >
                  <span>{svc.name}</span>
                  <span class={css({ color: 'sig.muted' })}>{svc.uptime}</span>
                </div>
              {/each}
            </div>
          </ScrollArea>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec
          label="Structure"
          hint="Tree, Timeline, Stepper"
          for={['Tree', 'Timeline', 'Stepper']}
        >
          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              alignItems: 'start'
            })}
          >
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Tree</span>
              <Tree items={treeItems} expanded={['src']} aria-label="Project files" />
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Timeline</span>
              <Timeline.Root>
                <Timeline.Item title="Deployed v1.4" time="2h ago" tone="success" />
                <Timeline.Item
                  title="Canary raised errors"
                  time="4h ago"
                  tone="warning"
                  description="0.4% of requests"
                />
                <Timeline.Item title="Build queued" time="5h ago" />
              </Timeline.Root>
            </div>
            <div class={stack({ gap: '2' })}>
              <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>Stepper</span>
              <Stepper.Root bind:step={wizard}>
                <Stepper.Item title="Account" description="Name and email" />
                <Stepper.Item title="Plan" description="Pick a tier" />
                <Stepper.Item title="Done" />
              </Stepper.Root>
            </div>
          </div>
        </Spec></Reveal
      >

      <Reveal class={wide}
        ><Spec
          label="Media and motion"
          hint="AspectRatio, AvatarGroup, Presence, Marquee"
          for={['AspectRatio', 'AvatarGroup', 'Presence', 'Marquee']}
        >
          <div
            class={css({
              display: 'grid',
              gap: '6',
              gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
              alignItems: 'start'
            })}
          >
            <div class={stack({ gap: '3' })}>
              <AspectRatio ratio={16 / 9}>
                <div
                  class={css({
                    w: 'full',
                    h: 'full',
                    display: 'grid',
                    placeItems: 'center',
                    bg: 'sig.surface',
                    color: 'sig.muted',
                    fontSize: 'sm'
                  })}
                >
                  16:9 frame
                </div>
              </AspectRatio>
              <AvatarGroup
                items={[
                  { fallback: 'Ada Lovelace' },
                  { fallback: 'Grace Hopper' },
                  { fallback: 'Alan Turing' },
                  { fallback: 'Edsger Dijkstra' },
                  { fallback: 'Margaret Hamilton' }
                ]}
                max={4}
              />
            </div>
            <div class={stack({ gap: '4' })}>
              <div class={flex({ alignItems: 'center', gap: '3' })}>
                <Button variant="secondary" onclick={() => (cardShown = !cardShown)}>
                  Toggle presence
                </Button>
                <Presence show={cardShown}>
                  <Badge tone="accent">animates in and out</Badge>
                </Presence>
              </div>
              <Marquee
                class={css({
                  rounded: 'sig',
                  border: '1px solid',
                  borderColor: 'sig.border',
                  py: '2'
                })}
              >
                {#each ['svelte 5', 'vanilla', 'zero deps', 'any css', 'a11y built in'] as word (word)}
                  <span class={css({ px: '4', fontSize: 'sm', color: 'sig.muted' })}>{word}</span>
                {/each}
              </Marquee>
            </div>
          </div>
        </Spec></Reveal
      >

      <Reveal
        ><Spec label="Empty" hint="dashed empty state with actions" for="Empty">
          <Empty title="No deployments yet" description="Push to main to trigger the first build.">
            <Button variant="secondary">Read the docs</Button>
          </Empty>
        </Spec></Reveal
      >

      <Reveal
        ><Spec
          label="Dev tools"
          hint="Measure, GridOverlay, findOverflows"
          for={['Measure', 'GridOverlay']}
        >
          <div class={stack({ gap: '4' })}>
            <Measure>
              <div class={css({ rounded: 'sig', bg: 'sig.surface', p: '4', fontSize: 'sm' })}>
                Measure wraps content and reports live pixel size.
              </div>
            </Measure>
            <div class={flex({ alignItems: 'center', gap: '3' })}>
              <Switch bind:checked={debug} aria-label="toggle grid overlay" />
              <span class={css({ fontSize: 'sm', color: 'sig.muted' })}>
                Grid overlay + overflow outline
              </span>
            </div>
          </div>
        </Spec></Reveal
      >
    </div>
  </section>

  <section id="adapters" class={section}>
    <p class={kicker}>Five ways to theme</p>
    <h2 class={h2}>Adapters</h2>
    <p class={lead}>
      One token contract, five ways to consume it. sigil css is the bundled build-time atomic
      engine. The rest adapt existing frameworks. All produce the same themed components.
    </p>
    <div
      class={css({
        display: 'grid',
        mt: '8',
        gap: '4',
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }
      })}
    >
      {#each manifest.adapters as adapter (adapter.name)}
        <Code title={adapter.name} class={adapter.name === 'sigil css' ? wide : undefined}>
          {adapter.usage}
        </Code>
      {/each}
    </div>
  </section>

  <section id="agents" class={section}>
    <p class={kicker}>Manifest, CLI, llms.txt</p>
    <h2 class={h2}>Built for agents</h2>
    <p class={lead}>
      The library describes itself so tools and coding agents do not have to guess.
    </p>
    <div
      class={css({
        display: 'grid',
        mt: '8',
        gap: '4',
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }
      })}
    >
      <Code title="cli">{cliCode}</Code>
      <Code title="metadata">{metaCode}</Code>
    </div>
    <div class={flex({ mt: '4', alignItems: 'center', gap: '3' })}>
      <CopyButton
        text="pnpm add sigil-ui"
        class="sig-btn"
        data-variant="secondary"
        aria-label="Copy install command"
      >
        {#snippet children({ copied })}
          {#if copied}<Check size={15} />{:else}<Copy size={15} />{/if}
          {copied ? 'Copied' : 'Copy install command'}
        {/snippet}
      </CopyButton>
      <span class={css({ fontSize: 'sm', color: 'sig.muted' })}>
        CopyButton uses the Clipboard API with a textarea fallback.
      </span>
    </div>
    <p class={css({ mt: '4', fontSize: 'sm', color: 'sig.muted' })}>
      Agent skills ship in the repo and install with
      <code>npx skills add Quad4-Software/sigil-ui</code>. Layout debugging helpers (findOverflows,
      measure, tagOverflows) are exported from the package.
    </p>
  </section>

  <section id="vanilla" class={section}>
    <p class={kicker}>Plain HTML, plain JS</p>
    <h2 class={h2}>Without a framework</h2>
    <p class={lead}>
      The component styles are stable sig-* classes over --sig-* tokens, so plain HTML can consume
      them directly. For behavior, sigil-ui/headless ships framework-free controllers that wire the
      same markup: roles, aria attributes, keyboard navigation, focus traps and dismissal. It
      follows the Ark UI model where headless logic owns behavior and the DOM owns presentation.
    </p>
    <div
      class={css({
        display: 'grid',
        mt: '8',
        gap: '3',
        gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' }
      })}
    >
      <Code title="styles only">{vanillaCssCode}</Code>
      <Code title="headless behavior">{vanillaJsCode}</Code>
    </div>
    <p class={css({ mt: '4', fontSize: 'sm', color: 'sig.muted' })}>
      attachAll wires every sig-* structure it finds: tabs, accordions, radios, switches, overlays,
      popovers, menus, tooltips, panes and toasts. Individual attach and create functions cover
      one-off wiring.
    </p>
  </section>

  <section id="tokens" class={section}>
    <p class={kicker}>{manifest.tokens.length} CSS variables</p>
    <h2 class={h2}>Token contract</h2>
    <p class={lead}>Override any of these to retheme every component at once.</p>
    <div
      class={css({
        mt: '8',
        overflowX: 'auto',
        rounded: 'sig',
        border: '1px solid',
        borderColor: 'sig.border'
      })}
    >
      <table class={css({ w: 'full', textAlign: 'left', fontSize: 'sm' })}>
        <thead class={css({ bg: 'sig.surface', color: 'sig.muted' })}>
          <tr>
            <th class={css({ px: '3', py: '2', fontWeight: 'medium' })}>var</th>
            <th class={css({ px: '3', py: '2', fontWeight: 'medium' })}>swatch</th>
            <th class={css({ px: '3', py: '2', fontWeight: 'medium' })}>light</th>
            <th class={css({ px: '3', py: '2', fontWeight: 'medium' })}>dark</th>
            <th class={css({ px: '3', py: '2', fontWeight: 'medium' })}>used for</th>
          </tr>
        </thead>
        <tbody>
          {#each manifest.tokens as token (token.name)}
            <tr class={css({ borderTop: '1px solid', borderColor: 'sig.border' })}>
              <td class={css({ px: '3', py: '2', fontFamily: 'mono', fontSize: 'xs' })}
                >{token.name}</td
              >
              <td class={css({ px: '3', py: '2' })}>
                {#if token.name.startsWith('--sig-') && !token.name.includes('radius') && !token.name.includes('shadow')}
                  <span
                    class={css({
                      display: 'inline-block',
                      w: '4',
                      h: '4',
                      rounded: 'sm',
                      border: '1px solid',
                      borderColor: 'sig.border'
                    })}
                    style="background: var({token.name})"
                  ></span>
                {/if}
              </td>
              <td class={css({ px: '3', py: '2', fontFamily: 'mono', fontSize: 'xs' })}
                >{token.light}</td
              >
              <td class={css({ px: '3', py: '2', fontFamily: 'mono', fontSize: 'xs' })}
                >{token.dark}</td
              >
              <td class={css({ px: '3', py: '2', color: 'sig.muted' })}>{token.description}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <section id="api" class={section}>
    <p class={kicker}>Generated from the manifest</p>
    <h2 class={h2}>API reference</h2>
    <p class={lead}>
      Every component, prop and styling hook, generated from the same manifest agents consume.
    </p>
    <div class={css({ mt: '6', maxW: 'sm' })}>
      <Input
        bind:value={apiFilter}
        placeholder="Filter components"
        aria-label="Filter API reference"
      />
    </div>
    <div
      class={css({
        display: 'grid',
        mt: '4',
        gap: '3',
        alignItems: 'start',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(2, 1fr)' }
      })}
    >
      {#each manifest.components.filter((c) => {
        const q = apiFilter.trim().toLowerCase()
        return !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      }) as component (component.name)}
        <details
          class={css({
            rounded: 'sig',
            border: '1px solid',
            borderColor: 'color-mix(in oklab, var(--sig-fg) 9%, transparent)',
            p: '4',
            transition: 'border-color 150ms',
            _hover: { borderColor: 'sig.accent' },
            _open: { bg: 'sig.surface' }
          })}
        >
          <summary class={css({ cursor: 'pointer', fontWeight: 'medium' })}>
            {component.name}
            <span class={css({ fontWeight: 'normal', color: 'sig.muted', fontSize: 'sm' })}>
              {component.description}
            </span>
          </summary>
          <div class={css({ mt: '3' })}>
            <ManifestPanel for={component.name} />
          </div>
        </details>
      {/each}
    </div>
  </section>
</main>

<Command.Dialog bind:open={paletteOpen} label="Site commands">
  <Command.Input placeholder="Type a command" />
  <Command.List>
    <Command.Empty>No results.</Command.Empty>
    <Command.Item value="playground" onSelect={jump('#playground')}>Playground</Command.Item>
    <Command.Item value="components" onSelect={jump('#components')}>Components</Command.Item>
    <Command.Item value="adapters" onSelect={jump('#adapters')}>Adapters</Command.Item>
    <Command.Item value="vanilla" onSelect={jump('#vanilla')}>Vanilla usage</Command.Item>
    <Command.Item value="tokens" onSelect={jump('#tokens')}>Token contract</Command.Item>
    <Command.Item value="api" onSelect={jump('#api')}>API reference</Command.Item>
    <Command.Item value="theme" keywords={['dark', 'light']} onSelect={() => theme.toggle()}>
      Toggle theme
    </Command.Item>
  </Command.List>
</Command.Dialog>

<Toaster />
{#if debug}
  <GridOverlay size={8} overflow interval={1500} />
{/if}

<footer
  class={css({
    borderTop: '1px solid',
    borderColor: 'sig.border',
    py: '10',
    fontSize: 'sm',
    color: 'sig.muted'
  })}
>
  <div
    class={flex({
      mx: 'auto',
      maxW: '6xl',
      px: '4',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '4'
    })}
  >
    <span class={flex({ alignItems: 'center', gap: '2', color: 'sig.fg', fontWeight: 'medium' })}>
      <Logo size={18} />
      sigil-ui
    </span>
    <nav class={flex({ alignItems: 'center', gap: '5' })} aria-label="Footer">
      <a class={link} href="#components">components</a>
      <a class={link} href="#adapters">adapters</a>
      <a class={link} href="#tokens">tokens</a>
      <a
        class={flex({
          alignItems: 'center',
          gap: '1.5',
          color: 'sig.muted',
          _hover: { color: 'sig.fg' }
        })}
        href="https://github.com/Quad4-Software/sigil-ui"
        rel="noopener"
      >
        <GithubIcon size={15} /> github
      </a>
    </nav>
    <span>0BSD. Quad4 Software.</span>
  </div>
</footer>
