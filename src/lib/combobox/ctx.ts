import { getContext, setContext } from 'svelte'

export interface ComboboxItem {
  el: HTMLElement
  value: string
  label: () => string
  disabled?: boolean
}

export interface ComboboxState {
  open: boolean
  query: string
  activeValue: string | null
  readonly value: string
  listId: string
  items: () => ComboboxItem[]
  registerItem: (item: ComboboxItem) => () => void
  matches: (item: ComboboxItem) => boolean
  visibleItems: () => ComboboxItem[]
  select: (item: ComboboxItem) => void
  onKeydown: (event: KeyboardEvent) => void
  onFocus: () => void
  setInput: (el: HTMLInputElement | undefined) => void
}

const KEY = 'sig-combobox'

export function setCombobox(state: ComboboxState) {
  setContext(KEY, state)
}

export function getCombobox() {
  const ctx = getContext<ComboboxState>(KEY)
  if (!ctx) throw new Error('Combobox parts must be used inside Combobox.Root')
  return ctx
}
