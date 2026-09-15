<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
    length?: number
    value?: string
    masked?: boolean
    disabled?: boolean
    label?: string
    onChange?: (value: string) => void
    onComplete?: (value: string) => void
  }

  let {
    length = 6,
    value = $bindable(''),
    masked = false,
    disabled = false,
    label = 'One-time code',
    onChange,
    onComplete,
    class: className,
    ...rest
  }: Props = $props()

  let cells = $state<string[]>([])
  let inputs: HTMLInputElement[] = []

  $effect(() => {
    const next = value.slice(0, length).split('')
    while (next.length < length) next.push('')
    cells = next
  })

  function emit() {
    value = cells.join('')
    onChange?.(value)
    if (value.length === length) onComplete?.(value)
  }

  function setCell(i: number, raw: string) {
    const ch = raw.replace(/\D/g, '').slice(-1)
    cells[i] = ch
    emit()
    if (ch && i < length - 1) inputs[i + 1]?.focus()
  }

  function paste(e: ClipboardEvent) {
    const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    e.preventDefault()
    for (let i = 0; i < length; i++) cells[i] = digits[i] ?? ''
    emit()
    inputs[Math.min(digits.length, length - 1)]?.focus()
  }
</script>

<span class={cn('sig-pin-input', className)} role="group" aria-label={label} {...rest}>
  {#each cells as cell, i (i)}
    <input
      {@attach (node) => {
        inputs[i] = node
      }}
      class="sig-pin-cell"
      type={masked ? 'password' : 'text'}
      inputmode="numeric"
      autocomplete={i === 0 ? 'one-time-code' : 'off'}
      maxlength="1"
      aria-label="Digit {i + 1} of {length}"
      value={cell}
      {disabled}
      oninput={(e) => setCell(i, (e.target as HTMLInputElement).value)}
      onkeydown={(e) => {
        if (e.key === 'Backspace') {
          if (cells[i]) {
            cells[i] = ''
            emit()
          } else if (i > 0) {
            inputs[i - 1]?.focus()
            cells[i - 1] = ''
            emit()
          }
          e.preventDefault()
        } else if (e.key === 'ArrowLeft' && i > 0) {
          e.preventDefault()
          inputs[i - 1]?.focus()
        } else if (e.key === 'ArrowRight' && i < length - 1) {
          e.preventDefault()
          inputs[i + 1]?.focus()
        }
      }}
      onpaste={paste}
    />
  {/each}
</span>

<style>
  :global(.sig-pin-input) {
    display: inline-flex;
    gap: 0.375rem;
  }

  :global(.sig-pin-cell) {
    width: 2.25rem;
    height: 2.5rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font: inherit;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }

  :global(.sig-pin-cell:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
    border-color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-pin-cell:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
