<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLAttributes<HTMLElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<caption class={cn('sig-table-caption', className)} {...rest}>
  {@render children?.()}
</caption>

<style>
  :global(.sig-table-caption) {
    padding: 0.75rem;
    color: var(--sig-muted, #71717a);
    font-size: 0.8125rem;
    caption-side: bottom;
  }
</style>
