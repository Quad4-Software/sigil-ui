<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    pressed?: boolean
    children?: Snippet<[{ pressed: boolean }]>
  }

  let {
    pressed = $bindable(false),
    class: className,
    children,
    onclick,
    disabled,
    ...rest
  }: Props = $props()
</script>

<button
  type="button"
  aria-pressed={pressed}
  data-state={pressed ? 'on' : 'off'}
  data-disabled={disabled ? '' : undefined}
  {disabled}
  class={cn('sig-toggle', className)}
  onclick={(event) => {
    if (disabled) return
    pressed = !pressed
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.({ pressed })}
</button>

<style>
  :global(.sig-toggle) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 0.875rem;
    cursor: pointer;
  }

  :global(.sig-toggle:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-toggle[data-state='on']) {
    background: var(--sig-accent, #4f46e5);
    border-color: transparent;
    color: var(--sig-accent-fg, #fff);
  }

  :global(.sig-toggle:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-toggle:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
