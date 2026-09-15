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

<div class={cn('sig-card-content', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-card-content) {
    padding: 1.25rem;
  }
</style>
