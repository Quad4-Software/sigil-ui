<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    label?: string
  }

  let { label = 'Loading', class: className, ...rest }: Props = $props()
</script>

<span role="status" aria-label={label} class={cn('sig-spinner', className)} {...rest}></span>

<style>
  :global(.sig-spinner) {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--sig-border, #d4d4d8);
    border-top-color: var(--sig-accent, #4f46e5);
    border-radius: 50%;
    animation: sig-spin 0.7s linear infinite;
  }

  @keyframes sig-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-spinner) {
      animation: none;
    }
  }
</style>
