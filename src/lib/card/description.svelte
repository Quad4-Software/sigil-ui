<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLParagraphElement> & {
    children?: Snippet
  } = $props()
</script>

<p class={cn('sig-card-description', className)} {...rest}>
  {@render children?.()}
</p>

<style>
  :global(.sig-card-description) {
    margin: 0;
    color: var(--sig-muted, #71717a);
    font-size: 0.875rem;
    line-height: 1.5;
  }
</style>
