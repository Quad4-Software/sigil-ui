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

<div class={cn('sig-card-footer', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-card-footer) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.25rem 1.25rem;
  }
</style>
