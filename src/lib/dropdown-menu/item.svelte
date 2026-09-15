<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getMenu } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'role' | 'children'> {
    disabled?: boolean
    onSelect?: () => void
    children?: Snippet
  }

  let { disabled = false, onSelect, class: className, children, onclick, ...rest }: Props = $props()

  const menu = getMenu()
  let el: HTMLElement | undefined = $state()

  $effect(() => {
    if (!el || disabled) return
    const node = el
    return menu.registerItem(node)
  })
</script>

<button
  bind:this={el}
  type="button"
  role="menuitem"
  tabindex="-1"
  {disabled}
  data-disabled={disabled ? '' : undefined}
  class={cn('sig-menu-item', className)}
  onclick={(event) => {
    if (disabled) return
    onSelect?.()
    onclick?.(event)
    if (!event.defaultPrevented) menu.open = false
  }}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-menu-item) {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border: none;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
  }

  :global(.sig-menu-item:hover:not(:disabled)),
  :global(.sig-menu-item:focus-visible) {
    background: var(--sig-surface-hover, #e4e4e7);
    outline: none;
  }

  :global(.sig-menu-item:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
