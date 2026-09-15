import { getContext, setContext } from 'svelte'

export interface SheetContext {
  open: boolean
  readonly titleId: string
  readonly descriptionId: string
}

const KEY = 'sigil-sheet'

export function setSheetContext(ctx: SheetContext) {
  setContext(KEY, ctx)
}

export function getSheetContext(): SheetContext {
  const ctx = getContext<SheetContext>(KEY)
  if (!ctx) throw new Error('Sheet parts must be used inside Sheet.Root')
  return ctx
}
