<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getSheetContext } from './ctx.js'

  export interface Props extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const ctx = getSheetContext()
</script>

<p id={ctx.descriptionId} class={cn('sig-sheet-description', className)} {...rest}>
  {@render children?.()}
</p>

<style>
  :global(.sig-sheet-description) {
    margin: 0 0 1rem;
    color: var(--sig-muted, #71717a);
    font-size: 0.875rem;
    line-height: 1.5;
  }
</style>
