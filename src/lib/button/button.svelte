<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

  interface Props extends HTMLButtonAttributes {
    variant?: Variant
    loading?: boolean
    children?: Snippet
  }

  let {
    variant = 'primary',
    loading = false,
    disabled,
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<button
  class={cn('sig-btn', className)}
  data-variant={variant}
  aria-busy={loading || undefined}
  disabled={disabled || loading}
  {...rest}
>
  {#if loading}
    <span class="sig-btn-spinner" aria-hidden="true"></span>
  {/if}
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

  :global(.sig-btn-spinner) {
    width: 0.875rem;
    height: 0.875rem;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 999px;
    animation: sig-btn-spin 0.7s linear infinite;
  }

  @keyframes sig-btn-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-btn-spinner) {
      animation-duration: 2s;
    }
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
