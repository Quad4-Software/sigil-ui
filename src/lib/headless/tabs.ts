// Tabs controller: roving tabindex, arrow/Home/End navigation with
// auto-activation, aria wiring between [role=tab] and [role=tabpanel].
// Framework-free.

import { destroyAll, isDisabled, nextId, on } from './dom.js'

export interface TabsOptions {
  value?: string
  onValueChange?: (value: string) => void
}

export interface TabsController {
  value: string | null
  select(value: string): void
  destroy(): void
}

export function attachTabs(root: HTMLElement, options: TabsOptions = {}): TabsController {
  const list = root.querySelector<HTMLElement>('[role="tablist"]') ?? root
  const tabs = [...root.querySelectorAll<HTMLElement>('[role="tab"]')]
  const panels = [...root.querySelectorAll<HTMLElement>('[role="tabpanel"]')]

  const panelFor = (tab: HTMLElement) => {
    const id = tab.getAttribute('aria-controls')
    return id ? root.querySelector<HTMLElement>(`#${CSS.escape(id)}`) : null
  }

  // Pair tabs and panels, backfilling ids and aria wiring when absent.
  tabs.forEach((tab, i) => {
    const value = tab.dataset.value ?? String(i)
    if (!tab.id) tab.id = nextId('sig-tab')
    const panel = panels[i] ?? null
    if (panel) {
      if (!panel.id) panel.id = nextId('sig-panel')
      tab.setAttribute('aria-controls', panel.id)
      panel.setAttribute('aria-labelledby', tab.id)
    }
    tab.dataset.value = value
  })

  let current: string | null =
    options.value ??
    tabs.find((t) => t.getAttribute('aria-selected') === 'true')?.dataset.value ??
    tabs.find((t) => !isDisabled(t))?.dataset.value ??
    null

  function apply() {
    for (const tab of tabs) {
      const selected = tab.dataset.value === current
      tab.setAttribute('aria-selected', String(selected))
      tab.dataset.state = selected ? 'active' : 'inactive'
      tab.tabIndex = selected ? 0 : -1
      const panel = panelFor(tab)
      if (panel) {
        panel.hidden = !selected
        panel.dataset.state = selected ? 'active' : 'inactive'
      }
    }
  }

  function select(value: string) {
    if (value === current) return
    current = value
    apply()
    options.onValueChange?.(value)
  }

  function move(from: HTMLElement, dir: number) {
    const enabled = tabs.filter((t) => !isDisabled(t))
    const i = enabled.indexOf(from)
    const next = enabled[(i + dir + enabled.length) % enabled.length]
    if (!next) return
    next.focus()
    if (next.dataset.value) select(next.dataset.value)
  }

  const unsubs = [
    ...tabs.map((tab) =>
      on(tab, 'click', () => {
        if (!isDisabled(tab) && tab.dataset.value) select(tab.dataset.value)
      })
    ),
    on(list, 'keydown', (event) => {
      const tab = tabs.find((t) => t === event.target || t.contains(event.target as Node))
      if (!tab) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        move(tab, 1)
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        move(tab, -1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        const first = tabs.find((t) => !isDisabled(t))
        first?.focus()
        if (first?.dataset.value) select(first.dataset.value)
      } else if (event.key === 'End') {
        event.preventDefault()
        const last = [...tabs].reverse().find((t) => !isDisabled(t))
        last?.focus()
        if (last?.dataset.value) select(last.dataset.value)
      }
    })
  ]

  apply()

  return {
    get value() {
      return current
    },
    select,
    destroy: destroyAll(...unsubs)
  }
}
