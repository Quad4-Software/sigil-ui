// Accordion controller: click toggles, aria-expanded/controls wiring,
// single or multiple open items, arrow-key movement between triggers.
// Framework-free.

import { destroyAll, isDisabled, nextId, on } from './dom.js'

export interface AccordionOptions {
  multiple?: boolean
  onToggle?: (value: string, open: boolean) => void
}

export interface AccordionController {
  open(value: string): void
  close(value: string): void
  toggle(value: string): void
  destroy(): void
}

interface Item {
  root: HTMLElement
  trigger: HTMLElement
  content: HTMLElement
  value: string
}

export function attachAccordion(
  root: HTMLElement,
  options: AccordionOptions = {}
): AccordionController {
  const items: Item[] = [...root.querySelectorAll<HTMLElement>('.sig-acc-item')]
    .map((el, i) => {
      const trigger = el.querySelector<HTMLElement>('.sig-acc-trigger')
      const content = el.querySelector<HTMLElement>('.sig-acc-content')
      if (!trigger || !content) return null
      if (!trigger.id) trigger.id = nextId('sig-acc-trigger')
      if (!content.id) content.id = nextId('sig-acc-content')
      trigger.setAttribute('aria-controls', content.id)
      content.setAttribute('aria-labelledby', trigger.id)
      const value = el.dataset.value ?? trigger.dataset.value ?? String(i)
      return { root: el, trigger, content, value }
    })
    .filter((i): i is Item => i !== null)

  function isOpen(item: Item) {
    return item.trigger.getAttribute('aria-expanded') === 'true'
  }

  function setOpen(item: Item, open: boolean) {
    if (open && !options.multiple) {
      for (const other of items) if (other !== item && isOpen(other)) setOpen(other, false)
    }
    item.trigger.setAttribute('aria-expanded', String(open))
    item.trigger.dataset.state = open ? 'open' : 'closed'
    item.content.hidden = !open
    item.content.dataset.state = open ? 'open' : 'closed'
    item.root.dataset.state = open ? 'open' : 'closed'
    options.onToggle?.(item.value, open)
  }

  const unsubs = items.flatMap((item, i) => [
    on(item.trigger, 'click', () => {
      if (!isDisabled(item.trigger)) setOpen(item, !isOpen(item))
    }),
    on(item.trigger, 'keydown', (event) => {
      const enabled = items.filter((x) => !isDisabled(x.trigger))
      const at = enabled.indexOf(item)
      let target: Item | undefined
      if (event.key === 'ArrowDown') target = enabled[(at + 1) % enabled.length]
      else if (event.key === 'ArrowUp') target = enabled[(at - 1 + enabled.length) % enabled.length]
      else if (event.key === 'Home') target = enabled[0]
      else if (event.key === 'End') target = enabled[enabled.length - 1]
      else return
      event.preventDefault()
      target?.trigger.focus()
      void i
    })
  ])

  // ensure closed state is stamped on load
  for (const item of items) {
    if (item.trigger.getAttribute('aria-expanded') !== 'true') {
      item.trigger.setAttribute('aria-expanded', 'false')
      item.content.hidden = true
      item.content.dataset.state = 'closed'
    }
  }

  return {
    open(value) {
      const item = items.find((i) => i.value === value)
      if (item) setOpen(item, true)
    },
    close(value) {
      const item = items.find((i) => i.value === value)
      if (item) setOpen(item, false)
    },
    toggle(value) {
      const item = items.find((i) => i.value === value)
      if (item) setOpen(item, !isOpen(item))
    },
    destroy: destroyAll(...unsubs)
  }
}
