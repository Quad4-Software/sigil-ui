<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { watchLevel } from '../utils/analyser.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Level 0-1. Ignored while live is set. */
    value?: number
    /** Live source: a MediaStream (mic) or an AnalyserNode. */
    live?: MediaStream | AnalyserNode
    segments?: number
    orientation?: 'horizontal' | 'vertical'
    size?: 'sm' | 'md' | 'lg'
    label?: string
  }

  let {
    value = 0,
    live,
    segments = 20,
    orientation = 'horizontal',
    size = 'md',
    label = 'Audio level',
    class: className,
    ...rest
  }: Props = $props()

  let liveLevel = $state(0)

  $effect(() => {
    if (!live) return
    return watchLevel(live, 1, (bars) => (liveLevel = bars[0] ?? 0))
  })

  const level = $derived(live ? liveLevel : Math.min(1, Math.max(0, value)))
  const lit = $derived(Math.round(level * segments))

  function zone(i: number) {
    const f = i / segments
    return f >= 0.85 ? 'peak' : f >= 0.6 ? 'warn' : 'safe'
  }
</script>

<div
  class={cn('sig-meter', className)}
  role="meter"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(level * 100)}
  data-orientation={orientation}
  data-size={size}
  {...rest}
>
  {#each Array.from({ length: segments }, (_, i) => i) as i (i)}
    <i class="sig-meter-seg" data-zone={zone(i)} data-on={i < lit || undefined}></i>
  {/each}
</div>

<style>
  :global(.sig-meter) {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 1.25rem;
  }

  :global(.sig-meter[data-size='sm']) {
    height: 0.875rem;
    gap: 1.5px;
  }

  :global(.sig-meter[data-size='lg']) {
    height: 2rem;
    gap: 3px;
  }

  :global(.sig-meter[data-orientation='vertical']) {
    flex-direction: column-reverse;
    align-items: stretch;
    height: 6rem;
    width: 1.25rem;
  }

  :global(.sig-meter-seg) {
    flex: 1;
    min-width: 2px;
    border-radius: 1px;
    background: var(--sig-border, #d4d4d8);
    transition: background-color 80ms ease-out;
  }

  :global(.sig-meter-seg[data-on][data-zone='safe']) {
    background: var(--sig-accent, #4f46e5);
  }

  :global(.sig-meter-seg[data-on][data-zone='warn']) {
    background: var(--sig-warning, #b45309);
  }

  :global(.sig-meter-seg[data-on][data-zone='peak']) {
    background: var(--sig-danger, #dc2626);
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-meter-seg) {
      transition: none;
    }
  }
</style>
