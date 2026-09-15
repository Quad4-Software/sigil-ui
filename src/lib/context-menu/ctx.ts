import { getContext, setContext } from 'svelte'

export interface ContextMenuState {
  open: boolean
  readonly x: number
  readonly y: number
  items: () => HTMLElement[]
  registerItem: (el: HTMLElement) => () => void
}

const KEY = 'sig-context-menu'

export function setContextMenu(state: ContextMenuState) {
  setContext(KEY, state)
}

export function getContextMenu() {
  const ctx = getContext<ContextMenuState>(KEY)
  if (!ctx) throw new Error('ContextMenu parts must be used inside ContextMenu.Root')
  return ctx
}
