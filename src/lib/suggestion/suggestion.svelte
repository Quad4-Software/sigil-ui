<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
    /** Text the user has typed. */
    value?: string
    /** Ghost completion shown after value. */
    suggestion?: string
    /** Focusable and accepts with Tab, ArrowRight or Enter. Escape dismisses. */
    interactive?: boolean
    onaccept?: (suggestion: string) => void
    ondismiss?: () => void
  }

  let {
    value = '',
    suggestion = '',
    interactive = false,
    onaccept,
    ondismiss,
    class: className,
    ...rest
  }: Props = $props()

  const keys = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      ondismiss?.()
      return
    }
    if (!suggestion) return
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault()
      onaccept?.(value + suggestion)
    }
  }
</script>

{#snippet inner()}
  <span class="sig-suggestion-value">{value}</span><span
    class="sig-suggestion-ghost"
    aria-hidden="true">{suggestion}</span
  >{#if suggestion}<span class="sig-sr-only">Suggestion: {value}{suggestion}</span>{/if}
{/snippet}

{#if interactive && suggestion}
  <button
    type="button"
    class={cn('sig-suggestion', className)}
    aria-label="Accept suggestion: {value}{suggestion}"
    onclick={() => onaccept?.(value + suggestion)}
    onkeydown={keys}
    {...rest}
  >
    {@render inner()}
    <kbd class="sig-suggestion-key">tab</kbd>
  </button>
{:else}
  <span class={cn('sig-suggestion', className)} {...rest}>{@render inner()}</span>
{/if}

<style>
  :global(.sig-sr-only) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }

  :global(.sig-suggestion) {
    display: inline-flex;
    align-items: baseline;
    gap: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
  }

  :global(button.sig-suggestion) {
    border-radius: var(--sig-radius, 0.375rem);
    cursor: pointer;
  }

  :global(button.sig-suggestion:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 2px;
  }

  :global(.sig-suggestion-ghost) {
    color: var(--sig-muted, #71717a);
    opacity: 0.55;
  }

  :global(.sig-suggestion-key) {
    margin-left: 0.5rem;
    padding: 0 0.375rem;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-bottom-width: 2px;
    border-radius: 0.25rem;
    font-family: inherit;
    font-size: 0.75em;
    color: var(--sig-muted, #71717a);
    background: var(--sig-surface, #f4f4f5);
  }
</style>
