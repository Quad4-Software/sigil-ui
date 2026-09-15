<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getPopover } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, onclick, ...rest }: Props = $props()
  const pop = getPopover()
</script>

<button
  {@attach (node) => {
    pop.setTrigger(node)
    return () => pop.setTrigger(undefined)
  }}
  type="button"
  aria-haspopup="dialog"
  aria-expanded={pop.open}
  aria-controls={pop.id}
  data-state={pop.open ? 'open' : 'closed'}
  class={cn('sig-pop-trigger', className)}
  onclick={(event) => {
    pop.open = !pop.open
    onclick?.(event)
  }}
  {...rest}
>
  {@render children?.()}
</button>
