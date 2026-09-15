<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLLiAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  export interface Props extends Omit<HTMLLiAttributes, 'children'> {
    current?: boolean
    children?: Snippet
  }

  let { current = false, class: className, children, ...rest }: Props = $props()
</script>

<li
  class={cn('sig-crumb', className)}
  aria-current={current ? 'page' : undefined}
  data-current={current ? '' : undefined}
  {...rest}
>
  {@render children?.()}
</li>

<style>
  :global(.sig-breadcrumb .sig-crumb) {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  :global(.sig-breadcrumb .sig-crumb + .sig-crumb::before) {
    content: '/';
    margin-right: 0.25rem;
    color: var(--sig-border, #d4d4d8);
  }

  :global(.sig-breadcrumb .sig-crumb[data-current]) {
    color: var(--sig-fg, #18181b);
    font-weight: 500;
  }

  :global(.sig-breadcrumb .sig-crumb a) {
    color: inherit;
    text-decoration: none;
  }

  :global(.sig-breadcrumb .sig-crumb a:hover) {
    color: var(--sig-fg, #18181b);
    text-decoration: underline;
  }
</style>
