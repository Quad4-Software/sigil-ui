<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setToggleGroup } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> {
    type?: 'single' | 'multiple'
    value?: string | string[]
    disabled?: boolean
    onValueChange?: (value: string | string[]) => void
    children?: Snippet
  }

  let {
    type = 'single',
    value = $bindable<string | string[]>(type === 'multiple' ? [] : ''),
    disabled = false,
    onValueChange,
    class: className,
    children,
    onkeydown,
    ...rest
  }: Props = $props()

  // Plain array: DOM nodes in a reactive array get proxied and break
  // identity comparisons against document.activeElement.
  const items: HTMLElement[] = []

  setToggleGroup({
    get type() {
      return type
    },
    get disabled() {
      return disabled
    },
    items,
    isPressed(v: string) {
      return Array.isArray(value) ? value.includes(v) : value === v
    },
    toggle(v: string) {
      if (disabled) return
      let next: string | string[]
      if (Array.isArray(value)) {
        next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v]
      } else {
        next = value === v ? '' : v
      }
      value = next
      onValueChange?.(next)
    },
    registerItem(el: HTMLElement) {
      items.push(el)
      return {
        unregister: () => {
          const i = items.indexOf(el)
          if (i !== -1) items.splice(i, 1)
        }
      }
    }
  })

  function handleKeydown(event: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
    onkeydown?.(event)
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1
    }
    const delta = keys[event.key]
    if (delta === undefined || items.length === 0) return
    event.preventDefault()
    const active = document.activeElement as HTMLElement | null
    const index = active ? items.indexOf(active) : -1
    const next = items[(index + delta + items.length) % items.length]
    next?.focus()
  }
</script>

<div
  role="group"
  data-disabled={disabled ? '' : undefined}
  class={cn('sig-toggle-group', className)}
  onkeydown={handleKeydown}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  :global(.sig-toggle-group) {
    display: inline-flex;
    align-items: center;
  }

  :global(.sig-toggle-group[data-disabled]) {
    opacity: 0.5;
  }
</style>
