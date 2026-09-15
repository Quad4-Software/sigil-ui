<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Text received so far. Append to it as tokens arrive. */
    text?: string
    /** While true the reveal animates and a caret is shown. */
    streaming?: boolean
    /** Reveal rate in characters per second. */
    speed?: number
    /** Called once when the reveal catches up after streaming ends. */
    oncomplete?: () => void
  }

  let {
    text = '',
    streaming = false,
    speed = 360,
    oncomplete,
    class: className,
    ...rest
  }: Props = $props()

  let shown = $state(0)
  let done = $state(false)

  const reduced =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  $effect(() => {
    const target = text
    if (!streaming || reduced) {
      shown = target.length
      return
    }
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      shown = Math.min(target.length, shown + ((now - last) / 1000) * speed)
      last = now
      if (shown < target.length) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  })

  $effect(() => {
    if (!streaming && shown >= text.length && text.length > 0 && !done) {
      done = true
      oncomplete?.()
    }
    if (streaming) done = false
  })
</script>

<span class={cn('sig-stream', className)} data-streaming={streaming || undefined} {...rest}
  >{text.slice(0, Math.floor(shown))}{#if streaming}<i class="sig-stream-caret" aria-hidden="true"
    ></i>{/if}</span
>

<style>
  :global(.sig-stream) {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }

  :global(.sig-stream-caret) {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    margin-left: 1px;
    vertical-align: -0.125em;
    border-radius: 1px;
    background: currentColor;
    animation: sig-stream-blink 1s steps(2, start) infinite;
  }

  @keyframes sig-stream-blink {
    to {
      visibility: hidden;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-stream-caret) {
      animation: none;
    }
  }
</style>
