<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getTabsContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value: string
    children?: Snippet
  }

  let { value, class: className, children, ...rest }: Props = $props()
  const ctx = getTabsContext()
</script>

<div
  role="tabpanel"
  id="{ctx.baseId}-panel-{value}"
  aria-labelledby="{ctx.baseId}-tab-{value}"
  tabindex="0"
  hidden={ctx.value !== value}
  class={cn('sig-tabpanel', className)}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  :global(.sig-tabpanel) {
    padding-top: 1rem;
  }

  :global(.sig-tabpanel[hidden]) {
    display: none;
  }

  :global(.sig-tabpanel:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: 1px;
  }
</style>
