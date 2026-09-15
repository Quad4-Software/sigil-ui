<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setPopover } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  }

  let {
    open = $bindable(false),
    onOpenChange,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const id = $props.id()
  let trigger: HTMLElement | undefined = $state()
  let content: HTMLElement | undefined = $state()
  let root: HTMLElement | undefined = $state()

  setPopover({
    get open() {
      return open
    },
    set open(next: boolean) {
      if (next === open) return
      open = next
      onOpenChange?.(next)
    },
    id: `sig-popover-${id}`,
    trigger: () => trigger,
    content: () => content,
    setTrigger: (el) => (trigger = el),
    setContent: (el) => (content = el)
  })

  // Outside click and Escape live on document while open so the popover
  // behaves like a floating layer without a primitive dependency.
  $effect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && root && !root.contains(target)) {
        open = false
        onOpenChange?.(false)
      }
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      open = false
      onOpenChange?.(false)
      if (trigger && content?.contains(document.activeElement)) trigger.focus()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeydown)
    }
  })
</script>

<div bind:this={root} class={cn('sig-pop-wrap', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-pop-wrap) {
    position: relative;
    display: inline-flex;
  }
</style>
