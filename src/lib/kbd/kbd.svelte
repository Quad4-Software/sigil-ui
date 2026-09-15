<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  let {
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLElement> & { children?: Snippet } = $props()
</script>

<kbd class={cn('sig-kbd', className)} {...rest}>{@render children?.()}</kbd>

<style>
  :global(.sig-kbd) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.375rem;
    padding: 0.125rem 0.375rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-bottom-width: 2px;
    border-radius: 0.25rem;
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-fg, #18181b);
    font-family: ui-monospace, monospace;
    font-size: 0.75rem;
    line-height: 1.4;
  }
</style>
