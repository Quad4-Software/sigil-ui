<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    value: number
    min?: number
    max?: number
    label?: string
    size?: number
    thickness?: number
    color?: string | undefined
    children?: Snippet
  }

  let {
    value,
    min = 0,
    max = 100,
    label = 'Gauge',
    size = 160,
    thickness = 12,
    color,
    class: className,
    children,
    ...rest
  }: Props = $props()

  // Semicircle arc, radius 40, centered at (50, 50).
  const R = 40
  const LEN = Math.PI * R
  const frac = $derived(Math.min(Math.max((value - min) / (max - min || 1), 0), 1))
</script>

<figure class={cn('sig-gauge', className)} role="img" aria-label={`${label}: ${value}`} {...rest}>
  <svg viewBox="0 0 100 60" width={size} height={size * 0.6}>
    <path d="M10 50 A40 40 0 0 1 90 50" class="sig-gauge-track" stroke-width={thickness} />
    <path
      d="M10 50 A40 40 0 0 1 90 50"
      class="sig-gauge-arc"
      stroke={color}
      stroke-width={thickness}
      stroke-dasharray={`${(frac * LEN).toFixed(2)} ${LEN.toFixed(2)}`}
    >
      <title>{value}</title>
    </path>
  </svg>
  <div class="sig-gauge-value">
    {#if children}
      {@render children()}
    {:else}
      <span class="sig-gauge-number">{value}</span>
    {/if}
  </div>
</figure>

<style>
  :global(.sig-gauge) {
    position: relative;
    display: inline-flex;
    margin: 0;
  }

  :global(.sig-gauge-track) {
    fill: none;
    stroke: var(--sig-surface, #f4f4f5);
    stroke-linecap: round;
  }

  :global(.sig-gauge-arc) {
    fill: none;
    stroke: var(--sig-accent, #4f46e5);
    stroke-linecap: round;
    transition: stroke-dasharray 200ms ease;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-gauge-arc) {
      transition: none;
    }
  }

  :global(.sig-gauge-value) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    font-weight: 600;
  }
</style>
