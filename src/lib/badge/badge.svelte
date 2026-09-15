<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  type Tone = 'neutral' | 'accent' | 'danger'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone
    children?: Snippet
  }

  let { tone = 'neutral', class: className, children, ...rest }: Props = $props()
</script>

<span class={cn('sig-badge', className)} data-tone={tone} {...rest}>
  {@render children?.()}
</span>

<style>
  :global(.sig-badge) {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25;
    border-radius: 9999px;
    border: 1px solid var(--sig-border, #d4d4d8);
    color: var(--sig-fg, #18181b);
    background: var(--sig-surface, #f4f4f5);
    white-space: nowrap;
  }

  :global(.sig-badge[data-tone='accent']) {
    border-color: transparent;
    background: var(--sig-accent, #4f46e5);
    color: var(--sig-accent-fg, #fff);
  }

  :global(.sig-badge[data-tone='danger']) {
    border-color: transparent;
    background: var(--sig-danger, #dc2626);
    color: var(--sig-danger-fg, #fff);
  }
</style>
