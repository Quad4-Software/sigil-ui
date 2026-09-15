<script lang="ts">
  import { ContextMenu } from '../../lib/index.js'
  let { onSelect = () => undefined }: { onSelect?: () => void } = $props()
</script>

<ContextMenu.Root>
  <div class="target">Right click me</div>
  <ContextMenu.Content>
    <ContextMenu.Item {onSelect}>Copy</ContextMenu.Item>
    <ContextMenu.Item disabled>Paste</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item>Delete</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
