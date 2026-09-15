<script lang="ts">
  import { Sheet } from '../../lib/index.js'

  let {
    open = $bindable(false),
    side = 'right'
  }: { open?: boolean; side?: 'left' | 'right' | 'top' | 'bottom' } = $props()
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger>Open sheet</Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content {side}>
      <Sheet.Title>Sheet title</Sheet.Title>
      <Sheet.Description>Sheet description</Sheet.Description>
      <Sheet.Close>Close sheet</Sheet.Close>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet.Root>
