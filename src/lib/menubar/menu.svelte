<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getMenubar, setMenubarMenu } from './ctx.js'

  export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  const bar = getMenubar()
  const index = bar.registerMenu()
  const items: HTMLElement[] = []

  setMenubarMenu({
    index,
    get open() {
      return bar.openIndex === index
    },
    set open(next: boolean) {
      if (next) bar.open(index)
      else if (bar.openIndex === index) bar.close()
    },
    items,
    registerItem(el: HTMLElement) {
      items.push(el)
      return {
        unregister: () => {
          const i = items.indexOf(el)
          if (i !== -1) items.splice(i, 1)
        }
      }
    },
    setTrigger(el: HTMLElement | undefined) {
      if (el) bar.registerTrigger(index, el)
    }
  })
</script>

<div class={cn('sig-menu', className)} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-menu) {
    position: relative;
    display: inline-flex;
  }
</style>
