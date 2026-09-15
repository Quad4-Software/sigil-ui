<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setHoverCard } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    openDelay?: number
    closeDelay?: number
    children?: Snippet
  }

  let {
    open = $bindable(false),
    onOpenChange,
    openDelay = 300,
    closeDelay = 200,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const id = $props.id()
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  function clearTimers() {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
  }

  setHoverCard({
    get open() {
      return open
    },
    set open(next: boolean) {
      setOpen(next)
    },
    id: `sig-hover-${id}`,
    scheduleOpen() {
      clearTimers()
      openTimer = setTimeout(() => setOpen(true), openDelay)
    },
    scheduleClose() {
      clearTimers()
      closeTimer = setTimeout(() => setOpen(false), closeDelay)
    },
    cancelClose() {
      clearTimers()
    }
  })
</script>

<div class={cn('sig-hover-wrap', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-hover-wrap) {
    position: relative;
    display: inline-flex;
  }
</style>
