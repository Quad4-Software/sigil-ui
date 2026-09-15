<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getHoverCard } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const card = getHoverCard()
</script>

<button
  type="button"
  aria-expanded={card.open}
  aria-describedby={card.open ? card.id : undefined}
  data-state={card.open ? 'open' : 'closed'}
  class={cn('sig-hover-trigger', className)}
  onpointerenter={() => card.scheduleOpen()}
  onpointerleave={() => card.scheduleClose()}
  onfocus={() => card.scheduleOpen()}
  onblur={() => card.scheduleClose()}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-hover-trigger) {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    cursor: default;
  }
</style>
