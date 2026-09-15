<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCommand } from './ctx.js'

  export interface Props extends Omit<HTMLInputAttributes, 'value' | 'role' | 'type'> {
    placeholder?: string
  }

  let {
    placeholder = 'Type a command or search...',
    class: className,
    onkeydown,
    oninput,
    ...rest
  }: Props = $props()

  const cmd = getCommand()
</script>

<input
  type="text"
  role="combobox"
  aria-expanded="true"
  aria-controls={cmd.listId}
  aria-autocomplete="list"
  aria-activedescendant={cmd.activeValue ? `${cmd.listId}-item-${cmd.activeValue}` : undefined}
  autocomplete="off"
  spellcheck="false"
  {placeholder}
  value={cmd.query}
  class={cn('sig-command-input', className)}
  oninput={(event) => {
    cmd.query = event.currentTarget.value
    oninput?.(event)
  }}
  onkeydown={(event) => {
    onkeydown?.(event)
    if (!event.defaultPrevented) cmd.onKeydown(event)
  }}
  {...rest}
/>

<style>
  :global(.sig-command-input) {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: none;
    border-bottom: 1px solid var(--sig-border, #d4d4d8);
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
  }

  :global(.sig-command-input::placeholder) {
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-command-input:focus-visible) {
    outline: none;
  }
</style>
