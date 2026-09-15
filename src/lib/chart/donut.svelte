<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Segment {
    value: number
    label?: string
    color?: string
  }

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    data: Segment[]
    label?: string
    size?: number
    thickness?: number
    children?: Snippet
  }

  const PALETTE = [
    'var(--sig-chart-1, var(--sig-accent, #4f46e5))',
    'var(--sig-chart-2, var(--sig-info, #0284c7))',
    'var(--sig-chart-3, var(--sig-success, #16a34a))',
    'var(--sig-chart-4, var(--sig-warning, #d97706))',
    'var(--sig-chart-5, var(--sig-danger, #dc2626))',
    'var(--sig-muted, #71717a)'
  ]

  let {
    data,
    label = 'Donut chart',
    size = 140,
    thickness = 16,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const CIRC = 2 * Math.PI * 40

  const segments = $derived.by(() => {
    const total = data.reduce((s, d) => s + d.value, 0) || 1
    let offset = 0
    return data.map((d, i) => {
      const frac = d.value / total
      const seg = {
        frac,
        offset,
        value: d.value,
        color: d.color ?? PALETTE[i % PALETTE.length],
        label: d.label
      }
      offset += frac
      return seg
    })
  })
</script>

<figure class={cn('sig-donut', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <circle cx="50" cy="50" r="40" class="sig-donut-track" stroke-width={thickness} />
    {#each segments as s (s.offset)}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={s.color}
        stroke-width={thickness}
        stroke-dasharray={`${(s.frac * CIRC).toFixed(2)} ${CIRC.toFixed(2)}`}
        stroke-dashoffset={(-s.offset * CIRC).toFixed(2)}
        class="sig-donut-seg"
      >
        {#if s.label}<title>{s.label}: {s.value}</title>{/if}
      </circle>
    {/each}
  </svg>
  {#if children}
    <div class="sig-donut-center">{@render children()}</div>
  {/if}
</figure>

<style>
  :global(.sig-donut) {
    position: relative;
    display: inline-flex;
    margin: 0;
  }

  :global(.sig-donut-track) {
    fill: none;
    stroke: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-donut-seg) {
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: opacity 120ms ease;
  }

  :global(.sig-donut-seg:hover) {
    opacity: 0.8;
  }

  :global(.sig-donut-center) {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
