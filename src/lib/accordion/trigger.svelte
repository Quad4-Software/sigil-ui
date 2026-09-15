<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getAccordionContext, getAccordionItemContext } from './ctx.js'

  interface Props extends HTMLButtonAttributes {
    children?: Snippet
  }

  let { class: className, children, onclick, ...rest }: Props = $props()
  const root = getAccordionContext()
  const item = getAccordionItemContext()
  const expanded = $derived(root.expanded.has(item.value))
</script>

<h3 class="sig-acc-heading">
  <button
    type="button"
    id={item.triggerId}
    aria-expanded={expanded}
    aria-controls={item.contentId}
    class={cn('sig-acc-trigger', className)}
    onclick={(event) => {
      root.toggle(item.value)
      onclick?.(event)
    }}
    {...rest}
  >
    {@render children?.()}
    <span class="sig-acc-chevron" aria-hidden="true"></span>
  </button>
</h3>

<style>
  :global(.sig-acc-heading) {
    margin: 0;
    font-size: inherit;
    font-weight: inherit;
  }

  :global(.sig-acc-trigger) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    padding: 0.875rem 0;
    font: inherit;
    font-weight: 500;
    text-align: left;
    border: 0;
    background: none;
    color: var(--sig-fg, #18181b);
    cursor: pointer;
  }

  :global(.sig-acc-trigger:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-acc-chevron) {
    width: 0.5rem;
    height: 0.5rem;
    flex-shrink: 0;
    border-right: 2px solid var(--sig-muted, #71717a);
    border-bottom: 2px solid var(--sig-muted, #71717a);
    transform: rotate(45deg);
    transition: transform 150ms;
  }

  :global(.sig-acc-trigger[aria-expanded='true'] .sig-acc-chevron) {
    transform: rotate(225deg);
  }

  :global(.sig-acc-trigger:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
