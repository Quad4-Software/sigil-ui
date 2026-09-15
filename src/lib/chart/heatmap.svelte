<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    data: number[][]
    xLabels?: string[]
    yLabels?: string[]
    label?: string
    cell?: number
    gap?: number
  }

  let {
    data,
    xLabels,
    yLabels,
    label = 'Heatmap',
    cell = 14,
    gap = 3,
    class: className,
    ...rest
  }: Props = $props()

  const cols = $derived(data.reduce((n, row) => Math.max(n, row.length), 0))
  const max = $derived(data.reduce((m, row) => Math.max(m, ...row, 0), 0) || 1)
  const labelW = $derived(yLabels?.length ? 56 : 0)
  const labelH = $derived(xLabels?.length ? 18 : 0)
  const width = $derived(labelW + cols * (cell + gap))
  const height = $derived(data.length * (cell + gap) + labelH)

  function color(value: number) {
    const pct = Math.round((value / max) * 100)
    if (value <= 0) return 'var(--sig-surface, #f4f4f5)'
    return `color-mix(in srgb, var(--sig-accent, #4f46e5) ${pct}%, var(--sig-surface, #f4f4f5))`
  }
</script>

<figure class={cn('sig-heatmap', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox="0 0 {width} {height}" width="100%" style="max-width: {width}px">
    {#each data as row, y (y)}
      {#if yLabels}
        <text
          x={labelW - 6}
          y={y * (cell + gap) + cell / 2 + 3}
          text-anchor="end"
          class="sig-heatmap-label">{yLabels[y] ?? ''}</text
        >
      {/if}
      {#each row as value, x (x)}
        <rect
          x={labelW + x * (cell + gap)}
          y={y * (cell + gap)}
          width={cell}
          height={cell}
          rx="2"
          fill={color(value)}
          class="sig-heatmap-cell"
        >
          <title>{xLabels?.[x] ?? x}, {yLabels?.[y] ?? y}: {value}</title>
        </rect>
      {/each}
    {/each}
    {#if xLabels}
      {#each xLabels as text, x (x)}
        <text
          x={labelW + x * (cell + gap) + cell / 2}
          y={height - 5}
          text-anchor="middle"
          class="sig-heatmap-label">{text}</text
        >
      {/each}
    {/if}
  </svg>
</figure>

<style>
  :global(.sig-heatmap) {
    margin: 0;
    display: inline-block;
  }

  :global(.sig-heatmap svg) {
    display: block;
    height: auto;
  }

  :global(.sig-heatmap-label) {
    font-size: 9px;
    fill: var(--sig-muted, #71717a);
  }

  :global(.sig-heatmap-cell) {
    stroke: var(--sig-bg, #fff);
    stroke-width: 1;
  }
</style>
