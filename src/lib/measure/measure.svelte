<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** Show the live pixel readout badge. */
    badge?: boolean
    /** Round the reported size. */
    decimals?: number
    children?: Snippet<[{ width: number; height: number }]>
  }

  let { badge = true, decimals = 0, class: className, children, ...rest }: Props = $props()

  let el: HTMLElement | undefined = $state()
  let width = $state(0)
  let height = $state(0)

  $effect(() => {
    if (!el) return
    const node = el
    const update = () => {
      const rect = node.getBoundingClientRect()
      width = rect.width
      height = rect.height
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  })

  const text = $derived(`${width.toFixed(decimals)} x ${height.toFixed(decimals)}`)
</script>

<div bind:this={el} class={cn('sig-measure', className)} {...rest}>
  {@render children?.({ width, height })}
  {#if badge}
    <span class="sig-measure-badge" data-sig-inspect-ignore aria-hidden="true">{text}px</span>
  {/if}
</div>

<style>
  :global(.sig-measure) {
    position: relative;
    display: flow-root;
    outline: 1px dashed var(--sig-info, #2563eb);
    outline-offset: -1px;
  }

  :global(.sig-measure .sig-measure-badge) {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-100%);
    padding: 0 0.375rem;
    border-radius: 0.25rem 0.25rem 0 0;
    background: var(--sig-info, #2563eb);
    color: var(--sig-info-fg, #fff);
    font-family: ui-monospace, monospace;
    font-size: 0.625rem;
    line-height: 1.6;
    white-space: nowrap;
    pointer-events: none;
  }
</style>
