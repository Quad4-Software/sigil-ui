<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { tagOverflows, type OverflowIssue } from '../utils/inspect.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Grid cell size in px. */
    size?: number
    /** Also outline elements that overflow their box. */
    overflow?: boolean
    /** Re-scan overflows this often in ms. 0 scans once on mount. */
    interval?: number
    /** Called after each overflow scan. */
    onScan?: (issues: OverflowIssue[]) => void
  }

  let {
    size = 8,
    overflow = false,
    interval = 0,
    onScan,
    class: className,
    ...rest
  }: Props = $props()
</script>

<div
  aria-hidden="true"
  data-sig-inspect-ignore
  data-overflow={overflow ? '' : undefined}
  class={cn('sig-grid-overlay', className)}
  style:--sig-grid-size="{size}px"
  {...rest}
  {@attach () => {
    if (!overflow) return
    let tagged = tagOverflows()
    onScan?.(tagged.issues)
    if (!interval) return tagged.clear
    const id = setInterval(() => {
      tagged.clear()
      tagged = tagOverflows()
      onScan?.(tagged.issues)
    }, interval)
    const onResize = () => {
      tagged.clear()
      tagged = tagOverflows()
      onScan?.(tagged.issues)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearInterval(id)
      window.removeEventListener('resize', onResize)
      tagged.clear()
    }
  }}
></div>

<style>
  :global(.sig-grid-overlay) {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background-image:
      linear-gradient(to right, rgb(37 99 235 / 0.12) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(37 99 235 / 0.12) 1px, transparent 1px);
    background-size: var(--sig-grid-size, 8px) var(--sig-grid-size, 8px);
  }

  :global([data-sig-overflow]) {
    outline: 2px solid var(--sig-danger, #dc2626) !important;
    outline-offset: 1px;
  }
</style>
