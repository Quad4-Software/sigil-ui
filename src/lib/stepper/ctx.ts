import { getContext, setContext } from 'svelte'

export interface StepperState {
  step: number
  count: () => number
  register: () => number
}

const KEY = 'sig-stepper'

export function setStepper(state: StepperState) {
  setContext(KEY, state)
}

export function getStepper() {
  const ctx = getContext<StepperState>(KEY)
  if (!ctx) throw new Error('Stepper.Item must be used inside Stepper.Root')
  return ctx
}
