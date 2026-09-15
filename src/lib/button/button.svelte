<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

  interface Props extends HTMLButtonAttributes {
    variant?: Variant
    children?: Snippet
  }

  let { variant = 'primary', class: className, children, ...rest }: Props = $props()
</script>

<button class={cn('sig-btn', className)} data-variant={variant} {...rest}>
  {@render children?.()}
</button>

<style>
  :global(.sig-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font: inherit;
    font-weight: 500;
    line-height: 1.25;
    border: 1px solid transparent;
    border-radius: var(--sig-radius, 0.375rem);
    cursor: pointer;
    user-select: none;
    transition:
      background-color 120ms,
      border-color 120ms,
      color 120ms;
  }

  :global(.sig-btn:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-btn:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-btn[data-variant='primary']) {
    background: var(--sig-accent, #4f46e5);
    color: var(--sig-accent-fg, #fff);
  }

  :global(.sig-btn[data-variant='primary']:hover:not(:disabled)) {
    background: var(--sig-accent-hover, var(--sig-accent, #4338ca));
  }

  :global(.sig-btn[data-variant='secondary']) {
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-fg, #18181b);
    border-color: var(--sig-border, #d4d4d8);
  }

  :global(.sig-btn[data-variant='secondary']:hover:not(:disabled)) {
    background: var(--sig-surface-hover, var(--sig-surface, #e4e4e7));
  }

  :global(.sig-btn[data-variant='ghost']) {
    background: transparent;
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-btn[data-variant='ghost']:hover:not(:disabled)) {
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-btn[data-variant='danger']) {
    background: var(--sig-danger, #dc2626);
    color: var(--sig-danger-fg, #fff);
  }

  :global(.sig-btn[data-variant='danger']:hover:not(:disabled)) {
    background: var(--sig-danger-hover, var(--sig-danger, #b91c1c));
  }
</style>
