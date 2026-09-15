<script lang="ts">
  import { Command } from '../../lib/index.js'
  let { onSelect = () => undefined }: { onSelect?: (value: string) => void } = $props()
</script>

<Command.Root onValueChange={onSelect}>
  <Command.Input placeholder="Search actions" />
  <Command.List>
    <Command.Group heading="File">
      <Command.Item value="new" onSelect={() => onSelect('new')}>New File</Command.Item>
      <Command.Item value="open" onSelect={() => onSelect('open')}>Open File</Command.Item>
    </Command.Group>
    <Command.Group heading="View">
      <Command.Item
        value="zen"
        keywords={['focus', 'distraction-free']}
        onSelect={() => onSelect('zen')}
      >
        Zen Mode
      </Command.Item>
      <Command.Item value="disabled" disabled>Disabled Action</Command.Item>
    </Command.Group>
    <Command.Empty>Nothing here</Command.Empty>
  </Command.List>
</Command.Root>
