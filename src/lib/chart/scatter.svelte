<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Point {
    x: number
    y: number
    label?: string
    color?: string
  }

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    data: Point[]
    label?: string
    height?: number
    dots?: boolean
  }

  let { data, label = 'Scatter plot', height = 180, class: className, ...rest }: Props = $props()

  const W = 320
  const H = 180
  const PAD = 12

  const bounds = $derived.by(() => {
    const xs = data.map((d) => d.x)
    const ys = data.map((d) => d.y)
    return {
      minX: Math.min(...xs, 0),
      maxX: Math.max(...xs, 1),
      minY: Math.min(...ys, 0),
      maxY: Math.max(...ys, 1)
    }
  })

  function px(x: number) {
    const span = bounds.maxX - bounds.minX || 1
    return PAD + ((x - bounds.minX) / span) * (W - PAD * 2)
  }

  function py(y: number) {
    const span = bounds.maxY - bounds.minY || 1
    return H - PAD - ((y - bounds.minY) / span) * (H - PAD * 2)
  }
</script>

<figure class={cn('sig-scatter', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox="0 0 {W} {H}" width="100%" {height}>
    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} class="sig-scatter-axis" />
    <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} class="sig-scatter-axis" />
    {#each data as d, i (i)}
      <circle
        cx={px(d.x)}
        cy={py(d.y)}
        r="4"
        fill={d.color ?? 'var(--sig-chart-1, var(--sig-accent, #4f46e5))'}
        class="sig-scatter-dot"
      >
        <title>{d.label ?? `${d.x}, ${d.y}`}</title>
      </circle>
    {/each}
  </svg>
</figure>

<style>
  :global(.sig-scatter) {
    margin: 0;
  }

  :global(.sig-scatter svg) {
    display: block;
  }

  :global(.sig-scatter-axis) {
    stroke: var(--sig-border, #d4d4d8);
  }

  :global(.sig-scatter-dot) {
    fill-opacity: 0.8;
  }

  :global(.sig-scatter-dot:hover) {
    fill-opacity: 1;
    stroke: var(--sig-fg, #18181b);
  }
</style>
