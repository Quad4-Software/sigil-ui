<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLTableAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLTableAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<div class="sig-table-wrap">
  <table class={cn('sig-table', className)} {...rest}>
    {@render children?.()}
  </table>
</div>

<style>
  :global(.sig-table-wrap) {
    overflow-x: auto;
    border: 1px solid var(--sig-border, #d4d4d8);
    border-radius: var(--sig-radius, 0.375rem);
  }

  :global(.sig-table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    color: var(--sig-fg, #18181b);
    text-align: left;
  }
</style>
