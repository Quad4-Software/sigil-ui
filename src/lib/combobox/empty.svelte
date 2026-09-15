<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCombobox } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const combo = getCombobox()
</script>

{#if combo.open && combo.visibleItems().length === 0}
  <div class={cn('sig-combobox-empty', className)} {...rest}>
    {#if children}{@render children()}{:else}No results found.{/if}
  </div>
{/if}

<style>
  :global(.sig-combobox-empty) {
    padding: 0.75rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--sig-muted, #71717a);
  }
</style>
