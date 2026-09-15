<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    label?: string
    children?: Snippet
  }

  let { label = 'Breadcrumb', class: className, children, ...rest }: Props = $props()
</script>

<nav aria-label={label} class={cn('sig-breadcrumb', className)} {...rest}>
  <ol class="sig-crumbs">
    {@render children?.()}
  </ol>
</nav>

<style>
  :global(.sig-breadcrumb .sig-crumbs) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.875rem;
    color: var(--sig-muted, #71717a);
  }
</style>
