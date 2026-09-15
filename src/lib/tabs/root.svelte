<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { setTabsContext, type TabsContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: string
    children?: Snippet
  }

  let { value = $bindable(''), class: className, children, ...rest }: Props = $props()
  const id = $props.id()

  const ctx: TabsContext = {
    get value() {
      return value
    },
    set value(v: string) {
      value = v
    },
    baseId: id
  }
  setTabsContext(ctx)
</script>

<div class={cn('sig-tabs', className)} {...rest}>
  {@render children?.()}
</div>
