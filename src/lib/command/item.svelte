<script lang="ts">
  import { onMount, type Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCommand, type CommandItem } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
    value: string
    keywords?: string[]
    disabled?: boolean
    onSelect?: () => void
    children?: Snippet
  }

  let {
    value,
    keywords = [],
    disabled = false,
    onSelect,
    class: className,
    children,
    onclick,
    ...rest
  }: Props = $props()

  const cmd = getCommand()
  let el: HTMLElement | undefined = $state()
  const item: CommandItem = {
    get el() {
      return el as HTMLElement
    },
    get value() {
      return value
    },
    get keywords() {
      return keywords
    },
    get disabled() {
      return disabled
    },
    get onSelect() {
      return onSelect
    }
  }

  const visible = $derived(cmd.matches(item))
  const active = $derived(cmd.activeValue === value)

  // register once per instance since filtered items stay registered and
  // matches handles visibility, and onMount runs outside the template
  // reactions that reject state writes
  onMount(() => cmd.registerItem(item))
</script>

{#if visible}
  <div
    bind:this={el}
    id="{cmd.listId}-item-{value}"
    role="option"
    aria-selected={active}
    aria-disabled={disabled || undefined}
    data-value={value}
    data-active={active ? '' : undefined}
    class={cn('sig-command-item', className)}
    onclick={(event) => {
      onclick?.(event)
      if (!event.defaultPrevented && !disabled) cmd.select(item)
    }}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-command-item) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.625rem;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    font-size: 0.875rem;
    cursor: pointer;
    user-select: none;
  }

  :global(.sig-command-item[data-active]) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-command-item[aria-disabled='true']) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
