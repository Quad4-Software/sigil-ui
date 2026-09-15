// Tooltip controller: show on hover/focus, hide on leave/blur/Escape.
// aria-describedby wiring. Framework-free.

import { destroyAll, nextId, on } from './dom.js'

export interface TooltipController {
  show(): void
  hide(): void
  destroy(): void
}

export function attachTooltip(
  trigger: HTMLElement,
  tip: HTMLElement,
  options: { delay?: number } = {}
): TooltipController {
  const { delay = 300 } = options
  if (!tip.id) tip.id = nextId('sig-tip')
  tip.setAttribute('role', 'tooltip')
  trigger.setAttribute('aria-describedby', tip.id)

  let timer: ReturnType<typeof setTimeout> | undefined
  let visible = false

  function show() {
    clearTimeout(timer)
    timer = setTimeout(() => {
      tip.hidden = false
      tip.dataset.state = 'open'
      visible = true
    }, delay)
  }

  function hide() {
    clearTimeout(timer)
    tip.hidden = true
    tip.dataset.state = 'closed'
    visible = false
  }
  hide()

  const unsubs = [
    on(trigger, 'pointerenter', show),
    on(trigger, 'pointerleave', hide),
    on(trigger, 'focus', show),
    on(trigger, 'blur', hide),
    on(document, 'keydown', (event) => {
      if (event.key === 'Escape' && visible) hide()
    })
  ]

  return {
    show,
    hide,
    destroy: destroyAll(...unsubs)
  }
}
