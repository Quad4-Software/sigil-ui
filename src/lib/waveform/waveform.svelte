<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Amplitudes 0-1 per bar. */
    bars: number[]
    /** Played fraction 0-1. Bars left of it render in the accent color. */
    progress?: number
    /** Animate a subtle amplitude drift while audio is playing. */
    playing?: boolean
    /** Called with the clicked bar fraction 0-1; makes the figure a slider. */
    onseek?: (fraction: number) => void
    label?: string
    height?: number
  }

  let {
    bars,
    progress = 0,
    playing = false,
    onseek,
    label = 'Audio waveform',
    height = 48,
    class: className,
    ...rest
  }: Props = $props()

  const played = $derived(Math.round(progress * bars.length))

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
    data-playing={playing || undefined}
    role="slider"
    tabindex="0"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={Math.round(progress * 100)}
    aria-valuetext="{Math.round(progress * 100)}%"
    style="height: {height}px"
    onclick={seek}
    onkeydown={keys}
    {...rest}
  >
    {#each bars as amp, i (i)}
      <i
        class="sig-waveform-bar"
        data-played={i < played || undefined}
        style="height: {Math.max(8, amp * 100)}%; animation-delay: {(i * 43) % 700}ms"
      ></i>
    {/each}
  </div>
{:else}
  <div
    class={cn('sig-waveform', className)}
    data-playing={playing || undefined}
    role="img"
    aria-label={label}
    style="height: {height}px"
    {...rest}
  >
    {#each bars as amp, i (i)}
      <i
        class="sig-waveform-bar"
        data-played={i < played || undefined}
        style="height: {Math.max(8, amp * 100)}%; animation-delay: {(i * 43) % 700}ms"
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
  }

  :global(.sig-waveform[role='slider']) {
    cursor: pointer;
  }

  :global(.sig-waveform-bar) {
    flex: 1;
    min-width: 2px;
    border-radius: 999px;
    background: var(--sig-border, #d4d4d8);
    transition: background-color 120ms ease;
  }

  :global(.sig-waveform-bar[data-played]) {
    background: var(--sig-accent, #4f46e5);
  }

  :global(.sig-waveform[data-playing] .sig-waveform-bar) {
    animation: sig-waveform-drift 1.4s ease-in-out infinite alternate;
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
