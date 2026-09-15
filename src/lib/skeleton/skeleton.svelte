<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div aria-hidden="true" class={cn('sig-skeleton', className)} {...rest}></div>

<style>
  :global(.sig-skeleton) {
    display: block;
    width: 100%;
    height: 1rem;
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-surface, #f4f4f5);
    animation: sig-skeleton-pulse 1.5s ease-in-out infinite;
  }

  @keyframes sig-skeleton-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-skeleton) {
      animation: none;
    }
  }
</style>
