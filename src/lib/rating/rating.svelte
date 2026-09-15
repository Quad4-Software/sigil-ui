<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange'> {
    value?: number
    max?: number
    readonly?: boolean
    disabled?: boolean
    label?: string
    onChange?: (value: number) => void
  }

  let {
    value = $bindable(0),
    max = 5,
    readonly = false,
    disabled = false,
    label = 'Rating',
    onChange,
    class: className,
    ...rest
  }: Props = $props()

  let hovered = $state(0)
  const shown = $derived(hovered || value)

  function set(n: number) {
    if (readonly || disabled) return
    value = n === value ? 0 : n
    onChange?.(value)
  }
</script>

<span
  class={cn('sig-rating', className)}
  role="radiogroup"
  aria-label={label}
  data-readonly={readonly || undefined}
  onmouseleave={() => (hovered = 0)}
  {...rest}
>
  {#each Array.from({ length: max }, (_, i) => i + 1) as n (n)}
    <button
      type="button"
      class="sig-rating-star"
      role="radio"
      aria-checked={n === value}
      aria-label="{n} of {max}"
      data-filled={n <= shown ? '' : undefined}
      disabled={disabled || readonly}
      tabindex={n === 1 || n === value ? 0 : -1}
      onmouseenter={() => (hovered = n)}
      onclick={() => set(n)}
      onkeydown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault()
          set(Math.min(max, value + 1))
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault()
          set(Math.max(0, value - 1))
        }
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2l2.9 6.26 6.6.56-5 4.4 1.5 6.48L12 16.9 5.99 19.7l1.5-6.48-5-4.4 6.6-.56z"
          fill={n <= shown ? 'currentColor' : 'none'}
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  {/each}
</span>

<style>
  :global(.sig-rating) {
    display: inline-flex;
    gap: 0.125rem;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-rating-star) {
    display: inline-flex;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    padding: 0.125rem;
    border-radius: 0.25rem;
  }

  :global(.sig-rating-star[data-filled]) {
    color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-rating-star:hover:not(:disabled)) {
    color: var(--sig-accent, #4f46e5);
  }

  :global(.sig-rating-star:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }

  :global(.sig-rating-star:disabled) {
    cursor: default;
  }

  :global(.sig-rating[data-readonly] .sig-rating-star) {
    cursor: default;
  }
</style>
