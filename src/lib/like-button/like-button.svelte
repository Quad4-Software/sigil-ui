<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLButtonAttributes {
    liked?: boolean
    count?: number
    shape?: 'heart' | 'star'
    label?: string
  }

  let {
    liked = $bindable(false),
    count,
    shape = 'heart',
    label,
    class: className,
    onclick,
    ...rest
  }: Props = $props()

  const star = 'M12 2l2.9 6.26 6.6.56-5 4.4 1.5 6.48L12 16.9 5.99 19.7l1.5-6.48-5-4.4 6.6-.56z'
  const heart =
    'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
</script>

<button
  type="button"
  class={cn('sig-like', className)}
  data-shape={shape}
  aria-pressed={liked}
  aria-label={label ?? (liked ? 'Unlike' : 'Like')}
  onclick={(event) => {
    liked = !liked
    onclick?.(event)
  }}
  {...rest}
>
  <span class="sig-like-icon" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        d={shape === 'star' ? star : heart}
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linejoin="round"
      />
    </svg>
  </span>
  {#if count != null}
    <span class="sig-like-count">{count}</span>
  {/if}
</button>

<style>
  :global(.sig-like) {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-fg, #18181b);
    cursor: pointer;
    user-select: none;
    transition:
      background-color 120ms ease,
      border-color 120ms ease,
      color 120ms ease;
  }

  :global(.sig-like:hover) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-like:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-like-icon) {
    display: inline-flex;
    color: var(--sig-muted, #71717a);
    transition: color 120ms ease;
  }

  :global(.sig-like[aria-pressed='true'] .sig-like-icon) {
    color: var(--sig-accent, #4f46e5);
    animation: sig-like-pop 250ms cubic-bezier(0.2, 2, 0.4, 1);
  }

  :global(.sig-like[aria-pressed='true'][data-shape='heart'] .sig-like-icon) {
    color: var(--sig-chart-5, var(--sig-danger, #dc2626));
  }

  @keyframes sig-like-pop {
    0% {
      transform: scale(0.6);
    }
    60% {
      transform: scale(1.25);
    }
    100% {
      transform: scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-like[aria-pressed='true'] .sig-like-icon) {
      animation: none;
    }
  }
</style>
