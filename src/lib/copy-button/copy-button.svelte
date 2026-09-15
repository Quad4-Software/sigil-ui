<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    text: string
    label?: string
    copiedLabel?: string
    timeout?: number
    children?: Snippet<[{ copied: boolean }]>
  }

  let {
    text,
    label = 'Copy',
    copiedLabel = 'Copied',
    timeout = 1600,
    class: className,
    children,
    onclick,
    ...rest
  }: Props = $props()

  let copied = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
    onclick?.(event)
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    copied = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied = false), timeout)
  }
</script>

<button
  type="button"
  class={cn('sig-copy', className)}
  data-copied={copied || undefined}
  onclick={copy}
  {...rest}
>
  {#if children}
    {@render children({ copied })}
  {:else}
    {copied ? copiedLabel : label}
  {/if}
</button>
<span class="sig-copy-live" role="status" aria-live="polite">
  {copied ? copiedLabel : ''}
</span>

<style>
  :global(.sig-copy) {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border: 1px solid var(--sig-border, #e4e4e7);
    border-radius: var(--sig-radius, 0.375rem);
    background: transparent;
    color: var(--sig-muted, #71717a);
    font-size: 0.75rem;
    cursor: pointer;
    transition:
      color 120ms ease,
      border-color 120ms ease;
  }

  :global(.sig-copy:hover) {
    color: var(--sig-fg, #18181b);
    border-color: var(--sig-fg, #18181b);
  }

  :global(.sig-copy[data-copied]) {
    color: var(--sig-success, #16a34a);
    border-color: var(--sig-success, #16a34a);
  }

  :global(.sig-copy:focus-visible) {
    outline: 2px solid var(--sig-ring, #4f46e5);
    outline-offset: 2px;
  }

  :global(.sig-copy-live) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>
