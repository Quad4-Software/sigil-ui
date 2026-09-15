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
    Field,
    GridOverlay,
    Input,
    Kbd,
    Measure,
    Pane,
    PaneGroup,
    PaneResizer,
    Popover,
    Progress,
    RadioGroup,
    Select,
    Separator,
    Sheet,
    Skeleton,
    Slider,
    Spinner,
    Stat,
    Switch,
    Table,
    Tabs,
    Textarea,
    toast,
    Toaster,
    Toggle,
    Tooltip
  } from '$lib/index.js'
  import '../lib/theme/sigil.css'

  const theme = createTheme()
  let switched = $state(false)
  let dialogOpen = $state(false)
  let sheetOpen = $state(false)
  let checked = $state(true)
  let name = $state('')
  let plan = $state('pro')
  let radioPlan = $state('free')
  let tab = $state('usage')
  let volume = $state(40)
  let pressed = $state(false)
  let debug = $state(false)
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
      <Field label="Name" hint="Wires label, hint and error to the control.">
        {#snippet children(props)}
          <Input {...props} bind:value={name} placeholder="Your name" />
        {/snippet}
      </Field>
      <Textarea placeholder="Notes" aria-label="notes" />
      <Select bind:value={plan} aria-label="plan">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="team">Team</option>
      </Select>
      <RadioGroup.Root bind:value={radioPlan}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup.Root>
      <Slider bind:value={volume} label="Volume" />
      <label class="row"><Checkbox bind:checked /> Notify me</label>
      <div class="row">
        <Switch bind:checked={switched} aria-label="toggle" />
        <Toggle bind:pressed aria-label="bold">B</Toggle>
        <span>{switched ? 'on' : 'off'}, {pressed ? 'bold' : 'plain'}</span>
      </div>
    </div>
  </section>

  <section>
    <h2>Navigation</h2>
    <Breadcrumb.Root>
      <Breadcrumb.Item><a href="/">Home</a></Breadcrumb.Item>
      <Breadcrumb.Item current>Demo</Breadcrumb.Item>
    </Breadcrumb.Root>
    <p style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--sig-muted)">
      Shortcuts like <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> render as key caps.
    </p>
  </section>

  <section>
    <h2>Empty and dev tools</h2>
    <Empty title="No results" description="Try widening the filter.">
      <Button variant="secondary">Reset</Button>
    </Empty>
    <div class="row" style="margin-top: 1rem">
      <Measure>
        <div class="fill" style="padding: 1rem">Measured box</div>
      </Measure>
      <Switch bind:checked={debug} aria-label="grid overlay" />
      <span>grid overlay</span>
    </div>
  </section>

  <section>
    <h2>Display</h2>
    <div class="row">
      <Badge>Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="danger">Danger</Badge>
      <Avatar fallback="Ada Lovelace" alt="Ada Lovelace" />
      <Spinner />
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
    <h2>Table</h2>
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.H scope="col">Service</Table.H>
          <Table.H scope="col">Status</Table.H>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>api</Table.Cell>
          <Table.Cell><Badge tone="success">up</Badge></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>web</Table.Cell>
          <Table.Cell><Badge tone="warning">degraded</Badge></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
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
      <Popover.Root>
        <Popover.Trigger class="sig-btn" data-variant="secondary">Popover</Popover.Trigger>
        <Popover.Content>Anchored panel content.</Popover.Content>
      </Popover.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="sig-btn" data-variant="secondary">Menu</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={() => toast.info('Profile')}>Profile</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={() => toast.danger('Deleted')}>Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Sheet.Root bind:open={sheetOpen}>
        <Sheet.Trigger class="sig-btn" data-variant="secondary">Sheet</Sheet.Trigger>
        <Sheet.Portal>
          <Sheet.Overlay />
          <Sheet.Content side="right">
            <Sheet.Title>Details</Sheet.Title>
            <Sheet.Description>Edge-anchored panel.</Sheet.Description>
            <Sheet.Close class="sig-btn" data-variant="primary">Close</Sheet.Close>
          </Sheet.Content>
        </Sheet.Portal>
      </Sheet.Root>
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
{#if debug}
  <GridOverlay size={8} overflow interval={1000} />
{/if}

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
    flex: 1;
    display: grid;
    place-content: center;
    color: var(--sig-muted);
    font-size: 0.875rem;
  }

  header.row {
    justify-content: space-between;
  }
</style>
