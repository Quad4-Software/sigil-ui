<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()

  function onkeydown(event: KeyboardEvent) {
    const list = event.currentTarget as HTMLElement
    const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])')]
    const index = tabs.indexOf(document.activeElement as HTMLElement)
    if (index === -1) return

    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return

    const target = tabs[next]
    if (!target) return
    event.preventDefault()
    target.focus()
    target.click()
  }
</script>

<div role="tablist" class={cn('sig-tablist', className)} {onkeydown} {...rest}>
  {@render children?.()}
</div>

<style>
  :global(.sig-tablist) {
    display: inline-flex;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: var(--sig-radius, 0.375rem);
    background: var(--sig-surface, #f4f4f5);
  }
</style>
