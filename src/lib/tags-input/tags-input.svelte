<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onchange'> {
    tags?: string[]
    placeholder?: string
    disabled?: boolean
    max?: number
    duplicates?: boolean
    onValueChange?: (tags: string[]) => void
  }

  let {
    tags = $bindable<string[]>([]),
    placeholder = 'Add tag',
    disabled = false,
    max,
    duplicates = false,
    onValueChange,
    class: className,
    ...rest
  }: Props = $props()

  let draft = $state('')

  function commit(list: string[]) {
    tags = list
    onValueChange?.(list)
  }

  function add() {
    const value = draft.trim()
    if (!value || disabled) return
    if (!duplicates && tags.includes(value)) {
      draft = ''
      return
    }
    if (max !== undefined && tags.length >= max) return
    commit([...tags, value])
    draft = ''
  }

  function remove(index: number) {
    if (disabled) return
    commit(tags.filter((_, i) => i !== index))
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add()
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      remove(tags.length - 1)
    }
  }
</script>

<div data-disabled={disabled ? '' : undefined} class={cn('sig-tags-input', className)} {...rest}>
  {#each tags as tag, i (i)}
    <span class="sig-tag">
      {tag}
      <button
        type="button"
        class="sig-tag-remove"
        aria-label="Remove {tag}"
        {disabled}
        onclick={() => remove(i)}>&times;</button
      >
    </span>
  {/each}
  <input
    class="sig-tags-field"
    bind:value={draft}
    {placeholder}
    {disabled}
    onkeydown={handleKeydown}
    onblur={add}
    aria-label={rest['aria-label'] ?? placeholder}
  />
</div>

<style>
  :global(.sig-tags-input) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    cursor: text;
  }

  :global(.sig-tags-input:focus-within) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-tags-input[data-disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.sig-tag) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    border-radius: calc(var(--sig-radius, 0.375rem) - 2px);
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-fg, #18181b);
    font-size: 0.8125rem;
  }

  :global(.sig-tag-remove) {
    display: inline-flex;
    align-items: center;
    padding: 0;
    border: none;
    background: none;
    color: var(--sig-muted, #71717a);
    font: inherit;
    cursor: pointer;
  }

  :global(.sig-tag-remove:hover) {
    color: var(--sig-danger, #dc2626);
  }

  :global(.sig-tags-field) {
    flex: 1;
    min-width: 6rem;
    border: none;
    outline: none;
    background: none;
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 0.875rem;
    padding: 0.125rem 0;
  }
</style>
