<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical'
    decorative?: boolean
  }

  let { orientation = 'horizontal', decorative = true, class: className, ...rest }: Props = $props()
</script>

<div
  role={decorative ? 'none' : 'separator'}
  aria-orientation={decorative ? undefined : orientation}
  data-orientation={orientation}
  class={cn('sig-separator', className)}
  {...rest}
></div>

<style>
  :global(.sig-separator) {
    background: var(--sig-border, #d4d4d8);
    flex-shrink: 0;
  }

  :global(.sig-separator[data-orientation='horizontal']) {
    height: 1px;
    width: 100%;
  }

  :global(.sig-separator[data-orientation='vertical']) {
    width: 1px;
    height: 100%;
  }
</style>
