<script lang="ts">
  import { onDestroy } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import { getPaneGroupContext } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    withHandle?: boolean
    disabled?: boolean
  }

  let { withHandle = true, disabled = false, class: className, ...rest }: Props = $props()

  const ctx = getPaneGroupContext()
  const self = ctx.registerResizer({})
  onDestroy(() => ctx.unregisterResizer(self))

  const rIndex = $derived(ctx.resizers.indexOf(self))
  const before = $derived(ctx.panes[rIndex])

  let el = $state<HTMLElement>()
  let dragging = $state(false)
  let startPos = 0
  let startSizes: number[] = []

  const horizontal = $derived(ctx.direction === 'horizontal')

  function onpointerdown(event: PointerEvent) {
    if (disabled || event.button !== 0 || !el) return
    event.preventDefault()
    el.setPointerCapture?.(event.pointerId)
    dragging = true
    startPos = horizontal ? event.clientX : event.clientY
    startSizes = [...ctx.sizes]
  }

  function onpointermove(event: PointerEvent) {
    if (!dragging || !ctx.el) return
    const rect = ctx.el.getBoundingClientRect()
    const total = horizontal ? rect.width : rect.height
    if (total <= 0) return
    const pos = horizontal ? event.clientX : event.clientY
    ctx.applyDelta(rIndex, ((pos - startPos) / total) * 100, startSizes)
  }

  function onpointerup(event: PointerEvent) {
    if (!dragging) return
    dragging = false
    el?.releasePointerCapture?.(event.pointerId)
    ctx.layoutChanged()
  }

  function onkeydown(event: KeyboardEvent) {
    if (disabled) return
    const dec = horizontal ? 'ArrowLeft' : 'ArrowUp'
    const inc = horizontal ? 'ArrowRight' : 'ArrowDown'
    let delta: number
    if (event.key === dec) delta = -ctx.keyboardStep
    else if (event.key === inc) delta = ctx.keyboardStep
    else return
    event.preventDefault()
    ctx.applyDelta(rIndex, delta, [...ctx.sizes])
    ctx.layoutChanged()
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={el}
  role="separator"
  tabindex={disabled ? -1 : 0}
  aria-orientation={horizontal ? 'vertical' : 'horizontal'}
  aria-valuenow={Math.round(ctx.sizes[rIndex] ?? 0)}
  aria-valuemin={before?.minSize}
  aria-valuemax={before?.maxSize}
  aria-disabled={disabled}
  data-direction={ctx.direction}
  data-state={dragging ? 'dragging' : 'idle'}
  class={cn('sig-pane-resizer', className)}
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  {onkeydown}
  {...rest}
>
  {#if withHandle}
    <span class="sig-pane-handle" aria-hidden="true"></span>
  {/if}
</div>

<style>
  :global(.sig-pane-resizer) {
    position: relative;
    flex-shrink: 0;
    background: var(--sig-border, #d4d4d8);
    touch-action: none;
  }

  :global(.sig-pane-resizer[data-direction='horizontal']) {
    width: 1px;
    cursor: col-resize;
  }

  :global(.sig-pane-resizer[data-direction='vertical']) {
    height: 1px;
    cursor: row-resize;
  }

  :global(.sig-pane-resizer::before) {
    content: '';
    position: absolute;
    inset: -4px;
  }

  :global(.sig-pane-resizer:hover),
  :global(.sig-pane-resizer[data-state='dragging']) {
    background: var(--sig-accent, #4f46e5);
  }

  :global(.sig-pane-resizer:focus-visible) {
    outline: 2px solid var(--sig-ring, currentColor);
    outline-offset: -1px;
  }

  :global(.sig-pane-resizer[aria-disabled='true']) {
    cursor: default;
    opacity: 0.5;
  }

  :global(.sig-pane-handle) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1.5rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--sig-border, #d4d4d8);
    pointer-events: none;
  }

  :global(.sig-pane-resizer[data-direction='vertical'] .sig-pane-handle) {
    width: 0.375rem;
    height: 1.5rem;
  }

  :global(.sig-pane-resizer:hover .sig-pane-handle),
  :global(.sig-pane-resizer[data-state='dragging'] .sig-pane-handle) {
    background: var(--sig-accent-fg, #fff);
  }
</style>
