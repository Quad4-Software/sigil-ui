<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getCombobox } from './ctx.js'

  export interface Props extends Omit<HTMLInputAttributes, 'value' | 'role' | 'type'> {
    placeholder?: string
  }

  let {
    placeholder = 'Search...',
    class: className,
    oninput,
    onkeydown,
    onfocus,
    ...rest
  }: Props = $props()

  const combo = getCombobox()
  let el: HTMLInputElement | undefined = $state()

  $effect(() => {
    combo.setInput(el)
    return () => combo.setInput(undefined)
  })
</script>

<input
  bind:this={el}
  type="text"
  role="combobox"
  aria-expanded={combo.open}
  aria-controls={combo.listId}
  aria-autocomplete="list"
  aria-activedescendant={combo.activeValue
    ? `${combo.listId}-item-${combo.activeValue}`
    : undefined}
  autocomplete="off"
  spellcheck="false"
  {placeholder}
  class={cn('sig-input', 'sig-combobox-input', className)}
  oninput={(event) => {
    combo.query = event.currentTarget.value
    oninput?.(event)
  }}
  onfocus={(event) => {
    combo.onFocus()
    onfocus?.(event)
  }}
  onkeydown={(event) => {
    onkeydown?.(event)
    if (!event.defaultPrevented) combo.onKeydown(event)
  }}
  {...rest}
/>
