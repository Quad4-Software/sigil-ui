// Switch controller for button[role=switch]. Framework-free.

import { destroyAll, isDisabled, on } from './dom.js'

export interface SwitchController {
  checked: boolean
  destroy(): void
}

export function attachSwitch(
  el: HTMLElement,
  options: { checked?: boolean; onChange?: (checked: boolean) => void } = {}
): SwitchController {
  let checked = options.checked ?? el.getAttribute('aria-checked') === 'true'
  el.setAttribute('role', 'switch')

  function apply() {
    el.setAttribute('aria-checked', String(checked))
    el.dataset.state = checked ? 'checked' : 'unchecked'
  }

  const unsubs = [
    on(el, 'click', () => {
      if (isDisabled(el)) return
      checked = !checked
      apply()
      options.onChange?.(checked)
    })
  ]

  apply()

  return {
    get checked() {
      return checked
    },
    set checked(value: boolean) {
      checked = value
      apply()
    },
    destroy: destroyAll(...unsubs)
  }
}
