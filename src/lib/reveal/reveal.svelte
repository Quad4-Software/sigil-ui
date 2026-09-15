<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    once?: boolean
    delay?: number
    threshold?: number
    children?: Snippet
  }

  let {
    once = true,
    delay = 0,
    threshold = 0.15,
    class: className,
    children,
    ...rest
  }: Props = $props()

  let visible = $state(false)

  function observe(el: HTMLElement) {
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      visible = true
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible = true
            if (once) io.disconnect()
          } else if (!once) {
            visible = false
          }
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }
</script>

<div
  class={cn('sig-reveal', className)}
  data-visible={visible || undefined}
  style:transition-delay={`${delay}ms`}
  {@attach observe}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  :global(.sig-reveal) {
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 400ms ease,
      transform 400ms ease;
  }

  :global(.sig-reveal[data-visible]) {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-reveal) {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>
