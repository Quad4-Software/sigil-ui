<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getPopover } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
    children?: Snippet
  }

  let { side = 'bottom', align = 'center', class: className, children, ...rest }: Props = $props()

  const pop = getPopover()
</script>

{#if pop.open}
  <div
    {@attach (node) => {
      pop.setContent(node)
      return () => pop.setContent(undefined)
    }}
    id={pop.id}
    role="dialog"
    data-side={side}
    data-align={align}
    data-state="open"
    class={cn('sig-pop-content', className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-pop-content) {
    position: absolute;
    z-index: 50;
    min-width: 8rem;
    padding: 0.75rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 4px 12px rgb(0 0 0 / 0.1));
    font-size: 0.875rem;
  }

  :global(.sig-pop-content[data-side='bottom']) {
    top: calc(100% + 0.375rem);
  }

  :global(.sig-pop-content[data-side='top']) {
    bottom: calc(100% + 0.375rem);
  }

  :global(.sig-pop-content[data-side='right']) {
    left: calc(100% + 0.375rem);
  }

  :global(.sig-pop-content[data-side='left']) {
    right: calc(100% + 0.375rem);
  }

  :global(
    .sig-pop-content[data-side='bottom'][data-align='center'],
    .sig-pop-content[data-side='top'][data-align='center']
  ) {
    left: 50%;
    transform: translateX(-50%);
  }

  :global(
    .sig-pop-content[data-side='bottom'][data-align='end'],
    .sig-pop-content[data-side='top'][data-align='end']
  ) {
    right: 0;
  }

  :global(
    .sig-pop-content[data-side='right'][data-align='center'],
    .sig-pop-content[data-side='left'][data-align='center']
  ) {
    top: 50%;
    transform: translateY(-50%);
  }

  :global(
    .sig-pop-content[data-side='right'][data-align='end'],
    .sig-pop-content[data-side='left'][data-align='end']
  ) {
    bottom: 0;
  }
</style>
