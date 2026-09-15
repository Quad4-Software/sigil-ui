// Shared open/close behavior for Dialog and Sheet: focus trap, Escape,
// overlay click, scroll lock, focus restore. Framework-free.

import { trapTab } from '../utils/focus.js'
import { destroyAll, nextId, on, type Unsub } from './dom.js'

export interface OverlayOptions {
  trigger?: HTMLElement | null
  content: HTMLElement
  overlay?: HTMLElement | null
  onOpenChange?: (open: boolean) => void
}

export interface OverlayController {
  open(): void
  close(): void
  toggle(): void
  isOpen(): boolean
  destroy(): void
}

export function createOverlay(options: OverlayOptions): OverlayController {
  const { trigger, content, overlay, onOpenChange } = options
  let open = false
  let restoreTo: Element | null = null
  let unsubs: Unsub[] = []

  if (!content.id) content.id = nextId('sig-overlay')
  trigger?.setAttribute('aria-haspopup', 'dialog')
  trigger?.setAttribute('aria-expanded', 'false')
  if (content.id) trigger?.setAttribute('aria-controls', content.id)

  function setVisible(visible: boolean) {
    content.hidden = !visible
    content.dataset.state = visible ? 'open' : 'closed'
    if (overlay) {
      overlay.hidden = !visible
      overlay.dataset.state = visible ? 'open' : 'closed'
    }
    trigger?.setAttribute('aria-expanded', String(visible))
  }
  setVisible(false)

  function activate() {
    const target =
      content.querySelector<HTMLElement>('[autofocus], [data-sig-autofocus]') ??
      content.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) ??
      content
    if (!content.hasAttribute('tabindex')) content.tabIndex = -1
    target.focus()
  }

  function show() {
    if (open) return
    open = true
    restoreTo = document.activeElement
    setVisible(true)
    document.body.style.overflow = 'hidden'
    activate()
    unsubs = [
      on(
        document,
        'keydown',
        (event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            close()
          } else if (event.key === 'Tab') {
            trapTab(content, event)
          }
        },
        { capture: true }
      ),
      ...(overlay ? [on(overlay, 'click', () => close())] : []),
      ...[...content.querySelectorAll<HTMLElement>('[data-sig-close]')].map((el) =>
        on(el, 'click', () => close())
      )
    ]
    onOpenChange?.(true)
  }

  function close() {
    if (!open) return
    open = false
    for (const u of unsubs) u()
    unsubs = []
    setVisible(false)
    document.body.style.overflow = ''
    if (restoreTo instanceof HTMLElement) restoreTo.focus()
    onOpenChange?.(false)
  }

  const unbind = [trigger ? on(trigger, 'click', () => (open ? close() : show())) : undefined]

  return {
    open: show,
    close,
    toggle() {
      if (open) close()
      else show()
    },
    isOpen: () => open,
    destroy: destroyAll(() => close(), ...unbind)
  }
}
