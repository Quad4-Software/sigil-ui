<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLTableAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLTableAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<div class="sig-table-wrap">
  <table class={cn('sig-table', className)} {...rest}>
    {@render children?.()}
  </table>
</div>

<style>
  :global(.sig-table-wrap) {
    overflow-x: auto;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    color: var(--sig-fg, #18181b);
    text-align: left;
  }

  /* zero-specificity fallbacks so bare markup inside .sig-table is
     styled without the part classes; the sig-table-* classes still
     win when present */
  :global(.sig-table :where(thead)) {
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-table :where(th)) {
    padding: 0.5rem 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  :global(.sig-table :where(td)) {
    padding: 0.5rem 0.75rem;
    vertical-align: middle;
  }

  :global(.sig-table :where(tbody) tr) {
    border-top: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-table :where(tbody) tr:hover) {
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-table :where(caption)) {
    padding: 0.75rem;
    color: var(--sig-muted, #71717a);
    font-size: 0.8125rem;
    caption-side: bottom;
  }
</style>
