<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getAccordionContext, getAccordionItemContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const root = getAccordionContext()
  const item = getAccordionItemContext()
</script>

<div
  role="region"
  id={item.contentId}
  aria-labelledby={item.triggerId}
  hidden={!root.expanded.has(item.value)}
  class={cn('sig-acc-content', className)}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  :global(.sig-acc-content) {
    padding-bottom: 0.875rem;
    color: var(--sig-muted, #71717a);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :global(.sig-acc-content[hidden]) {
    display: none;
  }
</style>
