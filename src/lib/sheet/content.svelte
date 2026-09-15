<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { trapTab } from '../utils/focus.js'
  import { getSheetContext } from './ctx.js'

  export interface Props extends HTMLAttributes<HTMLDivElement> {
    side?: 'left' | 'right' | 'top' | 'bottom'
    children?: Snippet
  }

  let { side = 'right', class: className, children, ...rest }: Props = $props()
  const ctx = getSheetContext()

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
    data-side={side}
    class={cn('sig-sheet', className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  :global(.sig-sheet) {
    position: fixed;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: var(--sig-bg, #fff);
    color: var(--sig-fg, #18181b);
    box-shadow: var(--sig-shadow, 0 10px 30px rgb(0 0 0 / 0.15));
    z-index: 51;
    overflow: auto;
  }

  :global(.sig-sheet:focus-visible) {
    outline: none;
  }

  :global(.sig-sheet[data-side='right']) {
    top: 0;
    right: 0;
    bottom: 0;
    width: min(24rem, 100vw);
    border-left: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-sheet[data-side='left']) {
    top: 0;
    left: 0;
    bottom: 0;
    width: min(24rem, 100vw);
    border-right: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-sheet[data-side='top']) {
    top: 0;
    left: 0;
    right: 0;
    max-height: 80vh;
    border-bottom: 1px solid var(--sig-border, #d4d4d8);
  }

  :global(.sig-sheet[data-side='bottom']) {
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 80vh;
    border-top: 1px solid var(--sig-border, #d4d4d8);
  }
</style>
