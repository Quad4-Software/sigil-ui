<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLHeadingElement> & {
    children?: Snippet
  } = $props()
</script>

<h3 class={cn('sig-card-title', className)} {...rest}>
  {@render children?.()}
</h3>

<style>
  :global(.sig-card-title) {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.4;
  }
</style>
