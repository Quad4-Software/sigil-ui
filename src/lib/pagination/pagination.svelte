<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLElement> {
    page: number
    pages: number
    siblings?: number
  }

  let { page = $bindable(1), pages, siblings = 1, class: className, ...rest }: Props = $props()

  const items = $derived.by(() => {
    const out: (number | 'gap')[] = []
    const lo = Math.max(2, page - siblings)
    const hi = Math.min(pages - 1, page + siblings)
    out.push(1)
    if (lo > 2) out.push('gap')
    for (let i = lo; i <= hi; i++) out.push(i)
    if (hi < pages - 1) out.push('gap')
    if (pages > 1) out.push(pages)
    return out
  })
</script>

<nav aria-label="Pagination" class={cn('sig-pagination', className)} {...rest}>
  <button
    type="button"
    class="sig-page-btn"
    disabled={page <= 1}
    aria-label="Previous page"
    onclick={() => (page = page - 1)}>Prev</button
  >
  {#each items as item, i (i)}
    {#if item === 'gap'}
      <span class="sig-page-gap" aria-hidden="true">...</span>
    {:else}
      <button
        type="button"
        class="sig-page-btn"
        data-active={item === page || undefined}
        aria-current={item === page ? 'page' : undefined}
        aria-label={`Page ${item}`}
        onclick={() => (page = item)}>{item}</button
      >
    {/if}
  {/each}
  <button
    type="button"
    class="sig-page-btn"
    disabled={page >= pages}
    aria-label="Next page"
    onclick={() => (page = page + 1)}>Next</button
  >
</nav>

<style>
  :global(.sig-pagination) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  :global(.sig-page-btn) {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    border: 1px solid var(--sig-border, #e4e4e7);
    border-radius: var(--sig-radius, 0.375rem);
    background: transparent;
    color: var(--sig-fg, #18181b);
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 120ms ease;
  }

  :global(.sig-page-btn:hover:not(:disabled)) {
    background: var(--sig-surface-hover, #e9e9ec);
  }

  :global(.sig-page-btn:disabled) {
    opacity: 0.4;
    cursor: default;
  }

  :global(.sig-page-btn[data-active]) {
    background: var(--sig-accent, #4f46e5);
    border-color: var(--sig-accent, #4f46e5);
    color: var(--sig-accent-fg, #fff);
  }

  :global(.sig-page-btn:focus-visible) {
    outline: 2px solid var(--sig-ring, #4f46e5);
    outline-offset: 2px;
  }

  :global(.sig-page-gap) {
    color: var(--sig-muted, #71717a);
    padding: 0 0.25rem;
  }
</style>
