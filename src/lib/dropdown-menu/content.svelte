<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getMenu } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    side?: 'top' | 'bottom'
    align?: 'start' | 'center' | 'end'
    children?: Snippet
  }

  let {
    side = 'bottom',
    align = 'start',
    class: className,
    children,
    onkeydown,
    ...rest
  }: Props = $props()

  const menu = getMenu()

  function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    onkeydown?.(event)
    const items = menu.items()
    const active = document.activeElement as HTMLElement | null
    const index = active ? items.indexOf(active) : -1
    const move = (next: number) => items[next]?.focus()

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move((index + 1) % items.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        move((index - 1 + items.length) % items.length)
        break
      case 'Home':
        event.preventDefault()
        move(0)
        break
      case 'End':
        event.preventDefault()
        move(items.length - 1)
        break
      case 'Tab':
        // Tab inside a menu closes it and lets focus proceed naturally.
        menu.open = false
        break
    }
  }
</script>

{#if menu.open}
  <div
    id={menu.id}
    role="menu"
    data-side={side}
    data-align={align}
    data-state="open"
    tabindex="-1"
    class={cn('sig-menu-content', className)}
    onkeydown={handleKeydown}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-menu-content) {
    position: absolute;
    z-index: 50;
    min-width: 10rem;
    padding: 0.25rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 4px 12px rgb(0 0 0 / 0.1));
    font-size: 0.875rem;
  }

  :global(.sig-menu-content[data-side='bottom']) {
    top: calc(100% + 0.25rem);
  }

  :global(.sig-menu-content[data-side='top']) {
    bottom: calc(100% + 0.25rem);
  }

  :global(.sig-menu-content[data-align='start']) {
    left: 0;
  }

  :global(.sig-menu-content[data-align='center']) {
    left: 50%;
    transform: translateX(-50%);
  }

  :global(.sig-menu-content[data-align='end']) {
    right: 0;
  }
</style>
