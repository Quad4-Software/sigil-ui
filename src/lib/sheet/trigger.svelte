<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getSheetContext } from './ctx.js'

  export interface Props extends HTMLButtonAttributes {
    children?: Snippet
  }

  let { class: className, children, onclick, ...rest }: Props = $props()
  const ctx = getSheetContext()
</script>

<button
  type="button"
  aria-haspopup="dialog"
  class={cn('sig-sheet-trigger', className)}
  onclick={(event) => {
    ctx.open = true
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-sheet-trigger) {
    font: inherit;
    cursor: pointer;
  }
</style>
