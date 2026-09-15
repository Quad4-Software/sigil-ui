<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getTabsContext } from './ctx.js'

  interface Props extends HTMLButtonAttributes {
    value: string
    children?: Snippet
  }

  let { value, class: className, children, onclick, ...rest }: Props = $props()
  const ctx = getTabsContext()
  const selected = $derived(ctx.value === value)
</script>

<button
  type="button"
  role="tab"
  id="{ctx.baseId}-tab-{value}"
  aria-selected={selected}
  aria-controls="{ctx.baseId}-panel-{value}"
  tabindex={selected ? 0 : -1}
  data-state={selected ? 'active' : 'inactive'}
  class={cn('sig-tab', className)}
  onclick={(event) => {
    ctx.value = value
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.()}
</button>

<style>
  :global(.sig-tab) {
    padding: 0.375rem 0.875rem;
    font: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    border: 0;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    background: transparent;
    color: var(--sig-muted, #71717a);
    cursor: pointer;
  }

  :global(.sig-tab[data-state='active']) {
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
  }

  :global(.sig-tab:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }

  :global(.sig-tab:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
