<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLInputAttributes, 'type'> {
    checked?: boolean
  }

  let { checked = $bindable(false), class: className, ...rest }: Props = $props()
</script>

<input type="checkbox" bind:checked class={cn('sig-checkbox', className)} {...rest} />

<style>
  :global(.sig-checkbox) {
    appearance: none;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: 0.25rem;
    background: var(--sig-bg, #fff);
    cursor: pointer;
    display: inline-grid;
    place-content: center;
    margin: 0;
    vertical-align: middle;
  }

  :global(.sig-checkbox:checked) {
    background: var(--sig-accent, #4f46e5);
    border-color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-checkbox:checked::before) {
    content: '';
    width: 0.625rem;
    height: 0.625rem;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    background: var(--sig-accent-fg, #fff);
    transform: scale(1);
  }

  :global(.sig-checkbox:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }

  :global(.sig-checkbox:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
