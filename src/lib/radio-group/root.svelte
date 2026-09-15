<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setRadioGroup } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> {
    value?: string
    disabled?: boolean
    name?: string
    onValueChange?: (value: string) => void
    children?: Snippet
  }

  let {
    value = $bindable(''),
    disabled = false,
    name,
    onValueChange,
    class: className,
    children,
    onkeydown,
    ...rest
  }: Props = $props()

  const generatedName = $props.id()
  const groupName = $derived(name ?? `sig-radio-${generatedName}`)
  // Plain array: only membership is tracked, so reactivity would just wrap
  // DOM nodes in proxies and break indexOf against document.activeElement.
  const items: HTMLElement[] = []

  setRadioGroup({
    get value() {
      return value
    },
    set value(next: string) {
      value = next
    },
    get disabled() {
      return disabled
    },
    get name() {
      return groupName
    },
    items,
    registerItem(el: HTMLElement) {
      items.push(el)
      return {
        index: () => items.indexOf(el),
        unregister: () => {
          const i = items.indexOf(el)
          if (i !== -1) items.splice(i, 1)
        }
      }
    },
    select(next: string) {
      if (disabled) return
      value = next
      onValueChange?.(next)
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
    if (!next) return
    next.focus()
    const nextValue = next.dataset.value
    if (nextValue !== undefined && !disabled) {
      value = nextValue
      onValueChange?.(nextValue)
    }
  }
</script>

<div
  role="radiogroup"
  data-disabled={disabled ? '' : undefined}
  class={cn('sig-radio-group', className)}
  onkeydown={handleKeydown}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  :global(.sig-radio-group) {
    display: grid;
    gap: 0.5rem;
  }
</style>
