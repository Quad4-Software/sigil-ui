<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Series {
    name?: string
    values: number[]
    color?: string
  }

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    labels: string[]
    data: number[] | Series[]
    max?: number
    label?: string
    size?: number
    rings?: number
  }

  const PALETTE = [
    'var(--sig-accent, #4f46e5)',
    'var(--sig-success, #16a34a)',
    'var(--sig-warning, #d97706)',
    'var(--sig-info, #0284c7)'
  ]

  let {
    labels,
    data,
    max,
    label = 'Radar chart',
    size = 220,
    rings = 4,
    class: className,
    ...rest
  }: Props = $props()

  const series = $derived.by<Series[]>(() => {
    if (data.length > 0 && typeof data[0] === 'number') return [{ values: data as number[] }]
    return data as Series[]
  })

  const ceiling = $derived(max ?? Math.max(1, ...series.flatMap((s) => s.values)))

  const cx = 110
  const cy = 110
  const radius = 78
  const axes = $derived(labels.length)

  function point(axis: number, frac: number): [number, number] {
    const angle = (Math.PI * 2 * axis) / axes - Math.PI / 2
    return [cx + Math.cos(angle) * radius * frac, cy + Math.sin(angle) * radius * frac]
  }

  function ringPath(frac: number) {
    return labels.map((_, i) => point(i, frac).join(',')).join(' ')
  }

  function seriesPath(values: number[]) {
    return labels
      .map((_, i) => point(i, Math.min(1, (values[i] ?? 0) / ceiling)).join(','))
      .join(' ')
  }
</script>

<figure class={cn('sig-radar', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox="0 0 220 220" width={size} height={size}>
    {#each Array.from({ length: rings }, (_, i) => (i + 1) / rings) as frac (frac)}
      <polygon points={ringPath(frac)} class="sig-radar-ring" />
    {/each}
    {#each labels as text, i (i)}
      {@const [x, y] = point(i, 1)}
      <line x1={cx} y1={cy} x2={x} y2={y} class="sig-radar-spoke" />
      {@const [lx, ly] = point(i, 1.18)}
      <text
        x={lx}
        y={ly}
        text-anchor={Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'}
        dominant-baseline="middle"
        class="sig-radar-label">{text}</text
      >
    {/each}
    {#each series as s, si (si)}
      {@const color = s.color ?? PALETTE[si % PALETTE.length]}
      <polygon points={seriesPath(s.values)} fill={color} class="sig-radar-area">
        <title>{s.name ?? `Series ${si + 1}`}</title>
      </polygon>
      <polygon points={seriesPath(s.values)} fill="none" stroke={color} class="sig-radar-line" />
    {/each}
  </svg>
</figure>

<style>
  :global(.sig-radar) {
    margin: 0;
    display: inline-block;
  }

  :global(.sig-radar-ring) {
    fill: none;
    stroke: var(--sig-border, #d4d4d8);
    stroke-dasharray: 3 3;
  }

  :global(.sig-radar-spoke) {
    stroke: var(--sig-border, #d4d4d8);
  }

  :global(.sig-radar-label) {
    font-size: 10px;
    fill: var(--sig-muted, #71717a);
  }

  :global(.sig-radar-area) {
    fill-opacity: 0.15;
  }

  :global(.sig-radar-line) {
    stroke-width: 2;
    stroke-linejoin: round;
  }
</style>
