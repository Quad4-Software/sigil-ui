import { getContext, setContext } from 'svelte'

export interface HoverCardState {
  open: boolean
  id: string
  scheduleOpen: () => void
  scheduleClose: () => void
  cancelClose: () => void
}

const KEY = 'sig-hover-card'

export function setHoverCard(state: HoverCardState) {
  setContext(KEY, state)
}

export function getHoverCard() {
  const ctx = getContext<HoverCardState>(KEY)
  if (!ctx) throw new Error('HoverCard parts must be used inside HoverCard.Root')
  return ctx
}
