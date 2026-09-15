<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCombobox, type ComboboxItem } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
    value: string
    disabled?: boolean
    onSelect?: () => void
    children?: Snippet
  }

  let {
    value,
    disabled = false,
    onSelect,
    class: className,
    children,
    onclick,
    ...rest
  }: Props = $props()

  const combo = getCombobox()
  let el: HTMLElement | undefined = $state()
  const item: ComboboxItem = {
    get el() {
      return el as HTMLElement
    },
    get value() {
      return value
    },
    get disabled() {
      return disabled
    },
    label: () => el?.textContent?.trim() ?? value
  }

  const visible = $derived(!disabled || combo.matches(item))
  const shown = $derived(combo.matches(item))
  const active = $derived(combo.activeValue === value)
  const selected = $derived(combo.value === value)

  // register once per instance since filtered items stay registered and
  // matches handles visibility, and onMount runs outside the template
  // reactions that reject state writes
  onMount(() => combo.registerItem(item))
</script>

{#if visible && shown}
  <div
    bind:this={el}
    id="{combo.listId}-item-{value}"
    role="option"
    aria-selected={selected}
    aria-disabled={disabled || undefined}
    data-value={value}
    data-active={active ? '' : undefined}
    data-selected={selected ? '' : undefined}
    class={cn('sig-combobox-item', className)}
    onclick={(event) => {
      onclick?.(event)
      if (!event.defaultPrevented && !disabled) {
        combo.select(item)
        onSelect?.()
      }
    }}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-combobox-item) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    font-size: 0.875rem;
    cursor: pointer;
    user-select: none;
  }

  :global(.sig-combobox-item[data-active]) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-combobox-item[data-selected]) {
    font-weight: 500;
  }

  :global(.sig-combobox-item[aria-disabled='true']) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
