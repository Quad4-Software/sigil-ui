<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setAccordionContext, type AccordionContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    multiple?: boolean
    children?: Snippet
  }

  let { multiple = false, class: className, children, ...rest }: Props = $props()
  const id = $props.id()

  const expanded = new SvelteSet<string>()

  const ctx: AccordionContext = {
    get multiple() {
      return multiple
    },
    baseId: id,
    expanded,
    toggle(value: string) {
      if (expanded.has(value)) {
        expanded.delete(value)
      } else {
        if (!multiple) expanded.clear()
        expanded.add(value)
      }
    }
  }
  setAccordionContext(ctx)
</script>

<div class={cn('sig-accordion', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-accordion) {
    display: flex;
    flex-direction: column;
  }
</style>
