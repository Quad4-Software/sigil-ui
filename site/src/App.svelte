<script lang="ts">
  import {
    Accordion,
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    Checkbox,
    createTheme,
    Dialog,
    Input,
    manifest,
    Pane,
    PaneGroup,
    PaneResizer,
    Progress,
    Select,
    Separator,
    Skeleton,
    Stat,
    Switch,
    Tabs,
    toast,
    Toaster,
    Tooltip
  } from 'sigil-ui'
  import Code from './Code.svelte'

  const theme = createTheme()
  let switched = $state(false)
  let dialogOpen = $state(false)
  let agreed = $state(true)
  let plan = $state('pro')
  let tab = $state('usage')
</script>

<header class="sticky top-0 z-10 border-b border-sig-border bg-sig-bg/80 backdrop-blur">
  <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
    <span class="flex items-center gap-2 font-semibold">
      <span class="inline-block size-4 rotate-45 rounded-[3px] bg-sig-accent"></span>
      sigil-ui
    </span>
    <nav class="flex items-center gap-4 text-sm text-sig-muted">
      <a class="hover:text-sig-fg" href="#components">components</a>
      <a class="hover:text-sig-fg" href="#adapters">adapters</a>
      <a class="hover:text-sig-fg" href="#agents">agents</a>
      <a class="hover:text-sig-fg" href="#tokens">tokens</a>
      <a class="hover:text-sig-fg" href="https://github.com/Quad4-Software/sigil-ui" rel="noopener"
        >github</a
      >
      <button
        class="cursor-pointer rounded-sig border border-sig-border px-2.5 py-1 text-xs hover:bg-sig-surface"
        onclick={() => theme.toggle()}
      >
        {theme.resolved === 'dark' ? 'light' : 'dark'}
      </button>
    </nav>
  </div>
</header>

<main class="mx-auto max-w-4xl px-4 pb-24">
  <section class="py-16">
    <Badge tone="accent">svelte 5, runes only</Badge>
    <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
      Components that do not care about your CSS framework
    </h1>
    <p class="mt-4 max-w-2xl text-lg text-sig-muted">
      sigil-ui ships runes-native components styled through a
      <code>--sig-*</code> token contract. Tailwind v4, UnoCSS, Panda CSS or plain CSS all theme the same
      components. Zero runtime dependencies beyond runed and clsx. Focus traps, keyboard navigation and
      aria wiring are built in.
    </p>
    <div class="mt-8 grid gap-3 sm:grid-cols-2">
      <Code title="install">pnpm add sigil-ui</Code>
      <Code title="use">
        {`import 'sigil-ui/theme.css'\nimport { Button } from 'sigil-ui'\n\n<Button variant="secondary" onclick={save}>Save</Button>`}
      </Code>
    </div>
  </section>

  <section id="components" class="scroll-mt-20 border-t border-sig-border py-12">
    <h2 class="text-2xl font-semibold">Components</h2>
    <p class="mt-2 text-sig-muted">
      Live. Every class and data attribute below is a public styling hook.
    </p>

    <div class="mt-8 grid gap-10">
      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Dashboard</h3>
        <div class="grid gap-4 sm:grid-cols-3">
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
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">
          Panes, drag the separator or focus it and use arrow keys
        </h3>
        <PaneGroup
          direction="horizontal"
          class="h-48 overflow-hidden rounded-sig border border-sig-border"
        >
          <Pane defaultSize={30} minSize={15}>
            <div class="grid h-full place-content-center text-sm text-sig-muted">Sidebar</div>
          </Pane>
          <PaneResizer />
          <Pane>
            <PaneGroup direction="vertical">
              <Pane minSize={30}>
                <div class="grid h-full place-content-center text-sm text-sig-muted">Editor</div>
              </Pane>
              <PaneResizer />
              <Pane defaultSize={30} minSize={15}>
                <div class="grid h-full place-content-center text-sm text-sig-muted">Console</div>
              </Pane>
            </PaneGroup>
          </Pane>
        </PaneGroup>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Forms</h3>
        <div class="grid max-w-sm gap-3">
          <Input placeholder="Project name" aria-label="Project name" />
          <Select bind:value={plan} aria-label="Plan">
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="team">Team</option>
          </Select>
          <label class="flex items-center gap-2 text-sm">
            <Checkbox bind:checked={agreed} /> Email me a weekly digest
          </label>
          <div class="flex items-center gap-3">
            <Switch bind:checked={switched} aria-label="demo switch" />
            <span class="text-sm text-sig-muted">{switched ? 'on' : 'off'}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Button</h3>
        <div class="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button class="rounded-full">class="rounded-full"</Button>
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Feedback</h3>
        <div class="grid gap-3">
          <div class="flex flex-wrap items-center gap-3">
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
          <Skeleton class="h-8 max-w-md" />
        </div>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Tabs</h3>
        <Tabs.Root bind:value={tab}>
          <Tabs.List>
            <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
            <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="usage">
            <p class="text-sm text-sig-muted">Arrow keys move between tabs. Home and End jump.</p>
          </Tabs.Content>
          <Tabs.Content value="billing">
            <p class="text-sm text-sig-muted">Billing panel content.</p>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Accordion</h3>
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
      </div>

      <div>
        <h3 class="mb-3 text-sm font-medium text-sig-muted">Dialog</h3>
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
      </div>

      <Separator />
    </div>
  </section>

  <section id="adapters" class="scroll-mt-20 border-t border-sig-border py-12">
    <h2 class="text-2xl font-semibold">Adapters</h2>
    <p class="mt-2 text-sig-muted">
      One token contract, four ways to consume it. All of these produce the same themed components.
    </p>
    <div class="mt-8 grid gap-4 md:grid-cols-2">
      {#each manifest.adapters as adapter (adapter.name)}
        <Code title={adapter.name}>{adapter.usage}</Code>
      {/each}
    </div>
  </section>

  <section id="agents" class="scroll-mt-20 border-t border-sig-border py-12">
    <h2 class="text-2xl font-semibold">Built for agents</h2>
    <p class="mt-2 text-sig-muted">
      The library describes itself so tools and coding agents do not have to guess.
    </p>
    <div class="mt-8 grid gap-4 md:grid-cols-2">
      <Code title="cli"
        >npx sigil-ui list npx sigil-ui docs Button npx sigil-ui tokens npx sigil-ui doctor</Code
      >
      <Code title="metadata"
        >import {'{ manifest }'} from 'sigil-ui' // or fetch sigil-ui/manifest.json // llms.txt and llms-full.txt
        are served at this site's root</Code
      >
    </div>
    <p class="mt-4 text-sm text-sig-muted">
      Agent skills ship in the repo and install with
      <code>npx skills add Quad4-Software/sigil-ui</code>.
    </p>
  </section>

  <section id="tokens" class="scroll-mt-20 border-t border-sig-border py-12">
    <h2 class="text-2xl font-semibold">Token contract</h2>
    <p class="mt-2 text-sig-muted">Override any of these to retheme every component at once.</p>
    <div class="mt-8 overflow-x-auto rounded-sig border border-sig-border">
      <table class="w-full text-left text-sm">
        <thead class="bg-sig-surface text-sig-muted">
          <tr>
            <th class="px-3 py-2 font-medium">var</th>
            <th class="px-3 py-2 font-medium">light</th>
            <th class="px-3 py-2 font-medium">dark</th>
            <th class="px-3 py-2 font-medium">used for</th>
          </tr>
        </thead>
        <tbody>
          {#each manifest.tokens as token (token.name)}
            <tr class="border-t border-sig-border">
              <td class="px-3 py-2 font-mono text-xs">{token.name}</td>
              <td class="px-3 py-2 font-mono text-xs">{token.light}</td>
              <td class="px-3 py-2 font-mono text-xs">{token.dark}</td>
              <td class="px-3 py-2 text-sig-muted">{token.description}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</main>

<Toaster />

<footer class="border-t border-sig-border py-8 text-center text-sm text-sig-muted">
  sigil-ui · 0BSD ·
  <a class="hover:text-sig-fg" href="https://github.com/Quad4-Software/sigil-ui" rel="noopener"
    >Quad4-Software/sigil-ui</a
  >
</footer>
