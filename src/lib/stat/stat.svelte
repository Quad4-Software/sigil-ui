<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string
    value: string | number
    delta?: number
    deltaLabel?: string
    children?: Snippet
  }

  let {
    label,
    value,
    delta,
    deltaLabel = '',
    class: className,
    children,
    ...rest
  }: Props = $props()

  const dir = $derived(
    delta === undefined ? null : delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down'
  )
</script>

<div class={cn('sig-stat', className)} {...rest}>
  <span class="sig-stat-label">{label}</span>
  <span class="sig-stat-value">{value}</span>
  {#if delta !== undefined}
    <span class="sig-stat-delta" data-dir={dir}>
      {delta > 0 ? '+' : ''}{delta}{deltaLabel ? ` ${deltaLabel}` : ''}
    </span>
  {/if}
  {@render children?.()}
</div>

<style>
  :global(.sig-stat) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  :global(.sig-stat-label) {
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-stat-value) {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-stat-delta) {
    font-size: 0.8125rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  :global(.sig-stat-delta[data-dir='up']) {
    color: var(--sig-success, #16a34a);
  }

  :global(.sig-stat-delta[data-dir='down']) {
    color: var(--sig-danger, #dc2626);
  }

  :global(.sig-stat-delta[data-dir='flat']) {
    color: var(--sig-muted, #71717a);
  }
</style>
