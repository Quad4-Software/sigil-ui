import { getContext, setContext } from 'svelte'

export type PaneDirection = 'horizontal' | 'vertical'

export interface PaneSpec {
  defaultSize?: number | undefined
  minSize: number
  maxSize: number
}

export interface PaneGroupContext {
  readonly direction: PaneDirection
  readonly keyboardStep: number
  el: HTMLElement | undefined
  readonly panes: PaneSpec[]
  readonly resizers: object[]
  readonly sizes: number[]
  registerPane(spec: PaneSpec): PaneSpec
  unregisterPane(spec: PaneSpec): void
  registerResizer(handle: object): object
  unregisterResizer(handle: object): void
  applyDelta(resizerIndex: number, deltaPct: number, base: number[]): void
  layoutChanged(): void
}

const KEY = 'sigil-pane-group'

export function setPaneGroupContext(ctx: PaneGroupContext) {
  setContext(KEY, ctx)
}

export function getPaneGroupContext(): PaneGroupContext {
  const ctx = getContext<PaneGroupContext>(KEY)
  if (!ctx) throw new Error('Pane parts must be used inside PaneGroup')
  return ctx
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
