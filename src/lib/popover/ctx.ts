import { getContext, setContext } from 'svelte'

export interface PopoverState {
  open: boolean
  id: string
  trigger: () => HTMLElement | undefined
  content: () => HTMLElement | undefined
  setTrigger: (el: HTMLElement | undefined) => void
  setContent: (el: HTMLElement | undefined) => void
}

const KEY = 'sig-popover'

export function setPopover(state: PopoverState) {
  setContext(KEY, state)
}

export function getPopover() {
  const ctx = getContext<PopoverState>(KEY)
  if (!ctx) throw new Error('Popover parts must be used inside Popover.Root')
  return ctx
}
