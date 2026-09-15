<script lang="ts">
  import type { Snippet } from 'svelte'
  import * as Dialog from '../dialog/index.js'
  import CommandRoot from './root.svelte'

  export interface Props {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    shortcut?: string
    label?: string
    children?: Snippet
  }

  let {
    open = $bindable(false),
    onOpenChange,
    shortcut = 'k',
    label = 'Command palette',
    children
  }: Props = $props()

  function setOpen(next: boolean) {
    open = next
    onOpenChange?.(next)
  }

  $effect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === shortcut && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content
      class="sig-command-dialog"
      aria-labelledby={undefined}
      aria-describedby={undefined}
      aria-label={label}
    >
      <CommandRoot>{@render children?.()}</CommandRoot>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.sig-command-dialog) {
    top: 18%;
    transform: translate(-50%, 0);
    width: min(36rem, calc(100vw - 2rem));
    padding: 0;
  }

  :global(.sig-command-dialog .sig-command) {
    border: none;
    border-radius: inherit;
  }
</style>
