<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    ratio?: number
    children?: Snippet
  }

  let { ratio = 16 / 9, class: className, children, style, ...rest }: Props = $props()
</script>

<div
  class={cn('sig-aspect-ratio', className)}
  style="aspect-ratio: {ratio};{style ? ` ${style}` : ''}"
  {...rest}
>
  {@render children?.()}
</div>

<style>
  :global(.sig-aspect-ratio) {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-aspect-ratio > *) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
