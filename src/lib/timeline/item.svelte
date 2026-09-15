<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLiAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLLiAttributes, 'children' | 'title'> {
    title: string
    description?: string
    time?: string
    tone?: 'default' | 'success' | 'danger' | 'warning' | 'info'
    children?: Snippet
  }

  let {
    title,
    description,
    time,
    tone = 'default',
    class: className,
    children,
    ...rest
  }: Props = $props()
</script>

<li data-tone={tone} class={cn('sig-timeline-item', className)} {...rest}>
  <span class="sig-timeline-rail" aria-hidden="true">
    <span class="sig-timeline-dot"></span>
  </span>
  <div class="sig-timeline-body">
    <div class="sig-timeline-head">
      <span class="sig-timeline-title">{title}</span>
      {#if time}<time class="sig-timeline-time">{time}</time>{/if}
    </div>
    {#if description}<p class="sig-timeline-desc">{description}</p>{/if}
    {@render children?.()}
  </div>
</li>

<style>
  :global(.sig-timeline-item) {
    display: grid;
    grid-template-columns: 1rem 1fr;
    gap: 0.75rem;
    padding-bottom: 1.25rem;
  }

  :global(.sig-timeline-item:last-child) {
    padding-bottom: 0;
  }

  :global(.sig-timeline-rail) {
    position: relative;
    display: flex;
    justify-content: center;
  }

  :global(.sig-timeline-rail::before) {
    content: '';
    position: absolute;
    top: 1.1rem;
    bottom: -1.6rem;
    left: calc(50% - 0.75px);
    border-left: 1.5px dashed var(--sig-border, #d4d4d8);
  }

  :global(.sig-timeline-item:last-child .sig-timeline-rail::before) {
    display: none;
  }

  :global(.sig-timeline-dot) {
    width: 0.625rem;
    height: 0.625rem;
    margin-top: 0.375rem;
    border-radius: 9999px;
    border: 2px solid var(--sig-border, #d4d4d8);
    background: var(--sig-bg, #fff);
    flex-shrink: 0;
  }

  :global(.sig-timeline-item[data-tone='success'] .sig-timeline-dot) {
    border-color: var(--sig-success, #16a34a);
    background: var(--sig-success, #16a34a);
  }

  :global(.sig-timeline-item[data-tone='danger'] .sig-timeline-dot) {
    border-color: var(--sig-danger, #dc2626);
    background: var(--sig-danger, #dc2626);
  }

  :global(.sig-timeline-item[data-tone='warning'] .sig-timeline-dot) {
    border-color: var(--sig-warning, #d97706);
    background: var(--sig-warning, #d97706);
  }

  :global(.sig-timeline-item[data-tone='info'] .sig-timeline-dot) {
    border-color: var(--sig-info, #2563eb);
    background: var(--sig-info, #2563eb);
  }

  :global(.sig-timeline-head) {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  :global(.sig-timeline-title) {
    font-weight: 500;
    font-size: 0.875rem;
  }

  :global(.sig-timeline-time) {
    font-size: 0.75rem;
    color: var(--sig-muted, #71717a);
    white-space: nowrap;
  }

  :global(.sig-timeline-desc) {
    margin: 0.25rem 0 0;
    font-size: 0.8125rem;
    color: var(--sig-muted, #71717a);
  }
</style>
