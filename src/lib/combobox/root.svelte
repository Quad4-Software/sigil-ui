<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setCombobox, type ComboboxItem } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    value?: string
    onValueChange?: (value: string) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    filter?: (query: string, value: string, label: string) => boolean
    children?: Snippet
  }

  let {
    value = $bindable(''),
    onValueChange,
    open = $bindable(false),
    onOpenChange,
    filter,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const id = $props.id()
  let query = $state('')
  let activeValue = $state<string | null>(null)
  let inputEl = $state<HTMLInputElement | undefined>()
  let root: HTMLElement | undefined = $state()
  const itemList = $state<ComboboxItem[]>([])

  function setOpen(next: boolean) {
    if (next === open) return
    open = next
    onOpenChange?.(next)
  }

  function matches(item: ComboboxItem) {
    const q = query.trim().toLowerCase()
    if (!q) return true
    if (filter) return filter(q, item.value, item.label())
    return item.label().toLowerCase().includes(q) || item.value.toLowerCase().includes(q)
  }

  function visibleItems() {
    return itemList.filter((item) => !item.disabled && matches(item))
  }

  // suppressFocus stops the refocus in select() from reopening the list.
  let suppressFocus = false

  function select(item: ComboboxItem) {
    value = item.value
    onValueChange?.(item.value)
    if (inputEl) inputEl.value = item.label()
    query = ''
    setOpen(false)
    suppressFocus = true
    inputEl?.focus()
    suppressFocus = false
  }

  function move(step: number) {
    const visible = visibleItems()
    if (!visible.length) return
    const index = visible.findIndex((item) => item.value === activeValue)
    const next = (index + step + visible.length) % visible.length
    activeValue = visible[next]?.value ?? null
    visible[next]?.el.scrollIntoView?.({ block: 'nearest' })
  }

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) setOpen(true)
        else move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'Home':
        event.preventDefault()
        activeValue = visibleItems()[0]?.value ?? null
        break
      case 'End':
        event.preventDefault()
        {
          const visible = visibleItems()
          activeValue = visible[visible.length - 1]?.value ?? null
        }
        break
      case 'Enter': {
        if (!open) return
        event.preventDefault()
        const active = itemList.find((item) => item.value === activeValue)
        if (active && !active.disabled && matches(active)) select(active)
        break
      }
      case 'Escape':
        if (open) {
          event.stopPropagation()
          setOpen(false)
        }
        break
    }
  }

  setCombobox({
    get open() {
      return open
    },
    set open(next: boolean) {
      setOpen(next)
    },
    get query() {
      return query
    },
    set query(next: string) {
      query = next
      if (next) setOpen(true)
    },
    get activeValue() {
      return activeValue
    },
    set activeValue(next: string | null) {
      activeValue = next
    },
    get value() {
      return value
    },
    listId: `sig-combobox-list-${id}`,
    items: () => itemList,
    registerItem(item: ComboboxItem) {
      itemList.push(item)
      return () => {
        // teardown runs inside a template reaction where state writes are
        // rejected, so the removal is deferred to a microtask
        queueMicrotask(() => {
          const i = itemList.findIndex((x) => x.value === item.value)
          if (i !== -1) itemList.splice(i, 1)
        })
      }
    },
    matches,
    visibleItems,
    select,
    onKeydown: handleKeydown,
    onFocus: () => {
      if (!suppressFocus) setOpen(true)
    },
    setInput: (el) => (inputEl = el)
  })

  // Reset the highlight to the first visible option when the filtered
  // set changes.
  $effect(() => {
    const visible = visibleItems()
    if (!visible.some((item) => item.value === activeValue)) {
      activeValue = visible[0]?.value ?? null
    }
  })

  $effect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && root && !root.contains(target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  })
</script>

<div bind:this={root} class={cn('sig-combobox', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-combobox) {
    position: relative;
  }
</style>
