<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLTdAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLTdAttributes {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<td class={cn('sig-table-cell', className)} {...rest}>
  {@render children?.()}
</td>

<style>
  :global(.sig-table-cell) {
    padding: 0.5rem 0.75rem;
    vertical-align: middle;
  }
</style>
