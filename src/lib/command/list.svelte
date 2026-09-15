<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCommand } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const cmd = getCommand()
</script>

<div id={cmd.listId} role="listbox" class={cn('sig-command-list', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-command-list) {
    max-height: 18rem;
    overflow-y: auto;
    padding: 0.25rem;
    scrollbar-width: thin;
    scrollbar-color: var(--sig-border, #d4d4d8) transparent;
  }
</style>
