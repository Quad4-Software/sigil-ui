<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { watchLevel } from '../utils/analyser.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Amplitudes 0-1 per bar. Ignored while live is set. */
    bars?: number[]
    /** Live source: a MediaStream (mic) or an AnalyserNode. */
    live?: MediaStream | AnalyserNode
    /** Bars rendered in live mode. */
    barCount?: number
    /** Played fraction 0-1. Bars left of it render in the accent color. */
    progress?: number
    /** Animate a subtle amplitude drift while audio is playing. */
    playing?: boolean
    /** Called with the clicked bar fraction 0-1; makes the figure a slider. */
    onseek?: (fraction: number) => void
    /** bars are centered, flat anchors to the baseline, dots scale fixed dots. */
    variant?: 'bars' | 'flat' | 'dots'
    /** Preset height and bar spacing. height overrides it. */
    size?: 'sm' | 'md' | 'lg'
    label?: string
    height?: number
  }

  let {
    bars = [],
    live,
    barCount = 48,
    progress = 0,
    playing = false,
    onseek,
    variant = 'bars',
    size = 'md',
    label = 'Audio waveform',
    height,
    class: className,
    ...rest
  }: Props = $props()

  let liveBars = $state<number[]>([])

  $effect(() => {
    if (!live) return
    return watchLevel(live, barCount, (out) => (liveBars = out))
  })

  const shown = $derived(live ? liveBars : bars)
  const played = $derived(Math.round(progress * shown.length))

  const seek = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    const r = el.getBoundingClientRect()
    onseek?.(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
  }

  const keys = (e: KeyboardEvent) => {
    if (!onseek) return
    const step = e.shiftKey ? 0.1 : 0.02
    if (e.key === 'ArrowRight') onseek(Math.min(1, progress + step))
    else if (e.key === 'ArrowLeft') onseek(Math.max(0, progress - step))
    else if (e.key === 'Home') onseek(0)
    else if (e.key === 'End') onseek(1)
    else return
    e.preventDefault()
  }
</script>

{#if onseek}
  <div
    class={cn('sig-waveform', className)}
    data-playing={playing || live ? '' : undefined}
    data-variant={variant}
    data-size={size}
    role="slider"
    tabindex="0"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(progress * 100)}
    aria-valuetext="{Math.round(progress * 100)}%"
    style:height={height ? `${height}px` : undefined}
    onclick={seek}
    onkeydown={keys}
    {...rest}
  >
    {#each shown as amp, i (i)}
      <i
        class="sig-waveform-bar"
        data-played={i < played || undefined}
        style="--amp: {amp}; {variant === 'dots'
          ? ''
          : `height: ${Math.max(8, amp * 100)}%;`} animation-delay: {(i * 43) % 700}ms"
      ></i>
    {/each}
  </div>
{:else}
  <div
    class={cn('sig-waveform', className)}
    data-playing={playing || live ? '' : undefined}
    data-variant={variant}
    data-size={size}
    role="img"
    aria-label={label}
    style:height={height ? `${height}px` : undefined}
    {...rest}
  >
    {#each shown as amp, i (i)}
      <i
        class="sig-waveform-bar"
        data-played={i < played || undefined}
        style="--amp: {amp}; {variant === 'dots'
          ? ''
          : `height: ${Math.max(8, amp * 100)}%;`} animation-delay: {(i * 43) % 700}ms"
      ></i>
    {/each}
  </div>
{/if}

<style>
  :global(.sig-waveform) {
    display: flex;
    align-items: center;
    gap: 2px;
    width: 100%;
    height: 3rem;
  }

  :global(.sig-waveform[data-size='sm']) {
    height: 1.5rem;
    gap: 1.5px;
  }

  :global(.sig-waveform[data-size='lg']) {
    height: 4.5rem;
    gap: 3px;
  }

  :global(.sig-waveform[data-variant='flat']) {
    align-items: flex-end;
  }

  :global(.sig-waveform[data-variant='dots']) {
    justify-content: space-between;
  }

  :global(.sig-waveform[data-variant='dots'] .sig-waveform-bar) {
    flex: none;
    width: 0.375rem;
    height: 0.375rem;
    transform: scale(calc(0.35 + var(--amp, 0) * 0.65));
    transition:
      background-color 120ms ease,
      transform 80ms ease-out;
  }

  :global(.sig-waveform[data-size='sm'][data-variant='dots'] .sig-waveform-bar) {
    width: 0.25rem;
    height: 0.25rem;
  }

  :global(.sig-waveform[role='slider']) {
    cursor: pointer;
  }

  :global(.sig-waveform-bar) {
    flex: 1;
    min-width: 2px;
    border-radius: 999px;
    background: var(--sig-border, #d4d4d8);
    transition:
      background-color 120ms ease,
      height 80ms ease-out;
  }

  :global(.sig-waveform-bar[data-played]) {
    background: var(--sig-accent, #4f46e5);
  }

  :global(.sig-waveform[data-playing]:not([data-variant='dots']) .sig-waveform-bar) {
    animation: sig-waveform-drift 1.4s ease-in-out infinite alternate;
  }

  :global(.sig-waveform[data-variant='dots'][data-playing] .sig-waveform-bar) {
    animation: sig-waveform-dot 1.4s ease-in-out infinite alternate;
  }

  @keyframes sig-waveform-dot {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes sig-waveform-drift {
    from {
      transform: scaleY(0.92);
    }
    to {
      transform: scaleY(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-waveform[data-playing] .sig-waveform-bar) {
      animation: none;
    }
  }
</style>
