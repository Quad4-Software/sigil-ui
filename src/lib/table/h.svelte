<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLThAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLThAttributes {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<th class={cn('sig-table-h', className)} {...rest}>
  {@render children?.()}
</th>

<style>
  :global(.sig-table-h) {
    padding: 0.5rem 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }
</style>
