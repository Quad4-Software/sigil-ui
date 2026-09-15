<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    speed?: number
    direction?: 'left' | 'right'
    pauseOnHover?: boolean
    children?: Snippet
  }

  let {
    speed = 30,
    direction = 'left',
    pauseOnHover = true,
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<div
  class={cn('sig-marquee', className)}
  data-direction={direction}
  data-pause={pauseOnHover ? '' : undefined}
  style:--sig-marquee-duration={`${speed}s`}
  {...rest}
>
  <div class="sig-marquee-track">
    <div class="sig-marquee-group">{@render children?.()}</div>
    <div class="sig-marquee-group" aria-hidden="true">{@render children?.()}</div>
  </div>
</div>

<style>
  :global(.sig-marquee) {
    overflow: hidden;
    --sig-marquee-duration: 30s;
  }

  :global(.sig-marquee-track) {
    display: flex;
    width: max-content;
    animation: sig-marquee var(--sig-marquee-duration) linear infinite;
  }

  :global(.sig-marquee[data-direction='right'] .sig-marquee-track) {
    animation-direction: reverse;
  }

  :global(.sig-marquee[data-pause]:hover .sig-marquee-track) {
    animation-play-state: paused;
  }

  :global(.sig-marquee-group) {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    min-width: 100%;
  }

  @keyframes -global-sig-marquee {
    to {
      transform: translateX(-50%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-marquee-track) {
      animation: none;
    }
  }
</style>
