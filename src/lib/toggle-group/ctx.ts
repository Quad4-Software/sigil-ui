import { getContext, setContext } from 'svelte'

export interface ToggleGroupState {
  readonly type: 'single' | 'multiple'
  readonly disabled: boolean
  readonly items: HTMLElement[]
  isPressed: (value: string) => boolean
  toggle: (value: string) => void
  registerItem: (el: HTMLElement) => { unregister: () => void }
}

const KEY = 'sig-toggle-group'

export function setToggleGroup(state: ToggleGroupState) {
  setContext(KEY, state)
}

export function getToggleGroup() {
  const ctx = getContext<ToggleGroupState>(KEY)
  if (!ctx) throw new Error('ToggleGroup.Item must be used inside ToggleGroup.Root')
  return ctx
}
