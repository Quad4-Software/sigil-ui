<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getAccordionContext, setAccordionItemContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value: string
    children?: Snippet
  }

  let { value, class: className, children, ...rest }: Props = $props()
  const root = getAccordionContext()

  const expanded = $derived(root.expanded.has(value))
  setAccordionItemContext({
    get value() {
      return value
    },
    get triggerId() {
      return `${root.baseId}-trigger-${value}`
    },
    get contentId() {
      return `${root.baseId}-content-${value}`
    }
  })
</script>

<div class={cn('sig-acc-item', className)} data-state={expanded ? 'open' : 'closed'} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-acc-item) {
    border-bottom: 1px solid var(--sig-border, #d4d4d8);
  }
</style>
