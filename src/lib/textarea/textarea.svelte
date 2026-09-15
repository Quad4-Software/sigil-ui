<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLTextareaAttributes {
    value?: string
    invalid?: boolean
  }

  let { value = $bindable(''), invalid = false, class: className, ...rest }: Props = $props()
</script>

<textarea
  bind:value
  aria-invalid={invalid || undefined}
  data-invalid={invalid ? '' : undefined}
  class={cn('sig-textarea', className)}
  {...rest}></textarea>

<style>
  :global(.sig-textarea) {
    display: block;
    width: 100%;
    min-height: 4.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
  }

  :global(.sig-textarea::placeholder) {
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-textarea:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-textarea[data-invalid]) {
    border-color: var(--sig-danger, #dc2626);
  }

  :global(.sig-textarea:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
