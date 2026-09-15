// Number input controller for .sig-number-input markup: stepper buttons
// and a .sig-number-field input, clamped to min/max/step. Framework-free.

import { destroyAll, isDisabled, on } from './dom.js'

export interface NumberInputOptions {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

export interface NumberInputController {
  value: number
  destroy(): void
}

export function attachNumberInput(
  root: HTMLElement,
  options: NumberInputOptions = {}
): NumberInputController {
  const found = root.querySelector<HTMLInputElement>('.sig-number-field, input')
  if (!found) throw new Error('sigil: attachNumberInput needs an input inside .sig-number-input')
  const input = found
  const min =
    options.min ??
    (input.getAttribute('aria-valuemin') || input.min
      ? Number(input.getAttribute('aria-valuemin') ?? input.min)
      : undefined)
  const max =
    options.max ??
    (input.getAttribute('aria-valuemax') || input.max
      ? Number(input.getAttribute('aria-valuemax') ?? input.max)
      : undefined)
  const step = options.step ?? Number(input.step || 1)
  let value = options.value ?? Number(input.value || 0)

  const clamp = (n: number) => {
    let v = n
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    return v
  }

  function apply() {
    input.value = String(value)
    input.setAttribute('aria-valuenow', String(value))
  }

  function commit(n: number) {
    if (Number.isNaN(n)) {
      apply()
      return
    }
    value = clamp(n)
    apply()
    options.onChange?.(value)
  }

  const bump = (dir: 1 | -1) => commit((Number(input.value) || 0) + dir * step)

  const unsubs = [
    ...[...root.querySelectorAll<HTMLElement>('.sig-number-dec')].map((b) =>
      on(b, 'click', () => !isDisabled(root) && bump(-1))
    ),
    ...[...root.querySelectorAll<HTMLElement>('.sig-number-inc')].map((b) =>
      on(b, 'click', () => !isDisabled(root) && bump(1))
    ),
    on(input, 'blur', () => commit(Number(input.value))),
    on(input, 'keydown', (event) => {
      if (event.key === 'Enter') commit(Number(input.value))
      else if (event.key === 'ArrowUp') {
        event.preventDefault()
        bump(1)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        bump(-1)
      }
    })
  ]

  apply()

  return {
    get value() {
      return value
    },
    set value(v: number) {
      value = clamp(v)
      apply()
    },
    destroy: destroyAll(...unsubs)
  }
}
