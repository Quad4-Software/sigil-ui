<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Datum {
    label: string
    value: number
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    data: Datum[]
    label?: string
    height?: number
  }

  let { data, label = 'Funnel chart', height = 180, class: className, ...rest }: Props = $props()

  const W = 400
  const PAD = 8
  const GAP = 4

  const max = $derived(Math.max(...data.map((d) => d.value), 1))
  const rowH = $derived(
    (160 - PAD * 2 - GAP * Math.max(data.length - 1, 0)) / Math.max(data.length, 1)
  )
  const H = $derived(data.length * (rowH + GAP) - GAP + PAD * 2)

  const half = (v: number) => ((v / max) * (W - PAD * 2)) / 2

  /** Each stage is a trapezoid tapering toward the next stage width. */
  const points = (value: number, next: number | undefined, i: number) => {
    const top = half(value)
    const bot = next === undefined ? top : half(next)
    const y0 = PAD + i * (rowH + GAP)
    const y1 = y0 + rowH
    const cx = W / 2
    return `${cx - top},${y0} ${cx + top},${y0} ${cx + bot},${y1} ${cx - bot},${y1}`
  }
</script>

<figure class={cn('sig-chart', 'sig-funnel', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" {height} preserveAspectRatio="none">
    {#each data as d, i (i)}
      <polygon points={points(d.value, data[i + 1]?.value, i)} class="sig-funnel-stage">
        <title>{d.label}: {d.value}</title>
      </polygon>
    {/each}
  </svg>
  <figcaption class="sig-chart-ticks">
    {#each data as d (d.label)}
      <span>{d.label}</span>
    {/each}
  </figcaption>
</figure>

<style>
  :global(.sig-funnel-stage) {
    fill: var(--sig-chart-1, var(--sig-accent, #4f46e5));
    transition: opacity 120ms ease;
  }

  :global(.sig-funnel-stage:hover) {
    opacity: 0.8;
  }

  :global(.sig-funnel-stage:nth-of-type(5n + 2)) {
    fill: var(--sig-chart-2, #0284c7);
  }

  :global(.sig-funnel-stage:nth-of-type(5n + 3)) {
    fill: var(--sig-chart-3, #16a34a);
  }

  :global(.sig-funnel-stage:nth-of-type(5n + 4)) {
    fill: var(--sig-chart-4, #d97706);
  }

  :global(.sig-funnel-stage:nth-of-type(5n)) {
    fill: var(--sig-chart-5, #dc2626);
  }
</style>
