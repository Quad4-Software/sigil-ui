<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getPaneGroupContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    defaultSize?: number
    minSize?: number
    maxSize?: number
    children?: Snippet
  }

  let {
    defaultSize,
    minSize = 0,
    maxSize = 100,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const ctx = getPaneGroupContext()
  const spec = ctx.registerPane({
    get defaultSize() {
      return defaultSize
    },
    get minSize() {
      return minSize
    },
    get maxSize() {
      return maxSize
    }
  })
  onDestroy(() => ctx.unregisterPane(spec))

  const index = $derived(ctx.panes.indexOf(spec))
  const size = $derived(ctx.sizes[index] ?? defaultSize ?? 100)
</script>

<div class={cn('sig-pane', className)} style:flex-grow={size} data-index={index} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-pane) {
    flex-shrink: 1;
    flex-basis: 0%;
    min-width: 0;
    min-height: 0;
    overflow: auto;
  }
</style>
