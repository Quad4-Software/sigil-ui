import { getContext, setContext } from 'svelte'

export interface CommandItem {
  el: HTMLElement
  value: string
  keywords: string[]
  disabled?: boolean | undefined
  onSelect?: (() => void) | undefined
}

export interface CommandState {
  query: string
  activeValue: string | null
  value: string
  listId: string
  items: () => CommandItem[]
  registerItem: (item: CommandItem) => () => void
  matches: (item: CommandItem) => boolean
  visibleItems: () => CommandItem[]
  select: (item: CommandItem) => void
  onKeydown: (event: KeyboardEvent) => void
}

const KEY = 'sig-command'

export function setCommand(state: CommandState) {
  setContext(KEY, state)
}

export function getCommand() {
  const ctx = getContext<CommandState>(KEY)
  if (!ctx) throw new Error('Command parts must be used inside Command.Root')
  return ctx
}
