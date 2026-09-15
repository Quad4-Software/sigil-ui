<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getRadioGroup } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'role' | 'children' | 'value'> {
    value: string
    disabled?: boolean
    children?: Snippet
  }

  let { value, disabled = false, class: className, children, onclick, ...rest }: Props = $props()

  const group = getRadioGroup()
  const checked = $derived(group.value === value)
  const isDisabled = $derived(disabled || group.disabled)

  // Roving tabindex: the checked item (or the first when none is checked)
  // sits in the tab order, per the radiogroup keyboard pattern.
  let el: HTMLElement | undefined = $state()
  let registration = $state<{ index: () => number; unregister: () => void }>()

  const isFirst = $derived(registration?.index() === 0)
  const tabIndex = $derived(isDisabled ? -1 : checked || (group.value === '' && isFirst) ? 0 : -1)

  $effect(() => {
    if (!el) return
    const node = el
    const reg = group.registerItem(node)
    registration = reg
    return () => {
      reg.unregister()
      registration = undefined
    }
  })
</script>

<button
  bind:this={el}
  type="button"
  role="radio"
  aria-checked={checked}
  data-state={checked ? 'checked' : 'unchecked'}
  data-value={value}
  data-disabled={isDisabled ? '' : undefined}
  disabled={isDisabled}
  tabindex={tabIndex}
  class={cn('sig-radio', className)}
  onclick={(event) => {
    if (isDisabled) return
    group.select(value)
    onclick?.(event)
  }}
  {...rest}
>
  <span class="sig-radio-dot" aria-hidden="true"></span>
  {#if children}
    <span class="sig-radio-label">{@render children()}</span>
  {/if}
</button>

<style>
  :global(.sig-radio) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: var(--sig-radius, 0.375rem);
    background: transparent;
    color: var(--sig-fg, #18181b);
    font: inherit;
    cursor: pointer;
    text-align: left;
  }

  :global(.sig-radio:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-radio:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-radio:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-radio .sig-radio-dot) {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 9999px;
    border: 1px solid var(--sig-border, #d4d4d8);
    background: var(--sig-bg, #fff);
    position: relative;
    flex-shrink: 0;
  }

  :global(.sig-radio[data-state='checked'] .sig-radio-dot) {
    border-color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-radio[data-state='checked'] .sig-radio-dot::after) {
    content: '';
    position: absolute;
    inset: 0.1875rem;
    border-radius: 9999px;
    background: var(--sig-accent, #4f46e5);
  }
</style>
