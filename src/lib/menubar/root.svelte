<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setMenubar } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  let openIndex = $state(-1)
  let registered = 0
  let root: HTMLElement | undefined = $state()
  const triggers: HTMLElement[] = []

  function close() {
    openIndex = -1
  }

  setMenubar({
    get openIndex() {
      return openIndex
    },
    set openIndex(next: number) {
      openIndex = next
    },
    triggers,
    registerMenu() {
      return registered++
    },
    registerTrigger(index: number, el: HTMLElement) {
      triggers[index] = el
    },
    open(index: number) {
      openIndex = index
    },
    close,
    moveMenu(delta: number) {
      if (triggers.length === 0) return
      const active = document.activeElement as HTMLElement | null
      let index = active ? triggers.indexOf(active) : -1
      if (index === -1 && openIndex >= 0) index = openIndex
      if (index === -1) index = 0
      const next = triggers[(index + delta + triggers.length) % triggers.length]
      if (!next) return
      next.focus()
      if (openIndex >= 0) openIndex = triggers.indexOf(next)
    }
  })

  $effect(() => {
    if (openIndex < 0) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && root && !root.contains(target)) openIndex = -1
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const previous = openIndex
        openIndex = -1
        triggers[previous]?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeydown)
    }
  })
</script>

<div bind:this={root} role="menubar" class={cn('sig-menubar', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-menubar) {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    padding: 0.25rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
  }
</style>
