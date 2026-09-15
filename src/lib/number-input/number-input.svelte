<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
    value?: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    label?: string
    onChange?: (value: number) => void
  }

  let {
    value = $bindable(0),
    min,
    max,
    step = 1,
    disabled = false,
    label,
    onChange,
    class: className,
    ...rest
  }: Props = $props()

  let text = $state(String(value))
  let prevValue = value

  $effect(() => {
    if (value !== prevValue) {
      prevValue = value
      text = String(value)
    }
  })

  let input: HTMLInputElement | undefined = $state()

  function clamp(n: number) {
    let v = n
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    return v
  }

  function commit(raw: string) {
    const n = Number(raw)
    if (Number.isNaN(n)) {
      text = String(value)
      return
    }
    value = clamp(n)
    text = String(value)
    onChange?.(value)
  }

  function bump(dir: 1 | -1) {
    if (disabled) return
    const base = Number(text) || 0
    value = clamp(base + dir * step)
    text = String(value)
    onChange?.(value)
  }
</script>

<span class={cn('sig-number-input', className)} data-disabled={disabled || undefined} {...rest}>
  <button
    type="button"
    class="sig-number-btn sig-number-dec"
    aria-label="Decrease"
    tabindex="-1"
    {disabled}
    onclick={() => bump(-1)}
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"><path d="M5 12h14" /></svg
    >
  </button>
  <input
    bind:this={input}
    class="sig-number-field"
    type="text"
    inputmode="decimal"
    role="spinbutton"
    aria-label={label}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    bind:value={text}
    {disabled}
    onblur={() => commit(text)}
    onkeydown={(e) => {
      if (e.key === 'Enter') commit(text)
      else if (e.key === 'ArrowUp') {
        e.preventDefault()
        bump(1)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        bump(-1)
      }
    }}
  />
  <button
    type="button"
    class="sig-number-btn sig-number-inc"
    aria-label="Increase"
    tabindex="-1"
    {disabled}
    onclick={() => bump(1)}
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg
    >
  </button>
</span>

<style>
  :global(.sig-number-input) {
    display: inline-flex;
    align-items: stretch;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font-size: 0.875rem;
    overflow: hidden;
  }

  :global(.sig-number-input:focus-within) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
    border-color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-number-input[data-disabled]) {
    opacity: 0.5;
  }

  :global(.sig-number-field) {
    width: 3.5rem;
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: center;
    padding: 0.375rem 0.25rem;
  }

  :global(.sig-number-field:focus) {
    outline: none;
  }

  :global(.sig-number-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    border: none;
    background: transparent;
    color: var(--sig-muted, #71717a);
    cursor: pointer;
    padding: 0;
  }

  :global(.sig-number-btn:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e4e4e7);
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-number-btn:disabled) {
    cursor: not-allowed;
  }
</style>
