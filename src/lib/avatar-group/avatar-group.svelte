<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import Avatar from '../avatar/avatar.svelte'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    items?: { src?: string; alt?: string; fallback?: string }[]
    max?: number
    children?: Snippet
  }

  let { items = [], max, class: className, children, ...rest }: Props = $props()

  const visible = $derived(max !== undefined ? items.slice(0, max) : items)
  const overflow = $derived(max !== undefined ? items.length - visible.length : 0)
</script>

<div class={cn('sig-avatar-group', className)} {...rest}>
  {#if children}
    {@render children()}
  {:else}
    {#each visible as item, i (i)}
      <Avatar src={item.src} alt={item.alt ?? ''} fallback={item.fallback ?? item.alt ?? ''} />
    {/each}
    {#if overflow > 0}
      <span class="sig-avatar-overflow" aria-label="{overflow} more">+{overflow}</span>
    {/if}
  {/if}
</div>

<style>
  :global(.sig-avatar-group) {
    display: inline-flex;
    align-items: center;
  }

  :global(.sig-avatar-group .sig-avatar) {
    margin-left: -0.625rem;
    border: 2px solid var(--sig-bg, #fff);
  }

  :global(.sig-avatar-group .sig-avatar:first-child) {
    margin-left: 0;
  }

  :global(.sig-avatar-overflow) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-left: -0.625rem;
    border-radius: 9999px;
    border: 2px solid var(--sig-bg, #fff);
    background: var(--sig-surface, #f4f4f5);
    color: var(--sig-muted, #71717a);
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
