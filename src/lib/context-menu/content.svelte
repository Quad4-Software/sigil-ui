<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getContextMenu } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, onkeydown, ...rest }: Props = $props()

  const menu = getContextMenu()
  let el: HTMLElement | undefined = $state()
  let px = $state(0)
  let py = $state(0)

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
        menu.open = false
        break
    }
  }

  // Clamp into the viewport once measured so the menu never overflows
  // the right or bottom edge.
  $effect(() => {
    if (!menu.open || !el) return
    px = Math.min(menu.x, Math.max(4, window.innerWidth - el.offsetWidth - 4))
    py = Math.min(menu.y, Math.max(4, window.innerHeight - el.offsetHeight - 4))
  })
</script>

{#if menu.open}
  <div
    bind:this={el}
    role="menu"
    data-state="open"
    tabindex="-1"
    class={cn('sig-cm-content', className)}
    style:left="{px}px"
    style:top="{py}px"
    onkeydown={handleKeydown}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-cm-content) {
    position: fixed;
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
</style>
