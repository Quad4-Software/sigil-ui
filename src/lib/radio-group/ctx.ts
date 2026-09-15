import { getContext, setContext } from 'svelte'

export interface RadioGroupState {
  value: string
  disabled: boolean
  name: string
  readonly items: HTMLElement[]
  registerItem: (el: HTMLElement) => { index: () => number; unregister: () => void }
  select: (value: string) => void
}

const KEY = 'sig-radio-group'

export function setRadioGroup(state: RadioGroupState) {
  setContext(KEY, state)
}

export function getRadioGroup() {
  const ctx = getContext<RadioGroupState>(KEY)
  if (!ctx) throw new Error('RadioGroup.Item must be used inside RadioGroup.Root')
  return ctx
}
