<script lang="ts">
  import type { Snippet } from 'svelte'
  import { Check, Copy } from '@lucide/svelte'
  import { css, cx } from '../styled-system/css'

  let {
    title,
    children,
    class: className
  }: { title?: string; children?: Snippet; class?: string | undefined } = $props()
  let copied = $state(false)

  async function copy() {
    const text = root?.innerText ?? ''
    await navigator.clipboard.writeText(text)
    copied = true
    setTimeout(() => (copied = false), 1500)
  }

  let root = $state<HTMLElement>()
</script>

<figure
  class={cx(
    css({
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      rounded: 'sig',
      border: '1px solid',
      borderColor: 'color-mix(in oklab, var(--sig-fg) 9%, transparent)'
    }),
    className
  )}
>
  {#if title}
    <figcaption
      class={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '4',
        pt: '3',
        fontFamily: 'mono',
        fontSize: 'xs',
        color: 'sig.muted'
      })}
    >
      <span>{title}</span>
      <button
        class={css({
          display: 'inline-flex',
          cursor: 'pointer',
          border: 'none',
          bg: 'transparent',
          p: '0',
          color: 'sig.muted',
          _hover: { color: 'sig.fg' }
        })}
        aria-label="Copy code"
        onclick={copy}
      >
        {#if copied}
          <Check size={13} />
        {:else}
          <Copy size={13} />
        {/if}
      </button>
    </figcaption>
  {/if}
  <pre
    bind:this={root}
    class={css({
      flex: '1',
      overflowX: 'auto',
      p: '4',
      fontSize: 'sm',
      lineHeight: 'relaxed'
    })}>{@render children?.()}</pre>
</figure>
