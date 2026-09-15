<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getMenubar, getMenubarMenu } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, onkeydown, ...rest }: Props = $props()

  const bar = getMenubar()
  const menu = getMenubarMenu()

  function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    onkeydown?.(event)
    const items = menu.items
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const active = document.activeElement as HTMLElement | null
      const index = active ? items.indexOf(active) : -1
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const next = items[(index + delta + items.length) % items.length]
      next?.focus()
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const target = event.key === 'Home' ? items[0] : items[items.length - 1]
      target?.focus()
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      bar.moveMenu(event.key === 'ArrowRight' ? 1 : -1)
    }
  }
</script>

{#if menu.open}
  <div
    role="menu"
    data-state="open"
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
    top: calc(100% + 0.375rem);
    left: 0;
    z-index: 50;
    min-width: 10rem;
    padding: 0.25rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    box-shadow: var(--sig-shadow, 0 4px 12px rgb(0 0 0 / 0.1));
  }
</style>
