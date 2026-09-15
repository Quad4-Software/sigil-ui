<script lang="ts">
  import { Menubar } from '../../lib/index.js'
  let { onPick }: { onPick?: (value: string) => void } = $props()
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item onSelect={() => onPick?.('save')}>Save</Menubar.Item>
      <Menubar.Item onSelect={() => onPick?.('quit')}>Quit</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  <Menubar.Menu>
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item onSelect={() => onPick?.('copy')}>Copy</Menubar.Item>
      <Menubar.Item disabled onSelect={() => onPick?.('paste')}>Paste</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
