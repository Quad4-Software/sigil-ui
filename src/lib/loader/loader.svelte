<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    kind?: 'spinner' | 'dots' | 'bars' | 'pulse'
    size?: 'sm' | 'md' | 'lg'
    label?: string
  }

  let {
    kind = 'spinner',
    size = 'md',
    label = 'Loading',
    class: className,
    ...rest
  }: Props = $props()
</script>

<span
  role="status"
  aria-label={label}
  class={cn('sig-loader', className)}
  data-kind={kind}
  data-size={size}
  {...rest}
>
  {#if kind === 'dots'}
    <i class="sig-loader-dot"></i><i class="sig-loader-dot"></i><i class="sig-loader-dot"></i>
  {:else if kind === 'bars'}
    <i class="sig-loader-bar"></i><i class="sig-loader-bar"></i><i class="sig-loader-bar"></i><i
      class="sig-loader-bar"
    ></i>
  {:else if kind === 'pulse'}
    <i class="sig-loader-pulse"></i>
  {/if}
</span>

<style>
  :global(.sig-loader) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--sig-accent, #4f46e5);
    font-size: 1rem;
  }

  :global(.sig-loader[data-size='sm']) {
    font-size: 0.75rem;
  }

  :global(.sig-loader[data-size='lg']) {
    font-size: 1.5rem;
  }

  :global(.sig-loader[data-kind='spinner']) {
    width: 1em;
    height: 1em;
    border: 0.125em solid var(--sig-border, #d4d4d8);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: sig-loader-spin 0.7s linear infinite;
  }

  :global(.sig-loader-dot) {
    width: 0.375em;
    height: 0.375em;
    border-radius: 50%;
    background: currentColor;
    animation: sig-loader-bounce 1s ease-in-out infinite;
  }

  :global(.sig-loader-dot:nth-child(2)) {
    animation-delay: 150ms;
  }

  :global(.sig-loader-dot:nth-child(3)) {
    animation-delay: 300ms;
  }

  :global(.sig-loader-bar) {
    width: 0.1875em;
    height: 1em;
    border-radius: 999px;
    background: currentColor;
    transform-origin: 50% 100%;
    animation: sig-loader-eq 0.9s ease-in-out infinite;
  }

  :global(.sig-loader-bar:nth-child(2)) {
    animation-delay: 120ms;
  }

  :global(.sig-loader-bar:nth-child(3)) {
    animation-delay: 240ms;
  }

  :global(.sig-loader-bar:nth-child(4)) {
    animation-delay: 360ms;
  }

  :global(.sig-loader-pulse) {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background: currentColor;
    animation: sig-loader-pulse 1.2s ease-in-out infinite;
  }

  @keyframes sig-loader-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sig-loader-bounce {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    50% {
      transform: translateY(-0.25em);
      opacity: 1;
    }
  }

  @keyframes sig-loader-eq {
    0%,
    100% {
      transform: scaleY(0.35);
    }
    50% {
      transform: scaleY(1);
    }
  }

  @keyframes sig-loader-pulse {
    0%,
    100% {
      transform: scale(0.6);
      opacity: 0.4;
    }
    50% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-loader[data-kind='spinner']) {
      animation-duration: 2s;
    }

    :global(.sig-loader-dot),
    :global(.sig-loader-bar),
    :global(.sig-loader-pulse) {
      animation: none;
      opacity: 0.8;
    }
  }
</style>
