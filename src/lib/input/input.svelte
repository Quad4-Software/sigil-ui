<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLInputAttributes {
    value?: string | number
  }

  let { value = $bindable(''), class: className, type = 'text', ...rest }: Props = $props()
</script>

<input {type} bind:value class={cn('sig-input', className)} {...rest} />

<style>
  :global(.sig-input) {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.4;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-input::placeholder) {
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-input:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
    border-color: transparent;
  }

  :global(.sig-input[aria-invalid='true']) {
    border-color: var(--sig-danger, #dc2626);
  }

  :global(.sig-input:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
