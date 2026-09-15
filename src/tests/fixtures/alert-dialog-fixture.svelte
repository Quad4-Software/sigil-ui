<script lang="ts">
  import { AlertDialog } from '../../lib/index.js'
  let { open = false, onConfirm }: { open?: boolean; onConfirm?: () => void } = $props()
</script>

<AlertDialog.Root bind:open>
  <AlertDialog.Trigger>Delete</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Title>Delete project?</AlertDialog.Title>
    <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
    <AlertDialog.Cancel />
    <AlertDialog.Action tone="danger" onclick={() => onConfirm?.()}>Confirm</AlertDialog.Action>
  </AlertDialog.Content>
</AlertDialog.Root>
