<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    icon?: Snippet
    children?: Snippet
  }

  let { title, description, icon, class: className, children, ...rest }: Props = $props()
</script>

<div class={cn('sig-empty', className)} {...rest}>
  {#if icon}
    <div class="sig-empty-icon" aria-hidden="true">{@render icon()}</div>
  {/if}
  {#if title}
    <p class="sig-empty-title">{title}</p>
  {/if}
  {#if description}
    <p class="sig-empty-desc">{description}</p>
  {/if}
  {#if children}
    <div class="sig-empty-actions">{@render children()}</div>
  {/if}
</div>

<style>
  :global(.sig-empty) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 2.5rem 1.5rem;
    text-align: center;
    border: 1px dashed var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-empty .sig-empty-icon) {
    margin-bottom: 0.5rem;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-empty .sig-empty-title) {
    margin: 0;
    font-weight: 600;
    color: var(--sig-fg, #18181b);
  }

  :global(.sig-empty .sig-empty-desc) {
    margin: 0;
    font-size: 0.875rem;
  }

  :global(.sig-empty .sig-empty-actions) {
    margin-top: 0.75rem;
    display: flex;
    gap: 0.5rem;
  }
</style>
