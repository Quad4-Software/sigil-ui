<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
    text: string
    side?: 'top' | 'bottom'
    children?: Snippet<[{ props: Record<string, string> }]>
  }

  let { text, side = 'top', class: className, children, ...rest }: Props = $props()
  const id = $props.id()
</script>

<span class={cn('sig-tip-wrap', className)} {...rest}>
  {@render children?.({ props: { 'aria-describedby': id } })}
  <span {id} role="tooltip" data-side={side} class="sig-tip">{text}</span>
</span>

<style>
  :global(.sig-tip-wrap) {
    position: relative;
    display: inline-flex;
  }

  :global(.sig-tip) {
    position: absolute;
    left: 50%;
    bottom: calc(100% + 0.375rem);
    transform: translateX(-50%);
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
    line-height: 1.4;
    white-space: nowrap;
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-fg, #18181b);
    color: var(--sig-bg, #fff);
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 120ms 150ms,
      visibility 0s 270ms;
    pointer-events: none;
    z-index: 60;
  }

  :global(.sig-tip[data-side='bottom']) {
    bottom: auto;
    top: calc(100% + 0.375rem);
  }

  :global(.sig-tip-wrap:hover .sig-tip),
  :global(.sig-tip-wrap:focus-within .sig-tip) {
    opacity: 1;
    visibility: visible;
    transition-delay: 150ms;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-tip) {
      transition: none;
    }
  }
</style>
