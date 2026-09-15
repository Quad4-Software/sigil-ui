<script lang="ts">
  import { DropdownMenu } from '../../lib/index.js'
  let { onSelect = () => undefined }: { onSelect?: () => void } = $props()
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item {onSelect}>Save</DropdownMenu.Item>
    <DropdownMenu.Item disabled>Disabled</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
