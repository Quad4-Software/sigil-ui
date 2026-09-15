<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLButtonAttributes, 'role' | 'children'> {
    checked?: boolean
    children?: Snippet<[{ checked: boolean }]>
  }

  let {
    checked = $bindable(false),
    class: className,
    children,
    onclick,
    disabled,
    ...rest
  }: Props = $props()
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  data-state={checked ? 'checked' : 'unchecked'}
  data-disabled={disabled ? '' : undefined}
  {disabled}
  class={cn('sig-switch', className)}
  onclick={(event) => {
    if (disabled) return
    checked = !checked
    onclick?.(event)
  }}
  {...rest}
>
  {#if children}
    {@render children({ checked })}
  {:else}
    <span class="sig-switch-thumb"></span>
  {/if}
</button>

<style>
  :global(.sig-switch) {
    display: inline-flex;
    align-items: center;
    width: 2.5rem;
    height: 1.375rem;
    padding: 0.125rem;
    border-radius: 9999px;
    border: 1px solid var(--sig-border, #d4d4d8);
    background: var(--sig-surface, #f4f4f5);
    cursor: pointer;
    transition: background-color 120ms;
  }

  :global(.sig-switch[data-state='checked']) {
    background: var(--sig-accent, #4f46e5);
    border-color: transparent;
  }

  :global(.sig-switch:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-switch:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-switch .sig-switch-thumb) {
    display: block;
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    background: var(--sig-fg, #18181b);
    transition: transform 120ms;
  }

  :global(.sig-switch[data-state='checked'] .sig-switch-thumb) {
    transform: translateX(1.125rem);
    background: var(--sig-accent-fg, #fff);
  }
</style>
