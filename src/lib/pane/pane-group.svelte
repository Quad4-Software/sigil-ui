<script lang="ts">
  import { PersistedState } from 'runed'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { cn } from '../utils/cn.js'
  import {
    clamp,
    setPaneGroupContext,
    type PaneDirection,
    type PaneGroupContext,
    type PaneSpec
  } from './ctx.js'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    direction?: PaneDirection
    autoSaveId?: string | undefined
    keyboardStep?: number
    onLayout?: ((sizes: number[]) => void) | undefined
    children?: Snippet
  }

  let {
    direction = 'horizontal',
    autoSaveId,
    keyboardStep = 5,
    onLayout,
    class: className,
    children,
    ...rest
  }: Props = $props()

  let el = $state<HTMLElement>()
  const panes = $state<PaneSpec[]>([])
  const resizers = $state<object[]>([])
  let sizes = $state<number[]>([])

  const getSaveId = () => autoSaveId
  const persisted = getSaveId()
    ? new PersistedState<number[]>(`sigil-panes-${getSaveId()}`, [])
    : null

  const ctx: PaneGroupContext = {
    get direction() {
      return direction
    },
    get keyboardStep() {
      return keyboardStep
    },
    panes,
    resizers,
    get el() {
      return el
    },
    set el(v) {
      el = v
    },
    get sizes() {
      return sizes
    },
    registerPane(spec) {
      panes.push(spec)
      return panes[panes.length - 1] as PaneSpec
    },
    unregisterPane(spec) {
      const i = panes.indexOf(spec)
      if (i !== -1) panes.splice(i, 1)
    },
    registerResizer(handle) {
      resizers.push(handle)
      return resizers[resizers.length - 1] as object
    },
    unregisterResizer(handle) {
      const i = resizers.indexOf(handle)
      if (i !== -1) resizers.splice(i, 1)
    },
    applyDelta(rIndex, deltaPct, base) {
      const a = panes[rIndex]
      const b = panes[rIndex + 1]
      const sizeA = base[rIndex]
      const sizeB = base[rIndex + 1]
      if (!a || !b || sizeA === undefined || sizeB === undefined) return
      const pair = sizeA + sizeB
      const lo = Math.max(a.minSize, pair - b.maxSize)
      const hi = Math.min(a.maxSize, pair - b.minSize)
      const next = clamp(sizeA + deltaPct, lo, hi)
      sizes[rIndex] = next
      sizes[rIndex + 1] = pair - next
    },
    layoutChanged() {
      onLayout?.([...sizes])
      if (persisted) persisted.current = [...sizes]
    }
  }
  setPaneGroupContext(ctx)

  $effect(() => {
    const n = panes.length
    if (n === 0 || sizes.length === n) return

    const saved = persisted?.current
    if (saved && saved.length === n && saved.every((s) => s > 0)) {
      sizes = [...saved]
      return
    }

    const remaining = panes.reduce((sum, p) => sum + (p.defaultSize ?? 0), 0)
    const unspecified = panes.filter((p) => p.defaultSize === undefined).length
    const fallback = unspecified > 0 ? Math.max(0, (100 - remaining) / unspecified) : 0
    const raw = panes.map((p) => p.defaultSize ?? fallback)
    const total = raw.reduce((a, b) => a + b, 0)
    sizes = total === 100 ? raw : raw.map((s) => (s / total) * 100)
  })
</script>

<div bind:this={el} class={cn('sig-pane-group', className)} data-direction={direction} {...rest}>
  {@render children?.()}
</div>

<style>
  /* No width/height defaults: unlayered styles beat layered utility classes
     (Tailwind, Panda, UnoCSS), so a hardcoded 100% would make size utilities
     like h-48 unoverridable. Root groups get size from the consumer; nested
     groups fill their pane via .sig-pane > .sig-pane-group. */
  :global(.sig-pane-group) {
    display: flex;
    overflow: hidden;
  }

  :global(.sig-pane-group[data-direction='horizontal']) {
    flex-direction: row;
  }

  :global(.sig-pane-group[data-direction='vertical']) {
    flex-direction: column;
  }
</style>
