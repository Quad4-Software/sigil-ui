<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    data: number[]
    labels?: string[] | undefined
    label?: string
    height?: number
    filled?: boolean
    dots?: boolean
  }

  let {
    data,
    labels,
    label = 'Line chart',
    height = 180,
    filled = true,
    dots = false,
    class: className,
    ...rest
  }: Props = $props()

  const W = 400
  const H = 160
  const PAD = 8

  const scale = $derived.by(() => {
    const min = Math.min(...data, 0)
    const max = Math.max(...data)
    const range = max - min || 1
    const x = (i: number) => PAD + (i / (data.length - 1 || 1)) * (W - PAD * 2)
    const y = (v: number) => H - PAD - ((v - min) / range) * (H - PAD * 2)
    return { x, y, min, max }
  })

  const pts = $derived(
    data.map((v, i) => `${scale.x(i).toFixed(2)},${scale.y(v).toFixed(2)}`).join(' ')
  )
  const areaPath = $derived(
    pts
      ? `M${scale.x(0)},${H - PAD} L${pts.split(' ').join(' L')} L${scale.x(data.length - 1)},${H - PAD} Z`
      : ''
  )

  const ticks = $derived(
    labels && labels.length === data.length
      ? labels.filter(
          (_, i) => i === 0 || i === data.length - 1 || i % Math.ceil(data.length / 6) === 0
        )
      : []
  )
</script>

<figure class={cn('sig-chart', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" {height} preserveAspectRatio="none">
    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} class="sig-chart-axis" />
    {#each [0.25, 0.5, 0.75] as f (f)}
      <line
        x1={PAD}
        y1={H - PAD - f * (H - PAD * 2)}
        x2={W - PAD}
        y2={H - PAD - f * (H - PAD * 2)}
        class="sig-chart-grid"
      />
    {/each}
    {#if filled}
      <path d={areaPath} class="sig-chart-area" />
    {/if}
    <polyline points={pts} class="sig-chart-line" />
    {#if dots}
      {#each data as v, i (i)}
        <circle cx={scale.x(i)} cy={scale.y(v)} r="2.5" class="sig-chart-dot" />
      {/each}
    {/if}
  </svg>
  {#if ticks.length}
    <figcaption class="sig-chart-ticks">
      {#each ticks as t (t)}
        <span>{t}</span>
      {/each}
    </figcaption>
  {/if}
</figure>

<style>
  :global(.sig-chart) {
    margin: 0;
  }

  :global(.sig-chart svg) {
    display: block;
    overflow: visible;
  }

  :global(.sig-chart-grid) {
    stroke: var(--sig-border, #e4e4e7);
    stroke-dasharray: 3 4;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  :global(.sig-chart-axis) {
    stroke: var(--sig-border, #e4e4e7);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }

  :global(.sig-chart-line) {
    fill: none;
    stroke: var(--sig-accent, #4f46e5);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  :global(.sig-chart-area) {
    fill: var(--sig-accent, #4f46e5);
    opacity: 0.12;
  }

  :global(.sig-chart-dot) {
    fill: var(--sig-accent, #4f46e5);
  }

  :global(.sig-chart-ticks) {
    display: flex;
    justify-content: space-between;
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: var(--sig-muted, #71717a);
  }
</style>
