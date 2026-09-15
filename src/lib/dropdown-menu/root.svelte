<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setMenu } from './ctx.js'

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
  let root: HTMLElement | undefined = $state()

  // Plain array: DOM nodes in a reactive array get proxied and break
  // identity comparisons against document.activeElement.
  const itemEls: HTMLElement[] = []

  setMenu({
    get open() {
      return open
    },
    set open(next: boolean) {
      if (next === open) return
      open = next
      onOpenChange?.(next)
    },
    id: `sig-menu-${id}`,
    trigger: () => trigger,
    setTrigger: (el) => (trigger = el),
    items: () => itemEls,
    registerItem(el: HTMLElement) {
      itemEls.push(el)
      return () => {
        const i = itemEls.indexOf(el)
        if (i !== -1) itemEls.splice(i, 1)
      }
    }
  })

  function close(restoreFocus = true) {
    open = false
    onOpenChange?.(false)
    if (restoreFocus) trigger?.focus()
  }

  $effect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && root && !root.contains(target)) close(false)
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      close()
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeydown)
    }
  })

  // Focus the first item once the menu opens so arrow navigation has a
  // starting point, matching the menu button pattern.
  $effect(() => {
    if (open) itemEls[0]?.focus()
  })
</script>

<div bind:this={root} class={cn('sig-menu-wrap', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-menu-wrap) {
    position: relative;
    display: inline-flex;
  }
</style>
