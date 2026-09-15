// Dropdown menu controller: role=menu semantics, arrow/Home/End navigation,
// Escape restores focus, Tab closes, outside click closes. Framework-free.

import { destroyAll, isDisabled, nextId, on, type Unsub } from './dom.js'

export interface MenuOptions {
  trigger: HTMLElement
  content: HTMLElement
  onOpenChange?: (open: boolean) => void
}

export interface MenuController {
  open(): void
  close(): void
  destroy(): void
  isOpen(): boolean
}

export function createMenu(options: MenuOptions): MenuController {
  const { trigger, content, onOpenChange } = options
  let open = false
  let unsubs: Unsub[] = []

  if (!content.id) content.id = nextId('sig-menu')
  content.setAttribute('role', 'menu')
  trigger.setAttribute('aria-haspopup', 'menu')
  trigger.setAttribute('aria-expanded', 'false')
  trigger.setAttribute('aria-controls', content.id)

  const items = () =>
    [...content.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter((i) => !isDisabled(i))

  function setVisible(visible: boolean) {
    content.hidden = !visible
    content.dataset.state = visible ? 'open' : 'closed'
    trigger.setAttribute('aria-expanded', String(visible))
  }
  setVisible(false)

  function focusItem(item: HTMLElement | undefined) {
    item?.focus()
  }

  function show() {
    if (open) return
    open = true
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
      on(content, 'keydown', (event) => {
        const list = items()
        const at = list.indexOf(document.activeElement as HTMLElement)
        if (event.key === 'Escape') {
          event.stopPropagation()
          close()
          trigger.focus()
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          focusItem(list[(at + 1) % list.length])
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          focusItem(list[(at - 1 + list.length) % list.length])
        } else if (event.key === 'Home') {
          event.preventDefault()
          focusItem(list[0])
        } else if (event.key === 'End') {
          event.preventDefault()
          focusItem(list[list.length - 1])
        } else if (event.key === 'Tab') {
          close()
        }
      }),
      ...items().map((item) => on(item, 'click', () => close()))
    ]
    focusItem(items()[0])
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

  const unbind = [
    on(trigger, 'click', () => (open ? close() : show())),
    on(trigger, 'keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        show()
      }
    })
  ]

  return {
    open: show,
    close,
    isOpen: () => open,
    destroy: destroyAll(() => close(), ...unbind)
  }
}
