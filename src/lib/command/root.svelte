<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setCommand, type CommandItem } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    value?: string
    onValueChange?: (value: string) => void
    filter?: (query: string, value: string, keywords: string[]) => boolean
    loop?: boolean
    children?: Snippet
  }

  let {
    value = $bindable(''),
    onValueChange,
    filter,
    loop = true,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const id = $props.id()
  let query = $state('')
  let activeValue = $state<string | null>(null)
  const itemList = $state<CommandItem[]>([])

  function matches(item: CommandItem) {
    const q = query.trim().toLowerCase()
    if (!q) return true
    if (filter) return filter(q, item.value, item.keywords)
    const hay = [item.value, ...item.keywords].join(' ').toLowerCase()
    return hay.includes(q)
  }

  function visibleItems() {
    return itemList.filter((item) => !item.disabled && matches(item))
  }

  function select(item: CommandItem) {
    value = item.value
    onValueChange?.(item.value)
    item.onSelect?.()
  }

  setCommand({
    get query() {
      return query
    },
    set query(next: string) {
      query = next
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
    listId: `sig-command-list-${id}`,
    items: () => itemList,
    registerItem(item: CommandItem) {
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
    onKeydown: handleKeydown
  })

  // Keep the active option on the first visible row whenever the query
  // or the item set changes so Enter always does something sensible.
  $effect(() => {
    const visible = visibleItems()
    if (!visible.some((item) => item.value === activeValue)) {
      activeValue = visible[0]?.value ?? null
    }
  })

  function move(step: number) {
    const visible = visibleItems()
    if (!visible.length) return
    const index = visible.findIndex((item) => item.value === activeValue)
    let next = index + step
    if (loop) next = (next + visible.length) % visible.length
    else next = Math.min(Math.max(next, 0), visible.length - 1)
    activeValue = visible[next]?.value ?? null
    visible[next]?.el.scrollIntoView?.({ block: 'nearest' })
  }

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
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
        event.preventDefault()
        const active = itemList.find((item) => item.value === activeValue)
        if (active && !active.disabled && matches(active)) select(active)
        break
      }
    }
  }
</script>

<div class={cn('sig-command', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-command) {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
  }
</style>
