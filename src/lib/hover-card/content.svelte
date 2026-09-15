<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getHoverCard } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    side?: 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
    children?: Snippet
  }

  let { side = 'bottom', align = 'center', class: className, children, ...rest }: Props = $props()

  const card = getHoverCard()
</script>

{#if card.open}
  <div
    id={card.id}
    role="tooltip"
    data-side={side}
    data-align={align}
    data-state="open"
    class={cn('sig-hover-card', className)}
    onpointerenter={() => card.cancelClose()}
    onpointerleave={() => card.scheduleClose()}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-hover-card) {
    position: absolute;
    z-index: 50;
    min-width: 12rem;
    padding: 0.75rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 4px 12px rgb(0 0 0 / 0.1));
    font-size: 0.875rem;
  }

  :global(.sig-hover-card[data-side='bottom']) {
    top: calc(100% + 0.375rem);
  }

  :global(.sig-hover-card[data-side='top']) {
    bottom: calc(100% + 0.375rem);
  }

  :global(
    .sig-hover-card[data-side='bottom'][data-align='center'],
    .sig-hover-card[data-side='top'][data-align='center']
  ) {
    left: 50%;
    transform: translateX(-50%);
  }

  :global(
    .sig-hover-card[data-side='bottom'][data-align='end'],
    .sig-hover-card[data-side='top'][data-align='end']
  ) {
    right: 0;
  }
</style>
