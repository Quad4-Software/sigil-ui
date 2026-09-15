<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    data: number[]
    labels?: string[] | undefined
    label?: string
    height?: number
  }

  let {
    data,
    labels,
    label = 'Area chart',
    height = 180,
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
    return { x, y }
  })

  // Catmull-Rom to cubic bezier for a smooth curve through every point.
  const path = $derived.by(() => {
    if (!data.length) return ''
    const p = data.map((v, i) => ({ x: scale.x(i), y: scale.y(v) }))
    const first = p[0]
    if (!first) return ''
    if (p.length === 1) return `M${first.x},${first.y}`
    let d = `M${first.x.toFixed(2)},${first.y.toFixed(2)}`
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[Math.max(i - 1, 0)] ?? first
      const p1 = p[i] ?? first
      const p2 = p[i + 1] ?? first
      const p3 = p[Math.min(i + 2, p.length - 1)] ?? first
      const c1x = p1.x + (p2.x - p0.x) / 6
      const c1y = p1.y + (p2.y - p0.y) / 6
      const c2x = p2.x - (p3.x - p1.x) / 6
      const c2y = p2.y - (p3.y - p1.y) / 6
      d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
    }
    return d
  })

  const areaPath = $derived(
    path ? `${path} L${scale.x(data.length - 1)},${H - PAD} L${scale.x(0)},${H - PAD} Z` : ''
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
    <path d={areaPath} class="sig-chart-area sig-chart-area-strong" />
    <path d={path} class="sig-chart-line" />
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
  :global(.sig-chart-area-strong) {
    opacity: 0.25;
  }
</style>
