<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getSheetContext } from './ctx.js'

  export interface Props extends HTMLAttributes<HTMLHeadingElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const ctx = getSheetContext()
</script>

<h2 id={ctx.titleId} class={cn('sig-sheet-title', className)} {...rest}>
  {@render children?.()}
</h2>

<style>
  :global(.sig-sheet-title) {
    margin: 0 0 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
  }
</style>
