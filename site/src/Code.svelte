<script lang="ts">
  import type { Snippet } from 'svelte'
  import { css } from '../styled-system/css'

  let { title, children }: { title?: string; children?: Snippet } = $props()
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
  class={css({
    overflow: 'hidden',
    rounded: 'sig',
    border: '1px solid',
    borderColor: 'sig.border'
  })}
>
  {#if title}
    <figcaption
      class={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid',
        borderColor: 'sig.border',
        bg: 'sig.surface',
        px: '3',
        py: '1.5',
        fontSize: 'xs',
        color: 'sig.muted'
      })}
    >
      <span>{title}</span>
      <button
        class={css({ cursor: 'pointer', fontSize: 'xs', _hover: { color: 'sig.fg' } })}
        onclick={copy}
      >
        {copied ? 'copied' : 'copy'}
      </button>
    </figcaption>
  {/if}
  <pre
    bind:this={root}
    class={css({
      overflowX: 'auto',
      bg: 'sig.surface',
      p: '4',
      fontSize: 'sm',
      lineHeight: '6'
    })}>{@render children?.()}</pre>
</figure>
