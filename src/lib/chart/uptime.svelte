<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface UptimeSample {
    ms?: number
    status?: 'up' | 'warn' | 'down'
    label?: string
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    // latencies in ms, or samples with explicit status. ms <= 0 is down
    data: (number | UptimeSample)[]
    // ms threshold above which a sample renders warn
    warnAt?: number
    label?: string
    height?: number
    // show the uptime percentage and average latency summary
    summary?: boolean
  }

  let {
    data,
    warnAt,
    label = 'Latency over time',
    height = 40,
    summary = false,
    class: className,
    ...rest
  }: Props = $props()

  function statusOf(s: UptimeSample): 'up' | 'warn' | 'down' {
    if (s.status) return s.status
    const ms = s.ms ?? 0
    if (ms <= 0) return 'down'
    if (warnAt !== undefined && ms > warnAt) return 'warn'
    return 'up'
  }

  const samples = $derived(
    data.map((d) => {
      const s: UptimeSample = typeof d === 'number' ? { ms: d } : d
      return { ...s, status: statusOf(s) }
    })
  )
  const peak = $derived(Math.max(1, ...samples.map((s) => s.ms ?? 0)))
  const up = $derived(samples.filter((s) => s.status !== 'down').length)
  const pct = $derived(samples.length ? Math.round((up / samples.length) * 1000) / 10 : 0)
  const avg = $derived(
    samples.length ? Math.round(samples.reduce((n, s) => n + (s.ms ?? 0), 0) / samples.length) : 0
  )
</script>

<figure class={cn('sig-uptime', className)} role="img" aria-label={label} {...rest}>
  {#if summary}
    <div class="sig-uptime-summary" aria-hidden="true">
      <span class="sig-uptime-pct" data-status={pct === 100 ? 'up' : pct >= 90 ? 'warn' : 'down'}
        >{pct}%</span
      >
      <span class="sig-uptime-avg">{avg} ms avg</span>
    </div>
  {/if}
  <div class="sig-uptime-bars" style:height="{height}px" aria-hidden="true">
    {#each samples as s, i (i)}
      <span
        class="sig-uptime-bar"
        data-status={s.status}
        style:height="{Math.max(8, Math.round(((s.ms ?? 0) / peak) * 100))}%"
        title={s.label ?? (s.status === 'down' ? 'down' : `${s.ms ?? 0} ms`)}
      ></span>
    {/each}
  </div>
</figure>

<style>
  :global(.sig-uptime) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  :global(.sig-uptime-bars) {
    display: flex;
    align-items: flex-end;
    gap: 3px;
  }
  :global(.sig-uptime-bar) {
    flex: 1;
    min-width: 3px;
    border-radius: var(--sig-radius-full, 9999px);
    background: var(--sig-success, #16a34a);
    transition:
      transform 120ms ease,
      height 500ms ease;
  }
  :global(.sig-uptime-bar:hover) {
    transform: scaleY(1.06);
  }
  :global(.sig-uptime-bar[data-status='warn']) {
    background: var(--sig-warning, #d97706);
  }
  :global(.sig-uptime-bar[data-status='down']) {
    background: var(--sig-danger, #dc2626);
  }
  :global(.sig-uptime-summary) {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: var(--sig-font-xs, 0.75rem);
    color: var(--sig-muted, #71717a);
  }
  :global(.sig-uptime-pct) {
    font-weight: 600;
    color: var(--sig-success, #16a34a);
  }
  :global(.sig-uptime-pct[data-status='warn']) {
    color: var(--sig-warning, #d97706);
  }
  :global(.sig-uptime-pct[data-status='down']) {
    color: var(--sig-danger, #dc2626);
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.sig-uptime-bar) {
      transition: none;
    }
  }
</style>
