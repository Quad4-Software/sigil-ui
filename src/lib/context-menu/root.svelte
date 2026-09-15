<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setContextMenu } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    disabled?: boolean
    children?: Snippet
  }

  let {
    open = $bindable(false),
    onOpenChange,
    disabled = false,
    class: className,
    children,
    oncontextmenu,
    ...rest
  }: Props = $props()

  let x = $state(0)
  let y = $state(0)
  const itemEls: HTMLElement[] = []

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  setContextMenu({
    get open() {
      return open
    },
    set open(next: boolean) {
      setOpen(next)
    },
    get x() {
      return x
    },
    get y() {
      return y
    },
    items: () => itemEls,
    registerItem(el: HTMLElement) {
      itemEls.push(el)
      return () => {
        const i = itemEls.indexOf(el)
        if (i !== -1) itemEls.splice(i, 1)
      }
    }
  })

  function handleContextMenu(event: MouseEvent) {
    oncontextmenu?.(event as MouseEvent & { currentTarget: HTMLDivElement })
    if (disabled || event.defaultPrevented) return
    event.preventDefault()
    x = event.clientX
    y = event.clientY
    setOpen(true)
  }

  $effect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && !itemEls.some((el) => el.contains(target))) {
        const menu = document.querySelector('.sig-cm-content')
        if (menu && !menu.contains(target)) setOpen(false)
      }
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onScroll = () => setOpen(false)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    document.addEventListener('scroll', onScroll, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('scroll', onScroll, true)
    }
  })

  // Focus the first item once the menu opens so arrow navigation has a
  // starting point, matching the contextmenu pattern.
  $effect(() => {
    if (open) itemEls[0]?.focus()
  })
</script>

<div class={cn('sig-cm-wrap', className)} oncontextmenu={handleContextMenu} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-cm-wrap) {
    display: contents;
  }
</style>
