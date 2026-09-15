<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export type AlertTone = 'default' | 'success' | 'warning' | 'danger' | 'info'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    tone?: AlertTone
    title?: string
    children?: Snippet
  }

  let { tone = 'default', title, class: className, children, ...rest }: Props = $props()

  // Assertive announcements only for tones that signal a problem.
  const role = $derived(tone === 'danger' || tone === 'warning' ? 'alert' : 'status')
</script>

<div {role} data-tone={tone} class={cn('sig-alert', className)} {...rest}>
  {#if title}
    <p class="sig-alert-title">{title}</p>
  {/if}
  {#if children}
    <div class="sig-alert-body">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  :global(.sig-alert) {
    padding: 0.875rem 1rem;
    border-radius: var(--sig-radius, 0.375rem);
    border: 1px solid var(--sig-border, #d4d4d8);
    border-left-width: 3px;
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :global(.sig-alert[data-tone='success']) {
    border-left-color: var(--sig-success, #16a34a);
  }

  :global(.sig-alert[data-tone='warning']) {
    border-left-color: var(--sig-warning, #d97706);
  }

  :global(.sig-alert[data-tone='danger']) {
    border-left-color: var(--sig-danger, #dc2626);
  }

  :global(.sig-alert[data-tone='info']) {
    border-left-color: var(--sig-info, #2563eb);
  }

  :global(.sig-alert-title) {
    margin: 0 0 0.25rem;
    font-weight: 600;
  }

  :global(.sig-alert-body) {
    color: var(--sig-muted, #71717a);
  }
</style>
