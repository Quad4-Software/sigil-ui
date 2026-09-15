// Resizable pane groups: pointer drag with capture, arrow-key resize,
// min/max clamps, aria separator values, localStorage autosave.
// Framework-free sibling of the Svelte pane system. Panes size via
// flex-grow ratios so nested groups stay valid.

import { destroyAll, on, type Unsub } from './dom.js'

export interface PaneGroupController {
  sizes(): number[]
  setSizes(sizes: number[]): void
  destroy(): void
}

interface PaneSpec {
  el: HTMLElement
  min: number
  max: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

export function attachPaneGroup(root: HTMLElement): PaneGroupController {
  const direction = root.dataset.direction === 'vertical' ? 'vertical' : 'horizontal'
  const panes: PaneSpec[] = [...root.querySelectorAll<HTMLElement>(':scope > .sig-pane')].map(
    (el) => ({
      el,
      min: Number(el.dataset.min ?? 0),
      max: Number(el.dataset.max ?? 100)
    })
  )
  const resizers = [...root.querySelectorAll<HTMLElement>(':scope > .sig-pane-resizer')]
  const saveKey = root.dataset.autosave

  let sizes: number[] = []
  try {
    const raw = saveKey ? localStorage.getItem(`sig-panes-${saveKey}`) : null
    if (raw) sizes = (JSON.parse(raw) as number[]).slice(0, panes.length)
  } catch {
    // malformed saved layout
  }
  if (sizes.length !== panes.length) {
    const declared = panes.map((p) =>
      p.el.dataset.defaultSize === undefined ? null : Number(p.el.dataset.defaultSize)
    )
    const used = declared.reduce((sum: number, s) => sum + (s ?? 0), 0)
    const rest = Math.max(100 - used, 0)
    const undeclared = declared.filter((s) => s === null).length
    sizes = declared.map((s) => s ?? (undeclared ? rest / undeclared : 0))
  }
  const total = sizes.reduce((a, b) => a + b, 0)
  if (total !== 100 && total > 0) sizes = sizes.map((s) => (s / total) * 100)

  function apply() {
    panes.forEach((pane, i) => {
      pane.el.style.flexGrow = String(sizes[i] ?? 0)
      pane.el.style.flexBasis = '0'
    })
    resizers.forEach((r, i) => {
      r.setAttribute('aria-valuenow', String(Math.round(sizes[i] ?? 0)))
      r.setAttribute('aria-valuemin', String(panes[i]?.min ?? 0))
      r.setAttribute('aria-valuemax', String(panes[i]?.max ?? 100))
    })
  }

  function persist() {
    if (!saveKey) return
    try {
      localStorage.setItem(`sig-panes-${saveKey}`, JSON.stringify(sizes))
    } catch {
      // storage unavailable
    }
  }

  // Moves delta percent of the group's size from pane rIndex+1 into rIndex,
  // honoring min/max on both sides.
  function applyDelta(rIndex: number, delta: number, base: number[]) {
    const a = panes[rIndex]
    const b = panes[rIndex + 1]
    const sizeA = base[rIndex]
    const sizeB = base[rIndex + 1]
    if (!a || !b || sizeA === undefined || sizeB === undefined) return
    const pair = sizeA + sizeB
    const next = clamp(sizeA + delta, a.min, Math.min(a.max, pair - b.min))
    sizes[rIndex] = next
    sizes[rIndex + 1] = pair - next
    apply()
    persist()
    root.dispatchEvent(new CustomEvent('siglayout', { detail: [...sizes], bubbles: true }))
  }

  const unsubs: Unsub[] = []
  resizers.forEach((resizer, i) => {
    resizer.setAttribute('role', 'separator')
    resizer.tabIndex = 0
    resizer.setAttribute('aria-orientation', direction)

    let startSizes: number[] = []
    let startPos = 0

    unsubs.push(
      on(resizer, 'pointerdown', (event) => {
        event.preventDefault()
        startSizes = [...sizes]
        startPos = direction === 'horizontal' ? event.clientX : event.clientY
        try {
          resizer.setPointerCapture(event.pointerId)
        } catch {
          // jsdom and some browsers lack pointer capture
        }
        resizer.dataset.dragging = ''
      }),
      on(resizer, 'pointermove', (event) => {
        if (!('dragging' in resizer.dataset)) return
        const pos = direction === 'horizontal' ? event.clientX : event.clientY
        const span =
          direction === 'horizontal'
            ? root.getBoundingClientRect().width
            : root.getBoundingClientRect().height
        if (!span) return
        applyDelta(i, ((pos - startPos) / span) * 100, startSizes)
      }),
      on(resizer, 'pointerup', (event) => {
        delete resizer.dataset.dragging
        try {
          resizer.releasePointerCapture(event.pointerId)
        } catch {
          // no capture held
        }
      }),
      on(resizer, 'keydown', (event) => {
        const step = event.shiftKey ? 10 : 2
        let delta = 0
        if (direction === 'horizontal') {
          if (event.key === 'ArrowLeft') delta = -step
          else if (event.key === 'ArrowRight') delta = step
        } else {
          if (event.key === 'ArrowUp') delta = -step
          else if (event.key === 'ArrowDown') delta = step
        }
        if (event.key === 'Home') delta = -(sizes[i] ?? 0) + (panes[i]?.min ?? 0)
        else if (event.key === 'End')
          delta =
            Math.min(
              panes[i]?.max ?? 100,
              (sizes[i] ?? 0) + (sizes[i + 1] ?? 0) - (panes[i + 1]?.min ?? 0)
            ) - (sizes[i] ?? 0)
        if (delta === 0) return
        event.preventDefault()
        applyDelta(i, delta, [...sizes])
      })
    )
  })

  apply()

  return {
    sizes: () => [...sizes],
    setSizes(next: number[]) {
      if (next.length !== panes.length) return
      sizes = [...next]
      apply()
      persist()
    },
    destroy: destroyAll(...unsubs)
  }
}
