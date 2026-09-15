<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    children?: Snippet
  } = $props()
</script>

<div class={cn('sig-card-header', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-card-header) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1.25rem 1.25rem 0;
  }
</style>
