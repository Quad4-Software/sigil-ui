<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { onMount } from 'svelte'
  import { cn } from '../utils/cn.js'
  import { getMenubar, getMenubarMenu } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    onSelect?: () => void
    children?: Snippet
  }

  let { onSelect, class: className, children, onclick, disabled, ...rest }: Props = $props()

  const bar = getMenubar()
  const menu = getMenubarMenu()

  let el: HTMLButtonElement | undefined = $state()
  onMount(() => (el ? menu.registerItem(el).unregister : undefined))
</script>

<button
  bind:this={el}
  type="button"
  role="menuitem"
  tabindex="-1"
  data-disabled={disabled ? '' : undefined}
  {disabled}
  class={cn('sig-menu-item', className)}
  onclick={(event) => {
    if (disabled) return
    onSelect?.()
    bar.close()
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-menu-item) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.375rem 0.625rem;
    border: none;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    background: none;
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 0.875rem;
    text-align: left;
    cursor: default;
  }

  :global(.sig-menu-item:hover:not(:disabled), .sig-menu-item:focus-visible) {
    background: var(--sig-surface-hover, #e4e4e7);
    outline: none;
  }

  :global(.sig-menu-item:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
