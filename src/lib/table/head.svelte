<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLAttributes<HTMLTableSectionElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<thead class={cn('sig-table-head', className)} {...rest}>
  {@render children?.()}
</thead>

<style>
  :global(.sig-table-head) {
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-muted, #71717a);
  }
</style>
