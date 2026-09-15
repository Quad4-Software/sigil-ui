<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getDialogContext } from './ctx.js'

  interface Props extends HTMLButtonAttributes {
    children?: Snippet
  }

  let { class: className, children, onclick, ...rest }: Props = $props()
  const ctx = getDialogContext()
</script>

<button
  type="button"
  class={cn('sig-dialog-close', className)}
  onclick={(event) => {
    ctx.open = false
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-dialog-close) {
    font: inherit;
    cursor: pointer;
  }
</style>
