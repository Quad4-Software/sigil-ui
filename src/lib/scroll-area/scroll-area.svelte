<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'vertical' | 'horizontal' | 'both'
    children?: Snippet
  }

  let { orientation = 'vertical', class: className, children, ...rest }: Props = $props()
</script>

<div data-orientation={orientation} class={cn('sig-scroll-area', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-scroll-area) {
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: var(--sig-border, #d4d4d8) transparent;
  }

  :global(.sig-scroll-area[data-orientation='vertical']) {
    overflow-x: hidden;
  }

  :global(.sig-scroll-area[data-orientation='horizontal']) {
    overflow-y: hidden;
  }

  :global(.sig-scroll-area::-webkit-scrollbar) {
    width: 0.5rem;
    height: 0.5rem;
  }

  :global(.sig-scroll-area::-webkit-scrollbar-thumb) {
    background: var(--sig-border, #d4d4d8);
    border-radius: 999px;
  }

  :global(.sig-scroll-area::-webkit-scrollbar-thumb:hover) {
    background: var(--sig-muted, #71717a);
  }

  :global(.sig-scroll-area::-webkit-scrollbar-track) {
    background: transparent;
  }
</style>
