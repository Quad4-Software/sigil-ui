import { getContext, setContext } from 'svelte'

export interface DialogContext {
  open: boolean
  readonly titleId: string
  readonly descriptionId: string
}

const KEY = 'sigil-dialog'

export function setDialogContext(ctx: DialogContext) {
  setContext(KEY, ctx)
}

export function getDialogContext(): DialogContext {
  const ctx = getContext<DialogContext>(KEY)
  if (!ctx) throw new Error('Dialog parts must be used inside Dialog.Root')
  return ctx
}
