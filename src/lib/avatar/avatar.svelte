<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    src?: string
    alt?: string
    fallback?: string
  }

  let { src, alt = '', fallback = '', class: className, ...rest }: Props = $props()
  let failed = $state(false)

  const initials = $derived(
    fallback
      .split(/\s+/)
      .map((w) => w[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase()
  )
</script>

<span class={cn('sig-avatar', className)} {...rest}>
  {#if src && !failed}
    <img class="sig-avatar-img" {src} {alt} onerror={() => (failed = true)} />
  {:else}
    <span class="sig-avatar-fallback" role="img" aria-label={alt}>{initials}</span>
  {/if}
</span>

<style>
  :global(.sig-avatar) {
    display: inline-flex;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    overflow: hidden;
    background: var(--sig-surface, #f4f4f5);
    border: 1px solid var(--sig-border, #d4d4d8);
    flex-shrink: 0;
  }

  :global(.sig-avatar-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :global(.sig-avatar-fallback) {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--sig-muted, #71717a);
  }
</style>
