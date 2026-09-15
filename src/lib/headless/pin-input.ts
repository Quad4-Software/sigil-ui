// Pin input controller for .sig-pin-input markup: digits auto-advance
// across .sig-pin-cell inputs, Backspace steps back, paste fills.
// Framework-free.

import { destroyAll, isDisabled, on } from './dom.js'

export interface PinInputOptions {
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
}

export interface PinInputController {
  value: string
  destroy(): void
}

export function attachPinInput(
  root: HTMLElement,
  options: PinInputOptions = {}
): PinInputController {
  const cells = [...root.querySelectorAll<HTMLInputElement>('.sig-pin-cell, input')]
  if (!cells.length) throw new Error('sigil: attachPinInput needs .sig-pin-cell inputs')

  let value = options.value ?? cells.map((c) => c.value).join('')

  function apply() {
    const digits = value.replace(/\D/g, '')
    cells.forEach((c, i) => (c.value = digits[i] ?? ''))
  }

  function emit() {
    value = cells.map((c) => c.value).join('')
    options.onChange?.(value)
    if (value.length === cells.length) options.onComplete?.(value)
  }

  const unsubs = cells.flatMap((cell, i) => [
    on(cell, 'input', () => {
      if (isDisabled(cell)) return
      cell.value = cell.value.replace(/\D/g, '').slice(-1)
      emit()
      if (cell.value && i < cells.length - 1) cells[i + 1]?.focus()
    }),
    on(cell, 'keydown', (event) => {
      if (isDisabled(cell)) return
      if (event.key === 'Backspace') {
        event.preventDefault()
        if (cell.value) {
          cell.value = ''
        } else if (i > 0) {
          cells[i - 1]?.focus()
          const prev = cells[i - 1]
          if (prev) prev.value = ''
        }
        emit()
      } else if (event.key === 'ArrowLeft' && i > 0) {
        event.preventDefault()
        cells[i - 1]?.focus()
      } else if (event.key === 'ArrowRight' && i < cells.length - 1) {
        event.preventDefault()
        cells[i + 1]?.focus()
      }
    }),
    on(cell, 'paste', (event) => {
      const digits = (event.clipboardData?.getData('text') ?? '')
        .replace(/\D/g, '')
        .slice(0, cells.length)
      if (!digits) return
      event.preventDefault()
      cells.forEach((c, j) => (c.value = digits[j] ?? ''))
      emit()
      cells[Math.min(digits.length, cells.length - 1)]?.focus()
    })
  ])

  apply()

  return {
    get value() {
      return value
    },
    set value(v: string) {
      value = v
      apply()
    },
    destroy: destroyAll(...unsubs)
  }
}
