<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: number
    max?: number
    label?: string
  }

  let { value, max = 100, label, class: className, ...rest }: Props = $props()

  const pct = $derived(value === undefined ? null : Math.min(100, Math.max(0, (value / max) * 100)))
</script>

<div
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value === undefined ? undefined : Math.round(value)}
  aria-label={label}
  class={cn('sig-progress', className)}
  data-indeterminate={value === undefined ? '' : undefined}
  {...rest}
>
  <div class="sig-progress-bar" style={pct === null ? undefined : `width: ${pct}%`}></div>
</div>

<style>
  :global(.sig-progress) {
    width: 100%;
    height: 0.5rem;
    border-radius: 9999px;
    background: var(--sig-surface, #f4f4f5);
    overflow: hidden;
  }

  :global(.sig-progress-bar) {
    height: 100%;
    border-radius: inherit;
    background: var(--sig-accent, #4f46e5);
    transition: width 150ms;
  }

  :global(.sig-progress[data-indeterminate] .sig-progress-bar) {
    width: 40%;
    animation: sig-progress-indeterminate 1.2s ease-in-out infinite;
  }

  @keyframes sig-progress-indeterminate {
    0% {
      margin-left: -40%;
    }
    100% {
      margin-left: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-progress[data-indeterminate] .sig-progress-bar) {
      animation: none;
      width: 100%;
      margin-left: 0;
    }
  }
</style>
