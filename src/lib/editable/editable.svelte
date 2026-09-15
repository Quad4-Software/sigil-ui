<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'onSubmit'> {
    value?: string
    placeholder?: string
    disabled?: boolean
    submitOnBlur?: boolean
    onChange?: (value: string) => void
    onSubmit?: (value: string) => void
  }

  let {
    value = $bindable(''),
    placeholder = 'Click to edit',
    disabled = false,
    submitOnBlur = true,
    onChange,
    onSubmit,
    class: className,
    ...rest
  }: Props = $props()

  let editing = $state(false)
  let draft = $state('')
  let input: HTMLInputElement | undefined = $state()

  function start() {
    if (disabled) return
    draft = value
    editing = true
    queueMicrotask(() => {
      input?.focus()
      input?.select()
    })
  }

  function submit() {
    editing = false
    if (draft !== value) {
      value = draft
      onChange?.(value)
    }
    onSubmit?.(value)
  }

  function cancel() {
    editing = false
    draft = value
  }
</script>

<span class={cn('sig-editable', className)} data-editing={editing || undefined} {...rest}>
  {#if editing}
    <input
      bind:this={input}
      class="sig-editable-input"
      bind:value={draft}
      {placeholder}
      {disabled}
      aria-label="Edit value"
      onkeydown={(e) => {
        if (e.key === 'Enter') submit()
        else if (e.key === 'Escape') {
          e.stopPropagation()
          cancel()
        }
      }}
      onblur={() => (submitOnBlur ? submit() : cancel())}
    />
  {:else}
    <button
      type="button"
      class="sig-editable-preview"
      {disabled}
      onclick={start}
      data-empty={value === '' ? '' : undefined}
    >
      {value === '' ? placeholder : value}
    </button>
  {/if}
</span>

<style>
  :global(.sig-editable) {
    display: inline-flex;
    min-width: 0;
  }

  :global(.sig-editable-preview) {
    border: none;
    border-radius: var(--sig-radius, 0.375rem);
    background: transparent;
    color: var(--sig-fg, #18181b);
    font: inherit;
    text-align: left;
    cursor: text;
    padding: 0.125rem 0.375rem;
    margin: -0.125rem -0.375rem;
  }

  :global(.sig-editable-preview:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
  }

  :global(.sig-editable-preview:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }

  :global(.sig-editable-preview[data-empty]) {
    color: var(--sig-muted, #71717a);
    font-style: italic;
  }

  :global(.sig-editable-input) {
    border: 1px solid var(--sig-accent, #4f46e5);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font: inherit;
    padding: 0.125rem 0.375rem;
    margin: -0.1875rem -0.375rem;
    outline: none;
    min-width: 8rem;
  }
</style>
