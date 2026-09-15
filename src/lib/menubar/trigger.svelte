<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getMenubar, getMenubarMenu } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, onclick, onkeydown, ...rest }: Props = $props()

  const bar = getMenubar()
  const menu = getMenubarMenu()
</script>

<button
  {@attach (node) => {
    menu.setTrigger(node)
    return () => menu.setTrigger(undefined)
  }}
  type="button"
  role="menuitem"
  aria-haspopup="menu"
  aria-expanded={menu.open}
  data-state={menu.open ? 'open' : 'closed'}
  class={cn('sig-menu-trigger', className)}
  onclick={(event) => {
    if (menu.open) bar.close()
    else bar.open(menu.index)
    onclick?.(event)
  }}
  onpointerenter={() => {
    if (bar.openIndex >= 0 && !menu.open) bar.open(menu.index)
  }}
  onkeydown={(event) => {
    onkeydown?.(event)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      bar.open(menu.index)
      menu.items[0]?.focus()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      bar.moveMenu(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      bar.moveMenu(-1)
    }
  }}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-menu-trigger) {
    padding: 0.375rem 0.625rem;
    border: none;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    background: none;
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 0.875rem;
    cursor: default;
  }

  :global(.sig-menu-trigger:hover) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-menu-trigger[data-state='open']) {
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-menu-trigger:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: -2px;
  }
</style>
