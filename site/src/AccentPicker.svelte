<script lang="ts">
  import { Check, RotateCcw } from '@lucide/svelte'
  import { css } from '../styled-system/css'
  import { flex } from '../styled-system/patterns'

  interface Props {
    accent: string | undefined
    onaccent: (value: string | undefined) => void
  }

  let { accent, onaccent }: Props = $props()

  const presets = [
    { name: 'indigo', value: '#4f46e5' },
    { name: 'blue', value: '#2563eb' },
    { name: 'cyan', value: '#0891b2' },
    { name: 'emerald', value: '#059669' },
    { name: 'amber', value: '#d97706' },
    { name: 'orange', value: '#ea580c' },
    { name: 'red', value: '#dc2626' },
    { name: 'rose', value: '#e11d48' },
    { name: 'violet', value: '#7c3aed' }
  ]

  const current = $derived(accent ?? '#4f46e5')

  const circle = css({
    w: '6',
    h: '6',
    rounded: 'full',
    border: '2px solid',
    borderColor: 'sig.bg',
    cursor: 'pointer',
    p: '0',
    display: 'inline-grid',
    placeItems: 'center',
    color: 'white',
    transition: 'transform 120ms',
    _hover: { transform: 'scale(1.15)', zIndex: '1' },
    _focusVisible: { outline: '2px solid', outlineColor: 'sig.ring', outlineOffset: '1px' }
  })
</script>

<div class={flex({ alignItems: 'center', gap: '3' })} role="group" aria-label="Accent color">
  <div class={flex({ alignItems: 'center' })}>
    {#each presets as preset, i (preset.value)}
      <button
        type="button"
        class={circle}
        style="background: {preset.value}; margin-left: {i === 0 ? '0' : '-0.375rem'}"
        aria-label="{preset.name} accent"
        aria-pressed={accent === preset.value}
        title={preset.name}
        onclick={() => onaccent(preset.value)}
      >
        {#if accent === preset.value}
          <Check size={12} strokeWidth={3} />
        {/if}
      </button>
    {/each}
  </div>
  <label class={flex({ alignItems: 'center', gap: '2', fontSize: 'xs', color: 'sig.muted' })}>
    custom
    <input
      type="color"
      value={current}
      oninput={(e) => onaccent(e.currentTarget.value)}
      class={css({
        w: '7',
        h: '7',
        p: '0',
        border: '1px solid',
        borderColor: 'sig.border',
        rounded: 'sig',
        bg: 'transparent',
        cursor: 'pointer'
      })}
      aria-label="Custom accent color"
    />
  </label>
  {#if accent}
    <button
      type="button"
      class={css({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1',
        fontSize: 'xs',
        color: 'sig.muted',
        bg: 'transparent',
        border: 'none',
        cursor: 'pointer',
        p: '0',
        _hover: { color: 'sig.fg' }
      })}
      onclick={() => onaccent(undefined)}
    >
      <RotateCcw size={11} /> reset
    </button>
  {/if}
</div>
