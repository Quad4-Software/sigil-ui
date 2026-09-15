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
  } from '$lib/index.js'
  import '../lib/theme/sigil.css'

  const theme = createTheme()
  let switched = $state(false)
  let dialogOpen = $state(false)
  let checked = $state(true)
  let name = $state('')
  let plan = $state('pro')
  let tab = $state('usage')
</script>

<main class="page">
  <header class="row">
    <h1>sigil-ui</h1>
    <Button variant="secondary" onclick={() => theme.toggle()}>
      {theme.resolved === 'light' ? 'Dark' : 'Light'} theme
    </Button>
  </header>

  <section>
    <h2>Dashboard</h2>
    <div class="grid">
      <Card.Root>
        <Card.Content
          ><Stat label="Revenue" value="$48.2k" delta={12.5} deltaLabel="%" /></Card.Content
        >
      </Card.Root>
      <Card.Root>
        <Card.Content
          ><Stat label="Active users" value="8,431" delta={-2.1} deltaLabel="%" /></Card.Content
        >
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Storage</Card.Title>
          <Card.Description>68% of quota used</Card.Description>
        </Card.Header>
        <Card.Content><Progress value={68} label="Storage" /></Card.Content>
      </Card.Root>
    </div>
  </section>

  <section>
    <h2>Panes</h2>
    <PaneGroup
      direction="horizontal"
      style="height: 16rem; border: 1px solid var(--sig-border); border-radius: var(--sig-radius)"
    >
      <Pane defaultSize={30} minSize={20}>
        <div class="fill">Sidebar</div>
      </Pane>
      <PaneResizer />
      <Pane>
        <PaneGroup direction="vertical">
          <Pane minSize={30}><div class="fill">Editor</div></Pane>
          <PaneResizer />
          <Pane defaultSize={30}><div class="fill">Console</div></Pane>
        </PaneGroup>
      </Pane>
    </PaneGroup>
  </section>

  <section>
    <h2>Inputs</h2>
    <div class="grid">
      <Input bind:value={name} placeholder="Your name" aria-label="name" />
      <Select bind:value={plan} aria-label="plan">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="team">Team</option>
      </Select>
      <label class="row"><Checkbox bind:checked /> Notify me</label>
      <div class="row">
        <Switch bind:checked={switched} aria-label="toggle" />
        <span>{switched ? 'on' : 'off'}</span>
      </div>
    </div>
  </section>

  <section>
    <h2>Display</h2>
    <div class="row">
      <Badge>Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="danger">Danger</Badge>
      <Avatar fallback="Ada Lovelace" alt="Ada Lovelace" />
      <Tooltip text="Hover or focus me">
        {#snippet children({ props })}
          <Button variant="ghost" {...props}>Tooltip</Button>
        {/snippet}
      </Tooltip>
    </div>
    <Separator style="margin: 1rem 0" />
    <Alert tone="warning" title="Heads up">This is a warning alert.</Alert>
    <Skeleton style="margin-top: 1rem" />
  </section>

  <section>
    <h2>Tabs and accordion</h2>
    <Tabs.Root bind:value={tab}>
      <Tabs.List>
        <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="usage">Usage metrics go here.</Tabs.Content>
      <Tabs.Content value="billing">Billing settings go here.</Tabs.Content>
    </Tabs.Root>

    <Accordion.Root>
      <Accordion.Item value="a">
        <Accordion.Trigger>What is sigil-ui?</Accordion.Trigger>
        <Accordion.Content>A runes-native component library.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>Does it need Tailwind?</Accordion.Trigger>
        <Accordion.Content>No. It works with any CSS setup.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  </section>

  <section>
    <h2>Overlays</h2>
    <div class="row">
      <Dialog.Root bind:open={dialogOpen}>
        <Dialog.Trigger class="sig-btn" data-variant="primary">Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Title>Confirm</Dialog.Title>
            <Dialog.Description>Focus is trapped. Escape or close to dismiss.</Dialog.Description>
            <Dialog.Close class="sig-btn" data-variant="secondary">Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Button variant="secondary" onclick={() => toast.success('Saved to disk')}>Toast</Button>
      <Button
        variant="secondary"
        onclick={() => toast.danger('Deploy failed', { description: 'Rollback started' })}
        >Error toast</Button
      >
    </div>
  </section>
</main>

<Toaster />

<style>
  .page {
    max-width: 48rem;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: system-ui, sans-serif;
    background: var(--sig-bg);
    color: var(--sig-fg);
    min-height: 100vh;
  }

  section {
    margin-top: 2rem;
  }

  h1 {
    margin: 0;
  }

  h2 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--sig-muted);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  }

  .fill {
    height: 100%;
    display: grid;
    place-content: center;
    color: var(--sig-muted);
    font-size: 0.875rem;
  }

  header.row {
    justify-content: space-between;
  }
</style>
