// Shared DOM helpers for the headless controllers. No framework imports.

export type Unsub = () => void

export function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  type: K,
  fn: (event: HTMLElementEventMap[K]) => void,
  opts?: AddEventListenerOptions
): Unsub
export function on<K extends keyof DocumentEventMap>(
  el: Document,
  type: K,
  fn: (event: DocumentEventMap[K]) => void,
  opts?: AddEventListenerOptions
): Unsub
export function on<K extends keyof WindowEventMap>(
  el: Window,
  type: K,
  fn: (event: WindowEventMap[K]) => void,
  opts?: AddEventListenerOptions
): Unsub
export function on(
  el: HTMLElement | Document | Window,
  type: string,
  fn: (event: never) => void,
  opts?: AddEventListenerOptions
): Unsub {
  el.addEventListener(type, fn as EventListener, opts)
  return () => el.removeEventListener(type, fn as EventListener, opts)
}

export function destroyAll(...fns: (Unsub | undefined)[]): () => void {
  return () => {
    for (const fn of fns) fn?.()
  }
}

let uid = 0
export function nextId(prefix: string): string {
  return `${prefix}-${++uid}`
}

export function isDisabled(el: HTMLElement): boolean {
  return el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
}

export function setHidden(el: HTMLElement, hidden: boolean) {
  el.hidden = hidden
}
