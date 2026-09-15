<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Series {
    name?: string
    data: number[]
    color?: string
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    data?: number[] | undefined
    series?: Series[] | undefined
    labels?: string[] | undefined
    label?: string
    height?: number
    filled?: boolean
    dots?: boolean
    legend?: boolean
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
    series,
    labels,
    label = 'Line chart',
    height = 180,
    filled,
    dots = false,
    legend = false,
    class: className,
    ...rest
  }: Props = $props()

  const W = 400
  const H = 160
  const PAD = 8

  const seriesList = $derived<Series[]>(series ?? (data ? [{ data }] : []))
  const isMulti = $derived(seriesList.length > 1)
  const showFill = $derived(filled ?? !isMulti)

  const scale = $derived.by(() => {
    const all = seriesList.flatMap((s) => s.data)
    const min = Math.min(...all, 0)
    const max = Math.max(...all)
    const range = max - min || 1
    const x = (i: number, len: number) => PAD + (i / (len - 1 || 1)) * (W - PAD * 2)
    const y = (v: number) => H - PAD - ((v - min) / range) * (H - PAD * 2)
    return { x, y, min, max }
  })

  const lineOf = (s: Series) =>
    s.data
      .map((v, i) => `${scale.x(i, s.data.length).toFixed(2)},${scale.y(v).toFixed(2)}`)
      .join(' ')

  const areaOf = (s: Series) => {
    const pts = lineOf(s)
    return pts
      ? `M${scale.x(0, s.data.length)},${H - PAD} L${pts.split(' ').join(' L')} L${scale.x(s.data.length - 1, s.data.length)},${H - PAD} Z`
      : ''
  }

  const ticks = $derived(
    labels && labels.length
      ? labels.filter(
          (_, i) => i === 0 || i === labels.length - 1 || i % Math.ceil(labels.length / 6) === 0
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
    {#each seriesList as s, si (si)}
      {@const color = s.color ?? PALETTE[si % PALETTE.length]}
      {#if showFill && si === 0}
        <path d={areaOf(s)} class="sig-chart-area" style:fill={color} />
      {/if}
      <polyline points={lineOf(s)} class="sig-chart-line" style:stroke={color} />
      {#if dots}
        {#each s.data as v, i (i)}
          <circle
            cx={scale.x(i, s.data.length)}
            cy={scale.y(v)}
            r="2.5"
            class="sig-chart-dot"
            style:fill={color}
          >
            <title>{s.name ? `${s.name}: ` : ''}{labels?.[i] ? `${labels[i]} ` : ''}{v}</title>
          </circle>
        {/each}
      {/if}
    {/each}
  </svg>
  {#if legend && isMulti}
    <figcaption class="sig-chart-legend">
      {#each seriesList as s, si (si)}
        <span class="sig-chart-legend-item">
          <span class="sig-chart-swatch" style:background={s.color ?? PALETTE[si % PALETTE.length]}
          ></span>
          {s.name ?? `Series ${si + 1}`}
        </span>
      {/each}
    </figcaption>
  {/if}
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

  :global(.sig-chart-legend) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-chart-legend-item) {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  :global(.sig-chart-swatch) {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 2px;
  }
</style>
