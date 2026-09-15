// Popover controller: anchored floating panel, outside click and Escape
// dismissal, focus restore. Framework-free.

import { destroyAll, nextId, on, type Unsub } from './dom.js'

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
export type PopoverAlign = 'start' | 'center' | 'end'

export interface PopoverOptions {
  trigger: HTMLElement
  content: HTMLElement
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  onOpenChange?: (open: boolean) => void
}

export interface PopoverController {
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean
  destroy(): void
}

export function createPopover(options: PopoverOptions): PopoverController {
  const { trigger, content, side = 'bottom', align = 'center', offset = 8, onOpenChange } = options
  let open = false
  let unsubs: Unsub[] = []

  if (!content.id) content.id = nextId('sig-pop')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-controls', content.id)
  content.dataset.side = side
  content.dataset.align = align

  function place() {
    const rect = trigger.getBoundingClientRect()
    const box = content.getBoundingClientRect()
    const sx = window.scrollX
    const sy = window.scrollY
    let x = 0
    let y = 0
    if (side === 'bottom') y = rect.bottom + sy + offset
    else if (side === 'top') y = rect.top + sy - box.height - offset
    else if (side === 'right') x = rect.right + sx + offset
    else x = rect.left + sx - box.width - offset
    if (side === 'bottom' || side === 'top') {
      if (align === 'start') x = rect.left + sx
      else if (align === 'end') x = rect.right + sx - box.width
      else x = rect.left + sx + (rect.width - box.width) / 2
    } else {
      if (align === 'start') y = rect.top + sy
      else if (align === 'end') y = rect.bottom + sy - box.height
      else y = rect.top + sy + (rect.height - box.height) / 2
    }
    content.style.position = 'absolute'
    content.style.left = `${Math.round(x)}px`
    content.style.top = `${Math.round(y)}px`
    content.style.zIndex = '50'
  }

  function setVisible(visible: boolean) {
    content.hidden = !visible
    content.dataset.state = visible ? 'open' : 'closed'
    trigger.setAttribute('aria-expanded', String(visible))
  }
  setVisible(false)

  function show() {
    if (open) return
    open = true
    setVisible(false) // unhide for measurement
    content.hidden = false
    place()
    setVisible(true)
    unsubs = [
      on(
        document,
        'pointerdown',
        (event) => {
          const t = event.target as Node
          if (!content.contains(t) && !trigger.contains(t)) close()
        },
        { capture: true }
      ),
      on(document, 'keydown', (event) => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          close()
        }
      }),
      on(window, 'resize', place),
      on(document, 'scroll', place, { capture: true })
    ]
    onOpenChange?.(true)
  }

  function close() {
    if (!open) return
    open = false
    for (const u of unsubs) u()
    unsubs = []
    setVisible(false)
    onOpenChange?.(false)
  }

  const unbind = on(trigger, 'click', () => (open ? close() : show()))

  return {
    open: show,
    close,
    toggle() {
      if (open) close()
      else show()
    },
    isOpen: () => open,
    destroy: destroyAll(() => close(), unbind)
  }
}
