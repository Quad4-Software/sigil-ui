<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div role="separator" class={cn('sig-cm-sep', className)} {...rest}></div>

<style>
  :global(.sig-cm-sep) {
    height: 1px;
    margin: 0.25rem -0.25rem;
    background: var(--sig-border, #d4d4d8);
  }
</style>
