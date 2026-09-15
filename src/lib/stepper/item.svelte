<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLiAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getStepper } from './ctx.js'

  export interface Props extends Omit<HTMLLiAttributes, 'children' | 'title'> {
    title: string
    description?: string
    children?: Snippet
  }

  let { title, description, class: className, children, onclick, ...rest }: Props = $props()

  const ctx = getStepper()
  const index = ctx.register()
  const state = $derived(
    index < ctx.step ? 'complete' : index === ctx.step ? 'current' : 'upcoming'
  )
</script>

<li data-state={state} class={cn('sig-step', className)} {...rest}>
  <button
    type="button"
    class="sig-step-button"
    aria-current={state === 'current' ? 'step' : undefined}
    onclick={(event) => {
      ctx.step = index
      onclick?.(event as never)
    }}
  >
    <span class="sig-step-indicator" aria-hidden="true">
      {#if state === 'complete'}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M20 6 9 17l-5-5" /></svg
        >
      {:else}
        {index + 1}
      {/if}
    </span>
    <span class="sig-step-text">
      <span class="sig-step-title">{title}</span>
      {#if description}<span class="sig-step-desc">{description}</span>{/if}
    </span>
  </button>
  {@render children?.()}
</li>

<style>
  :global(.sig-step) {
    position: relative;
    flex: 1;
  }

  :global(.sig-step:not(:last-child)::after) {
    content: '';
    position: absolute;
    top: 0.875rem;
    left: calc(50% + 1.25rem);
    right: calc(-50% + 1.25rem);
    height: 1px;
    background: var(--sig-border, #d4d4d8);
  }

  :global(.sig-step[data-state='complete']:not(:last-child)::after) {
    background: var(--sig-accent, #4f46e5);
  }

  :global(.sig-step-button) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--sig-fg, #18181b);
    cursor: pointer;
    text-align: center;
  }

  :global(.sig-step-indicator) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    border: 1px solid var(--sig-border, #d4d4d8);
    background: var(--sig-bg, #fff);
    color: var(--sig-muted, #71717a);
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 1;
  }

  :global(.sig-step[data-state='current'] .sig-step-indicator) {
    border-color: var(--sig-accent, #4f46e5);
    color: var(--sig-accent, #4f46e5);
    outline: 3px solid color-mix(in srgb, var(--sig-accent, #4f46e5) 20%, transparent);
  }

  :global(.sig-step[data-state='complete'] .sig-step-indicator) {
    border-color: var(--sig-accent, #4f46e5);
    background: var(--sig-accent, #4f46e5);
    color: var(--sig-accent-fg, #fff);
  }

  :global(.sig-step-text) {
    display: grid;
    gap: 0.125rem;
  }

  :global(.sig-step-title) {
    font-size: 0.8125rem;
    font-weight: 500;
  }

  :global(.sig-step[data-state='upcoming'] .sig-step-title) {
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-step-desc) {
    font-size: 0.75rem;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-step-button:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
    border-radius: var(--sig-radius, 0.375rem);
  }
</style>
