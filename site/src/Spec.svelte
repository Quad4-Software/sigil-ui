<script lang="ts">
  import type { Snippet } from 'svelte'
  import { Braces } from '@lucide/svelte'
  import { css } from '../styled-system/css'
  import ManifestPanel from './ManifestPanel.svelte'

  let {
    label,
    hint,
    for: api,
    class: className,
    children
  }: {
    label: string
    hint?: string
    // manifest component name(s) to document inside the card
    for?: string | string[]
    class?: string
    children?: Snippet
  } = $props()

  let showApi = $state(false)
</script>

<figure
  class={`${css({
    overflow: 'hidden',
    rounded: 'sig',
    border: '1px solid',
    borderColor: 'color-mix(in oklab, var(--sig-fg) 9%, transparent)',
    bg: 'sig.bg'
  })}${className ? ` ${className}` : ''}`}
>
  <figcaption
    class={css({
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: '3',
      px: '5',
      pt: '4'
    })}
  >
    <span class={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
      <span class={css({ fontSize: 'xs', fontWeight: 'medium', color: 'sig.fg' })}>{label}</span>
      {#if api}
        <button
          type="button"
          class={css({
            display: 'inline-flex',
            cursor: 'pointer',
            border: 'none',
            bg: 'transparent',
            p: '0',
            color: 'sig.muted',
            _hover: { color: 'sig.accent' }
          })}
          aria-expanded={showApi}
          aria-label="Toggle {label} API"
          onclick={() => (showApi = !showApi)}
        >
          <Braces size={13} />
        </button>
      {/if}
    </span>
    {#if hint}
      <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>{hint}</span>
    {/if}
  </figcaption>
  <div class={css({ p: '5', pt: '4' })}>
    {@render children?.()}
    {#if api && showApi}
      <div
        class={css({
          mt: '4',
          borderTop: '1px solid',
          borderColor: 'color-mix(in oklab, var(--sig-fg) 9%, transparent)',
          pt: '3'
        })}
      >
        <ManifestPanel for={api} />
      </div>
    {/if}
  </div>
</figure>
