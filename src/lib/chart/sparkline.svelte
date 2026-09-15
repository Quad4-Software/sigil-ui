<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<SVGElement> {
    data: number[]
    label?: string
    height?: number
    filled?: boolean
  }

  let {
    data,
    label = 'Sparkline',
    height = 32,
    filled = false,
    class: className,
    ...rest
  }: Props = $props()

  const W = 100
  const H = 24

  const points = $derived.by(() => {
    if (data.length === 0) return ''
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    return data
      .map(
        (v, i) =>
          `${((i / (data.length - 1 || 1)) * W).toFixed(2)},${(H - ((v - min) / range) * (H - 4) - 2).toFixed(2)}`
      )
      .join(' ')
  })

  const areaPath = $derived(points ? `M0,${H} L${points.split(' ').join(' L')} L${W},${H} Z` : '')
</script>

<svg
  viewBox={`0 0 ${W} ${H}`}
  width="100%"
  {height}
  preserveAspectRatio="none"
  role="img"
  aria-label={label}
  class={cn('sig-sparkline', className)}
  {...rest}
>
  {#if filled}
    <path d={areaPath} class="sig-sparkline-area" />
  {/if}
  <polyline {points} class="sig-sparkline-line" />
</svg>

<style>
  :global(.sig-sparkline) {
    display: block;
  }

  :global(.sig-sparkline-line) {
    fill: none;
    stroke: var(--sig-chart-1, var(--sig-accent, #4f46e5));
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  :global(.sig-sparkline-area) {
    fill: var(--sig-chart-1, var(--sig-accent, #4f46e5));
    opacity: 0.15;
  }
</style>
