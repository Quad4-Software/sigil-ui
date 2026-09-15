<script lang="ts">
  import {
    Accordion,
    Alert,
    Avatar,
    Badge,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    createTheme,
    Dialog,
    DropdownMenu,
    Empty,
    GridOverlay,
    Input,
    Kbd,
    manifest,
    Measure,
    Pane,
    PaneGroup,
    PaneResizer,
    Popover,
    Progress,
    RadioGroup,
    Select,
    Skeleton,
    Slider,
    Stat,
    Switch,
    Tabs,
    Textarea,
    toast,
    Toaster,
    Toggle,
    Tooltip
  } from 'sigil-ui'
  import { css } from '../styled-system/css'
  import { flex, stack } from '../styled-system/patterns'
  import Code from './Code.svelte'
  import Spec from './Spec.svelte'

  const theme = createTheme()
  let switched = $state(false)
  let dialogOpen = $state(false)
  let agreed = $state(true)
  let plan = $state('pro')
  let radioPlan = $state('free')
  let tab = $state('usage')
  let volume = $state(40)
  let bold = $state(false)
  let debug = $state(false)

  const stats = [
    `${manifest.components.length} components`,
    '2 runtime deps',
    '0 primitive libs',
    '4 styling adapters'
  ]

  const section = css({
    scrollMarginTop: '20',
    borderTop: '1px solid',
    borderColor: 'sig.border',
    py: '14'
  })
  const h2 = css({ fontSize: '2xl', fontWeight: 'semibold', letterSpacing: 'tight' })
  const lead = css({ mt: '2', color: 'sig.muted' })
  const link = css({ color: 'sig.muted', _hover: { color: 'sig.fg' } })
</script>

<header
  class={css({
    position: 'sticky',
    top: '0',
    zIndex: '10',
    borderBottom: '1px solid',
    borderColor: 'sig.border',
    bg: 'sig.bg'
  })}
>
  <div
    class={flex({
      mx: 'auto',
      maxW: '6xl',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: '4',
      py: '3'
    })}
  >
    <span class={flex({ alignItems: 'center', gap: '2', fontWeight: 'semibold' })}>
      <span
        class={css({
          display: 'inline-block',
          w: '4',
          h: '4',
          transform: 'rotate(45deg)',
          rounded: 'sm',
          bg: 'sig.accent'
        })}
      ></span>
      sigil-ui
    </span>
    <nav class={flex({ alignItems: 'center', gap: '4', fontSize: 'sm' })}>
      <a class={link} href="#components">components</a>
      <a class={link} href="#adapters">adapters</a>
      <a class={link} href="#agents">agents</a>
      <a class={link} href="#tokens">tokens</a>
      <a class={link} href="https://github.com/Quad4-Software/sigil-ui" rel="noopener">github</a>
      <button
        class={css({
          cursor: 'pointer',
          rounded: 'sig',
          border: '1px solid',
          borderColor: 'sig.border',
          px: '2.5',
          py: '1',
          fontSize: 'xs',
          _hover: { bg: 'sig.surface' }
        })}
        onclick={() => theme.toggle()}
      >
        {theme.resolved === 'dark' ? 'light' : 'dark'}
      </button>
    </nav>
  </div>
</header>

<main class={css({ mx: 'auto', maxW: '6xl', px: '4', pb: '24' })}>
  <section
    class={css({
      position: 'relative',
      py: '24',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0',
        background: 'radial-gradient(32rem 16rem at 20% 0%, var(--sig-accent) 0%, transparent 70%)',
        opacity: '0.08',
        pointerEvents: 'none'
      }
    })}
  >
    <Badge tone="accent">svelte 5, runes only</Badge>
    <h1
      class={css({
        mt: '4',
        fontSize: { base: '4xl', sm: '5xl', lg: '6xl' },
        maxW: '3xl',
        fontWeight: 'bold',
        letterSpacing: 'tight',
        lineHeight: 'tight'
      })}
    >
      Components that do not care about your CSS framework
    </h1>
    <p class={css({ mt: '4', maxW: '2xl', fontSize: 'lg', color: 'sig.muted', lineHeight: 'relaxed' })}>
      sigil-ui ships runes-native components styled through a
      <code>--sig-*</code> token contract. Tailwind v4, UnoCSS, Panda CSS or plain CSS all theme the same
      components. Zero runtime dependencies beyond runed and clsx. Focus traps, keyboard navigation and
      aria wiring are built in.
    </p>
    <div class={flex({ mt: '6', flexWrap: 'wrap', gap: '2' })}>
      {#each stats as stat (stat)}
        <span
          class={css({
            rounded: 'full',
            border: '1px solid',
            borderColor: 'sig.border',
            bg: 'sig.surface',
            px: '3',
            py: '1',
            fontSize: 'xs',
            color: 'sig.muted'
          })}>{stat}</span
        >
      {/each}
    </div>
    <div
      class={css({
        display: 'grid',
        mt: '8',
        gap: '3',
        gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)' }
      })}
    >
      <Code title="install">pnpm add sigil-ui</Code>
      <Code title="use">
        {`import 'sigil-ui/theme.css'\nimport { Button } from 'sigil-ui'\n\n<Button variant="secondary" onclick={save}>Save</Button>`}
      </Code>
    </div>
  </section>

  <section id="components" class={section}>
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
      <Spec label="Dashboard" hint="Card, Stat, Progress" class={css({ gridColumn: '1 / -1' })}>
        <div
          class={css({
            display: 'grid',
            gap: '4',
            gridTemplateColumns: { base: '1fr', sm: 'repeat(3, 1fr)' }
          })}
        >
          <Card.Root>
            <Card.Content>
              <Stat label="Revenue" value="$48.2k" delta={12.5} deltaLabel="%" />
            </Card.Content>
          </Card.Root>
          <Card.Root>
            <Card.Content>
              <Stat label="Churn" value="1.9%" delta={-0.4} deltaLabel="pts" />
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
      </Spec>

      <Spec
        label="Panes"
        hint="drag the separator or focus it and use arrow keys"
        class={css({ gridColumn: '1 / -1' })}
      >
        <PaneGroup
          direction="horizontal"
          class={css({
            h: '48',
            overflow: 'hidden',
            rounded: 'sig',
            border: '1px solid',
            borderColor: 'sig.border'
          })}
        >
          <Pane defaultSize={30} minSize={15}>
            <div
              class={css({
                display: 'grid',
                h: 'full',
                placeContent: 'center',
                fontSize: 'sm',
                color: 'sig.muted'
              })}
            >
              Sidebar
            </div>
          </Pane>
          <PaneResizer />
          <Pane>
            <PaneGroup direction="vertical">
              <Pane minSize={30}>
                <div
                  class={css({
                    display: 'grid',
                    h: 'full',
                    placeContent: 'center',
                    fontSize: 'sm',
                    color: 'sig.muted'
                  })}
                >
                  Editor
                </div>
              </Pane>
              <PaneResizer />
              <Pane defaultSize={30} minSize={15}>
                <div
                  class={css({
                    display: 'grid',
                    h: 'full',
                    placeContent: 'center',
                    fontSize: 'sm',
                    color: 'sig.muted'
                  })}
                >
                  Console
                </div>
              </Pane>
            </PaneGroup>
          </Pane>
        </PaneGroup>
      </Spec>

      <Spec
        label="Forms"
        hint="Input, Textarea, Select, Checkbox, RadioGroup, Slider, Switch, Toggle"
        class={css({ gridColumn: '1 / -1' })}
      >
        <div
          class={css({
            display: 'grid',
            gap: '6',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }
          })}
        >
          <div class={stack({ gap: '3' })}>
            <Input placeholder="Project name" aria-label="Project name" />
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
          </div>
        </div>
      </Spec>

      <Spec label="Buttons" hint="variants driven by data-variant">
        <div class={flex({ flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button class={css({ rounded: 'full' })}>rounded via class</Button>
        </div>
      </Spec>

      <Spec label="Feedback" hint="Badge, Avatar, Tooltip, Alert, Skeleton, Toaster">
        <div class={stack({ gap: '3' })}>
          <div class={flex({ flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>
            <Badge>neutral</Badge>
            <Badge tone="accent">accent</Badge>
            <Badge tone="danger">danger</Badge>
            <Avatar fallback="Ada Lovelace" alt="Ada Lovelace" />
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
      </Spec>

      <Spec label="Overlays" hint="Dialog traps focus, Popover and Menu dismiss on outside click">
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
              <DropdownMenu.Item onSelect={() => toast.info('Profile')}>Profile</DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => toast.info('Settings')}>Settings</DropdownMenu.Item
              >
              <DropdownMenu.Separator />
              <DropdownMenu.Item onSelect={() => toast.danger('Signed out')}>
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </Spec>

      <Spec
        label="Navigation"
        hint="Tabs, Accordion, Breadcrumb, Kbd"
        class={css({ gridColumn: '1 / -1' })}
      >
        <div class={stack({ gap: '5' })}>
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
                No. Components ship with their own structural styles and --sig-* fallbacks. Adapters
                are optional.
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
      </Spec>

      <Spec label="Empty" hint="dashed empty state with actions">
        <Empty title="No deployments yet" description="Push to main to trigger the first build.">
          <Button variant="secondary">Read the docs</Button>
        </Empty>
      </Spec>

      <Spec label="Dev tools" hint="Measure, GridOverlay, findOverflows">
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
      </Spec>
    </div>
  </section>

  <section id="adapters" class={section}>
    <h2 class={h2}>Adapters</h2>
    <p class={lead}>
      One token contract, four ways to consume it. All of these produce the same themed components.
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
        <Code title={adapter.name}>{adapter.usage}</Code>
      {/each}
    </div>
  </section>

  <section id="agents" class={section}>
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
      <Code title="cli"
        >npx sigil-ui list npx sigil-ui docs Button npx sigil-ui tokens npx sigil-ui doctor</Code
      >
      <Code title="metadata"
        >import {'{ manifest }'} from 'sigil-ui' // or fetch sigil-ui/manifest.json // llms.txt and llms-full.txt
        are served at this site's root</Code
      >
    </div>
    <p class={css({ mt: '4', fontSize: 'sm', color: 'sig.muted' })}>
      Agent skills ship in the repo and install with
      <code>npx skills add Quad4-Software/sigil-ui</code>. Layout debugging helpers (findOverflows,
      measure, tagOverflows) are exported from the package.
    </p>
  </section>

  <section id="tokens" class={section}>
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
</main>

<Toaster />
{#if debug}
  <GridOverlay size={8} overflow interval={1500} />
{/if}

<footer
  class={css({
    borderTop: '1px solid',
    borderColor: 'sig.border',
    py: '8',
    textAlign: 'center',
    fontSize: 'sm',
    color: 'sig.muted'
  })}
>
  sigil-ui · 0BSD ·
  <a class={link} href="https://github.com/Quad4-Software/sigil-ui" rel="noopener"
    >Quad4-Software/sigil-ui</a
  >
</footer>
