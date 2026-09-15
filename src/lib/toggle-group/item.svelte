<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { onMount } from 'svelte'
  import { cn } from '../utils/cn.js'
  import { getToggleGroup } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children' | 'value'> {
    value: string
    children?: Snippet<[{ pressed: boolean }]>
  }

  let { value, disabled = false, class: className, children, onclick, ...rest }: Props = $props()

  const ctx = getToggleGroup()
  const pressed = $derived(ctx.isPressed(value))
  const isDisabled = $derived(disabled || ctx.disabled)

  let el: HTMLButtonElement | undefined = $state()
  onMount(() => (el ? ctx.registerItem(el).unregister : undefined))
</script>

<button
  bind:this={el}
  type="button"
  aria-pressed={pressed}
  data-state={pressed ? 'on' : 'off'}
  data-value={value}
  data-disabled={isDisabled ? '' : undefined}
  disabled={isDisabled}
  class={cn('sig-toggle-item', className)}
  onclick={(event) => {
    if (isDisabled) return
    ctx.toggle(value)
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.({ pressed })}
</button>

<style>
  :global(.sig-toggle-item) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: 0;
    margin-left: -1px;
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }

  :global(.sig-toggle-item:first-child) {
    margin-left: 0;
    border-top-left-radius: var(--sig-radius, 0.375rem);
    border-bottom-left-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-toggle-item:last-child) {
    border-top-right-radius: var(--sig-radius, 0.375rem);
    border-bottom-right-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-toggle-item:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-toggle-item[data-state='on']) {
    background: var(--sig-accent, #4f46e5);
    border-color: transparent;
    color: var(--sig-accent-fg, #fff);
    position: relative;
  }

  :global(.sig-toggle-item:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
    z-index: 1;
  }

  :global(.sig-toggle-item:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
