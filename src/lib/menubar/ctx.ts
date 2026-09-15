import { getContext, setContext } from 'svelte'

export interface MenubarState {
  openIndex: number
  readonly triggers: HTMLElement[]
  registerMenu: () => number
  registerTrigger: (index: number, el: HTMLElement) => void
  open: (index: number) => void
  close: () => void
  moveMenu: (delta: number) => void
}

export interface MenubarMenuState {
  index: number
  open: boolean
  readonly items: HTMLElement[]
  registerItem: (el: HTMLElement) => { unregister: () => void }
  setTrigger: (el: HTMLElement | undefined) => void
}

const BAR_KEY = 'sig-menubar'
const MENU_KEY = 'sig-menubar-menu'

export function setMenubar(state: MenubarState) {
  setContext(BAR_KEY, state)
}

export function getMenubar() {
  const ctx = getContext<MenubarState>(BAR_KEY)
  if (!ctx) throw new Error('Menubar parts must be used inside Menubar.Root')
  return ctx
}

export function setMenubarMenu(state: MenubarMenuState) {
  setContext(MENU_KEY, state)
}

export function getMenubarMenu() {
  const ctx = getContext<MenubarMenuState>(MENU_KEY)
  if (!ctx) throw new Error('Menubar menu parts must be used inside Menubar.Menu')
  return ctx
}
