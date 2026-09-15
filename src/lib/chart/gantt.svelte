<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Datum {
    label: string
    /** Start and end in any unit: ms, minutes, days. min and max bound the axis. */
    start: number
    end: number
    /** Override the bar color, for example var(--sig-chart-2). */
    color?: string
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    data: Datum[]
    /** Axis bounds; default is the data extent. */
    min?: number
    max?: number
    label?: string
    height?: number
  }

  let {
    data,
    min,
    max,
    label = 'Gantt chart',
    height = 160,
    class: className,
    ...rest
  }: Props = $props()

  const W = 400
  const PAD = 4

  const lo = $derived(min ?? Math.min(...data.map((d) => d.start), 0))
  const hi = $derived(max ?? Math.max(...data.map((d) => d.end), 1))
  const span = $derived(Math.max(hi - lo, 1e-9))
  const rowH = $derived(100 / Math.max(data.length, 1))
  const x = $derived((v: number) => PAD + ((v - lo) / span) * (W - PAD * 2))
</script>

<figure class={cn('sig-chart', 'sig-gantt', className)} role="img" aria-label={label} {...rest}>
  <div class="sig-gantt-grid">
    <div class="sig-gantt-labels">
      {#each data as d (d.label)}
        <span class="sig-gantt-label">{d.label}</span>
      {/each}
    </div>
    <svg
      viewBox={`0 0 ${W} 100`}
      width="100%"
      {height}
      preserveAspectRatio="none"
      class="sig-gantt-rows"
    >
      {#each data as d, i (i)}
        <rect
          x={x(d.start)}
          y={i * rowH + rowH * 0.2}
          width={Math.max(x(d.end) - x(d.start), 2)}
          height={rowH * 0.6}
          rx="2"
          class="sig-gantt-bar"
          style={d.color ? `fill: ${d.color}` : undefined}
        >
          <title>{d.label}: {d.start} to {d.end}</title>
        </rect>
      {/each}
    </svg>
  </div>
</figure>

<style>
  :global(.sig-gantt-grid) {
    display: flex;
    gap: 0.75rem;
    align-items: stretch;
  }

  :global(.sig-gantt-labels) {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--sig-muted, #71717a);
    text-align: right;
  }

  :global(.sig-gantt-rows) {
    flex: 1;
    min-width: 0;
    border-left: 1px solid var(--sig-border, #d4d4d8);
    border-bottom: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-gantt-bar) {
    fill: var(--sig-chart-1, var(--sig-accent, #4f46e5));
    transition: opacity 120ms ease;
  }

  :global(.sig-gantt-bar:hover) {
    opacity: 0.75;
  }
</style>
