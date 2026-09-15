<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'value'> {
    value?: number
    min?: number
    max?: number
    step?: number
    label?: string
  }

  let {
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    label,
    class: className,
    disabled,
    ...rest
  }: Props = $props()

  const pct = $derived(Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100)))
</script>

<span class={cn('sig-slider', className)} data-disabled={disabled ? '' : undefined}>
  <input
    type="range"
    bind:value
    {min}
    {max}
    {step}
    {disabled}
    aria-label={label}
    style="--sig-slider-pct: {pct}%"
    {...rest}
  />
</span>

<style>
  :global(.sig-slider) {
    display: inline-flex;
    width: 100%;
    align-items: center;
  }

  :global(.sig-slider input[type='range']) {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 1.25rem;
    background: transparent;
    cursor: pointer;
    margin: 0;
  }

  :global(.sig-slider input[type='range']::-webkit-slider-runnable-track) {
    height: 0.25rem;
    border-radius: 9999px;
    background: linear-gradient(
      to right,
      var(--sig-accent, #4f46e5) var(--sig-slider-pct, 0%),
      var(--sig-surface, #f4f4f5) var(--sig-slider-pct, 0%)
    );
  }

  :global(.sig-slider input[type='range']::-moz-range-track) {
    height: 0.25rem;
    border-radius: 9999px;
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-slider input[type='range']::-moz-range-progress) {
    height: 0.25rem;
    border-radius: 9999px;
    background: var(--sig-accent, #4f46e5);
  }

  :global(.sig-slider input[type='range']::-webkit-slider-thumb) {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    margin-top: -0.375rem;
    border-radius: 9999px;
    border: 2px solid var(--sig-accent, #4f46e5);
    background: var(--sig-bg, #fff);
  }

  :global(.sig-slider input[type='range']::-moz-range-thumb) {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    border: 2px solid var(--sig-accent, #4f46e5);
    background: var(--sig-bg, #fff);
  }

  :global(.sig-slider input[type='range']:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 4px;
  }

  :global(.sig-slider[data-disabled]) {
    opacity: 0.5;
  }

  :global(.sig-slider input[type='range']:disabled) {
    cursor: not-allowed;
  }
</style>
