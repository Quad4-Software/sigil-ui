<script lang="ts">
  import type { Snippet } from 'svelte'
  import { css } from '../styled-system/css'

  let {
    label,
    hint,
    class: className,
    children
  }: { label: string; hint?: string; class?: string; children?: Snippet } = $props()
</script>

<figure
  class={`${css({
    overflow: 'hidden',
    rounded: 'sig',
    border: '1px solid',
    borderColor: 'sig.border',
    bg: 'sig.bg',
    transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
    _hover: { transform: 'translateY(-2px)', boxShadow: 'md', borderColor: 'sig.accent' }
  })}${className ? ` ${className}` : ''}`}
>
  <figcaption
    class={css({
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: '3',
      borderBottom: '1px solid',
      borderColor: 'sig.border',
      bg: 'sig.surface',
      px: '4',
      py: '2'
    })}
  >
    <span class={css({ fontSize: 'xs', fontWeight: 'medium', color: 'sig.fg' })}>{label}</span>
    {#if hint}
      <span class={css({ fontSize: 'xs', color: 'sig.muted' })}>{hint}</span>
    {/if}
  </figcaption>
  <div class={css({ p: '5' })}>
    {@render children?.()}
  </div>
</figure>
