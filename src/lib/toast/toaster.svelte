<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { toaster } from './toast.svelte.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  }

  let { position = 'bottom-right', class: className, ...rest }: Props = $props()
</script>

<div
  class={cn('sig-toaster', className)}
  data-position={position}
  aria-label="Notifications"
  {...rest}
>
  {#each toaster.toasts as t (t.id)}
    <div
      class="sig-toast"
      data-tone={t.tone}
      role={t.tone === 'danger' || t.tone === 'warning' ? 'alert' : 'status'}
      onmouseenter={() => toaster.pause(t.id)}
      onmouseleave={() => toaster.resume(t.id)}
      onfocusin={() => toaster.pause(t.id)}
      onfocusout={() => toaster.resume(t.id)}
    >
      <div class="sig-toast-text">
        <p class="sig-toast-title">{t.title}</p>
        {#if t.description}
          <p class="sig-toast-desc">{t.description}</p>
        {/if}
      </div>
      {#if t.action}
        <button
          type="button"
          class="sig-toast-action"
          onclick={() => {
            t.action?.onclick()
            toaster.dismiss(t.id)
          }}
        >
          {t.action.label}
        </button>
      {/if}
      <button
        type="button"
        class="sig-toast-close"
        aria-label="Dismiss notification"
        onclick={() => toaster.dismiss(t.id)}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  :global(.sig-toaster) {
    position: fixed;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: min(22rem, calc(100vw - 2rem));
    pointer-events: none;
  }

  :global(.sig-toaster[data-position='bottom-right']) {
    bottom: 1rem;
    right: 1rem;
  }

  :global(.sig-toaster[data-position='bottom-left']) {
    bottom: 1rem;
    left: 1rem;
  }

  :global(.sig-toaster[data-position='top-right']) {
    top: 1rem;
    right: 1rem;
  }

  :global(.sig-toaster[data-position='top-left']) {
    top: 1rem;
    left: 1rem;
  }

  :global(.sig-toast) {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    padding: 0.75rem 0.875rem;
    border-radius: var(--sig-radius, 0.375rem);
    border: 1px solid var(--sig-border, #d4d4d8);
    border-left-width: 3px;
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 10px 30px rgb(0 0 0 / 0.15));
    animation: sig-toast-in 150ms ease-out;
  }

  :global(.sig-toast[data-tone='success']) {
    border-left-color: var(--sig-success, #16a34a);
  }

  :global(.sig-toast[data-tone='info']) {
    border-left-color: var(--sig-info, #2563eb);
  }

  :global(.sig-toast[data-tone='warning']) {
    border-left-color: var(--sig-warning, #d97706);
  }

  :global(.sig-toast[data-tone='danger']) {
    border-left-color: var(--sig-danger, #dc2626);
  }

  :global(.sig-toast-text) {
    flex: 1;
    min-width: 0;
  }

  :global(.sig-toast-title) {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.4;
  }

  :global(.sig-toast-desc) {
    margin: 0.125rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.4;
    color: var(--sig-muted, #71717a);
  }

  :global(.sig-toast-action) {
    flex-shrink: 0;
    font: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--sig-accent, #4f46e5);
    background: none;
    border: 0;
    padding: 0.125rem 0.25rem;
    cursor: pointer;
  }

  :global(.sig-toast-close) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    padding: 0;
    border: 0;
    border-radius: 0.25rem;
    background: none;
    color: var(--sig-muted, #71717a);
    cursor: pointer;
  }

  :global(.sig-toast-close:hover) {
    color: var(--sig-fg, #18181b);
    background: var(--sig-surface, #f4f4f5);
  }

  :global(.sig-toast-action:focus-visible),
  :global(.sig-toast-close:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }

  @keyframes sig-toast-in {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.sig-toast) {
      animation: none;
    }
  }
</style>
