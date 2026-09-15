<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCombobox } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const combo = getCombobox()
</script>

{#if combo.open}
  <div
    id={combo.listId}
    role="listbox"
    data-state="open"
    class={cn('sig-combobox-content', className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-combobox-content) {
    position: absolute;
    z-index: 50;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    max-height: 16rem;
    overflow-y: auto;
    padding: 0.25rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 4px 12px rgb(0 0 0 / 0.1));
    font-size: 0.875rem;
    scrollbar-width: thin;
    scrollbar-color: var(--sig-border, #d4d4d8) transparent;
  }
</style>
