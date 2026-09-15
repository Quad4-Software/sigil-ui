<script lang="ts">
  import type { Snippet } from 'svelte'
  import { Root as DialogRoot } from '../dialog/index.js'

  export interface Props {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }

  let { open = $bindable(false), onOpenChange, children }: Props = $props()
</script>

<DialogRoot bind:open {onOpenChange}>
  {@render children?.()}
</DialogRoot>
