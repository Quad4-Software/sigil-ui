<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getDialogContext } from './ctx.js'

  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getDialogContext()
</script>

{#if ctx.open}
  <div
    aria-hidden="true"
    class={cn('sig-dialog-overlay', className)}
    onclick={() => (ctx.open = false)}
    {...rest}
  ></div>
{/if}

<style>
  :global(.sig-dialog-overlay) {
    position: fixed;
    inset: 0;
    background: var(--sig-overlay, rgb(0 0 0 / 0.5));
    z-index: 50;
  }
</style>
