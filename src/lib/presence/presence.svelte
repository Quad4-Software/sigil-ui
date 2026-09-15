<script lang="ts">
  import { untrack, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    show: boolean
    duration?: number
    children?: Snippet
  }

  let { show, duration = 200, class: className, children, ...rest }: Props = $props()

  let rendered = $state(untrack(() => show))
  let exiting = $state(false)

  $effect(() => {
    if (show) {
      if (!rendered) rendered = true
      if (untrack(() => exiting)) exiting = false
      return
    }
    if (rendered && !untrack(() => exiting)) {
      exiting = true
      const ms = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration
      const t = setTimeout(() => {
        rendered = false
        exiting = false
      }, ms)
      return () => clearTimeout(t)
    }
  })
</script>

{#if rendered}
  <div
    class={cn('sig-presence', className)}
    data-state={exiting ? 'exit' : 'enter'}
    style:animation-duration={`${duration}ms`}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-presence) {
    animation: sig-presence-in ease both;
  }

  :global(.sig-presence[data-state='exit']) {
    animation-name: sig-presence-out;
  }

  @keyframes -global-sig-presence-in {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes -global-sig-presence-out {
    from {
      opacity: 1;
      transform: none;
    }
    to {
      opacity: 0;
      transform: translateY(6px) scale(0.98);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-presence) {
      animation: none;
    }
  }
</style>
