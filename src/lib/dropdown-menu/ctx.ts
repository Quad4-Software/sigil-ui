import { getContext, setContext } from 'svelte'

export interface MenuState {
  open: boolean
  id: string
  trigger: () => HTMLElement | undefined
  setTrigger: (el: HTMLElement | undefined) => void
  items: () => HTMLElement[]
  registerItem: (el: HTMLElement) => () => void
}

const KEY = 'sig-menu'

export function setMenu(state: MenuState) {
  setContext(KEY, state)
}

export function getMenu() {
  const ctx = getContext<MenuState>(KEY)
  if (!ctx) throw new Error('DropdownMenu parts must be used inside DropdownMenu.Root')
  return ctx
}
