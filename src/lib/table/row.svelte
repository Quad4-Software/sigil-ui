<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLAttributes<HTMLTableRowElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<tr class={cn('sig-table-row', className)} {...rest}>
  {@render children?.()}
</tr>

<style>
  :global(.sig-table-body .sig-table-row) {
    border-top: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-table-body .sig-table-row:hover) {
    background: var(--sig-surface, #f4f4f5);
  }
</style>
