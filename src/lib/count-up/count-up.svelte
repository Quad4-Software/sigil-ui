<script lang="ts">
  import { untrack } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    value: number
    duration?: number
    decimals?: number
    format?: ((n: number) => string) | undefined
  }

  let { value, duration = 800, decimals = 0, format, class: className, ...rest }: Props = $props()

  let display = $state(untrack(() => value))
  let from = untrack(() => value)
  let raf = 0

  const reduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  $effect(() => {
    const target = value
    const start = from
    if (reduced() || duration <= 0 || start === target) {
      display = target
      from = target
      return
    }
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      display = start + (target - start) * eased
      if (t < 1) raf = requestAnimationFrame(tick)
      else from = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  })

  const text = $derived(format ? format(display) : display.toFixed(decimals))
</script>

<span class={cn('sig-countup', className)} {...rest}>{text}</span>
