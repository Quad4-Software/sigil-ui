<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getMenu } from './ctx.js'

  export interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    children?: Snippet
  }

  let { class: className, children, onclick, onkeydown, ...rest }: Props = $props()
  const menu = getMenu()
</script>

<button
  {@attach (node) => {
    menu.setTrigger(node)
    return () => menu.setTrigger(undefined)
  }}
  type="button"
  aria-haspopup="menu"
  aria-expanded={menu.open}
  aria-controls={menu.id}
  data-state={menu.open ? 'open' : 'closed'}
  class={cn('sig-menu-trigger', className)}
  onclick={(event) => {
    menu.open = !menu.open
    onclick?.(event)
  }}
  onkeydown={(event) => {
    // ArrowDown opens the menu per the menu button pattern.
    if ((event.key === 'ArrowDown' || event.key === 'Enter') && !menu.open) {
      event.preventDefault()
      menu.open = true
    }
    onkeydown?.(event)
  }}
  {...rest}
>
  {@render children?.()}
</button>
