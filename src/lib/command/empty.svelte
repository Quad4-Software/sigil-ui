<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCommand } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const cmd = getCommand()
</script>

{#if cmd.visibleItems().length === 0}
  <div class={cn('sig-command-empty', className)} {...rest}>
    {#if children}{@render children()}{:else}No results found.{/if}
  </div>
{/if}

<style>
  :global(.sig-command-empty) {
    padding: 1.5rem 0.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--sig-muted, #71717a);
  }
</style>
