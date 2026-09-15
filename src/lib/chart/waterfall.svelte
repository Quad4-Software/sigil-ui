<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Datum {
    label: string
    value: number
    /** Render as a running-total column instead of a delta. */
    total?: boolean
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    data: Datum[]
    label?: string
    height?: number
  }

  let { data, label = 'Waterfall chart', height = 180, class: className, ...rest }: Props = $props()

  const W = 400
  const H = 160
  const PAD = 8

  interface Col {
    label: string
    from: number
    to: number
    kind: 'up' | 'down' | 'total'
  }

  const cols = $derived.by(() => {
    let run = 0
    return data.map((d): Col => {
      if (d.total) {
        const to = d.value !== 0 ? d.value : run
        run = to
        return { label: d.label, from: 0, to, kind: 'total' }
      }
      const from = run
      run += d.value
      return { label: d.label, from, to: run, kind: d.value >= 0 ? 'up' : 'down' }
    })
  })

  const lo = $derived(Math.min(0, ...cols.flatMap((c) => [c.from, c.to])))
  const hi = $derived(Math.max(1, ...cols.flatMap((c) => [c.from, c.to])))
  const y = $derived((v: number) => H - PAD - ((v - lo) / (hi - lo)) * (H - PAD * 2))
  const barW = $derived((W - PAD * 2) / Math.max(cols.length, 1))
  const zeroY = $derived(y(0))
</script>

<figure class={cn('sig-chart', 'sig-waterfall', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" {height} preserveAspectRatio="none">
    <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} class="sig-chart-axis" />
    {#each cols as c, i (i)}
      {@const top = Math.min(y(c.from), y(c.to))}
      {@const h = Math.max(Math.abs(y(c.from) - y(c.to)), 2)}
      {#if i > 0}
        {@const lvl = y(c.kind === 'total' ? c.to : c.from)}
        <line
          x1={PAD + i * barW - barW * 0.15}
          y1={lvl}
          x2={PAD + i * barW + barW * 0.15}
          y2={lvl}
          class="sig-waterfall-link"
        />
      {/if}
      <rect
        x={PAD + i * barW + barW * 0.15}
        y={top}
        width={barW * 0.7}
        height={h}
        rx="2"
        class="sig-waterfall-bar"
        data-kind={c.kind}
      >
        <title>{c.label}: {c.kind === 'total' ? c.to : c.to - c.from}</title>
      </rect>
    {/each}
  </svg>
  <figcaption class="sig-chart-ticks">
    {#each cols as c (c.label)}
      <span>{c.label}</span>
    {/each}
  </figcaption>
</figure>

<style>
  :global(.sig-waterfall-bar) {
    transition: opacity 120ms ease;
  }

  :global(.sig-waterfall-bar:hover) {
    opacity: 0.75;
  }

  :global(.sig-waterfall-bar[data-kind='up']) {
    fill: var(--sig-chart-3, var(--sig-success, #16a34a));
  }

  :global(.sig-waterfall-bar[data-kind='down']) {
    fill: var(--sig-chart-5, var(--sig-danger, #dc2626));
  }

  :global(.sig-waterfall-bar[data-kind='total']) {
    fill: var(--sig-chart-1, var(--sig-accent, #4f46e5));
  }

  :global(.sig-waterfall-link) {
    stroke: var(--sig-border, #d4d4d8);
    stroke-dasharray: 3 3;
  }
</style>
