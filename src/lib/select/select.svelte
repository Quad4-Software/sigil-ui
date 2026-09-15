<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLSelectAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLSelectAttributes, 'children'> {
    value?: string
    children?: Snippet
  }

  let { value = $bindable(''), class: className, children, ...rest }: Props = $props()
</script>

<span class={cn('sig-select-wrap', className)}>
  <select bind:value class="sig-select" {...rest}>
    {@render children?.()}
  </select>
</span>

<style>
  :global(.sig-select-wrap) {
    position: relative;
    display: inline-flex;
    width: 100%;
  }

  :global(.sig-select) {
    appearance: none;
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.4;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    cursor: pointer;
  }

  :global(.sig-select-wrap::after) {
    content: '';
    position: absolute;
    right: 0.75rem;
    top: 50%;
    width: 0.5rem;
    height: 0.5rem;
    border-right: 2px solid var(--sig-muted, #71717a);
    border-bottom: 2px solid var(--sig-muted, #71717a);
    transform: translateY(-70%) rotate(45deg);
    pointer-events: none;
  }

  :global(.sig-select:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }

  :global(.sig-select:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
