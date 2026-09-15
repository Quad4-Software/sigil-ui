<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { trapTab } from '../utils/focus.js'
  import { getDialogContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { class: className, children, ...rest }: Props = $props()
  const ctx = getDialogContext()

  let el = $state<HTMLDivElement>()

  $effect(() => {
    if (!ctx.open || !el) return
    const node = el
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    node.focus()

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        ctx.open = false
      } else if (event.key === 'Tab') {
        trapTab(node, event)
      }
    }
    document.addEventListener('keydown', onKeydown, true)

    return () => {
      document.removeEventListener('keydown', onKeydown, true)
      document.body.style.overflow = previousOverflow
      previous?.focus?.()
    }
  })
</script>

{#if ctx.open}
  <div
    bind:this={el}
    role="dialog"
    aria-modal="true"
    aria-labelledby={ctx.titleId}
    aria-describedby={ctx.descriptionId}
    tabindex="-1"
    class={cn('sig-dialog', className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-dialog) {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(32rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    overflow: auto;
    padding: 1.5rem;
    border-radius: var(--sig-radius, 0.375rem);
    border: 1px solid var(--sig-border, #d4d4d8);
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 10px 30px rgb(0 0 0 / 0.15));
    z-index: 51;
  }

  :global(.sig-dialog:focus-visible) {
    outline: none;
  }
</style>
