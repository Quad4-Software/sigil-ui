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

  let { data, label = 'Bar chart', height = 180, class: className, ...rest }: Props = $props()

  const W = 400
  const H = 160
  const PAD = 8

  const max = $derived(Math.max(...data.map((d) => d.value), 1))
  const barW = $derived((W - PAD * 2) / Math.max(data.length, 1))
</script>

<figure class={cn('sig-chart', 'sig-bars', className)} role="img" aria-label={label} {...rest}>
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" {height} preserveAspectRatio="none">
    <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} class="sig-chart-axis" />
    {#each data as d, i (i)}
      <rect
        x={PAD + i * barW + barW * 0.15}
        y={H - PAD - (d.value / max) * (H - PAD * 2)}
        width={barW * 0.7}
        height={(d.value / max) * (H - PAD * 2)}
        rx="2"
        class="sig-chart-bar"
      >
        <title>{d.label}: {d.value}</title>
      </rect>
    {/each}
  </svg>
  <figcaption class="sig-chart-ticks">
    {#each data as d (d.label)}
      <span>{d.label}</span>
    {/each}
  </figcaption>
</figure>

<style>
  :global(.sig-chart-bar) {
    fill: var(--sig-chart-1, var(--sig-accent, #4f46e5));
    transition: opacity 120ms ease;
  }

  :global(.sig-chart-bar:hover) {
    opacity: 0.75;
  }
</style>
