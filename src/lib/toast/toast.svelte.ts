import { SvelteMap } from 'svelte/reactivity'

export type ToastTone = 'default' | 'success' | 'info' | 'warning' | 'danger'

export interface ToastAction {
  label: string
  onclick: () => void
}

export interface Toast {
  id: number
  title: string
  description?: string | undefined
  tone: ToastTone
  action?: ToastAction | undefined
}

export interface ToastInput {
  title: string
  description?: string | undefined
  action?: ToastAction | undefined
  duration?: number | undefined
}

const DEFAULT_DURATION = 5000
const MAX_TOASTS = 5

interface Timer {
  handle: ReturnType<typeof setTimeout>
  startedAt: number
  remaining: number
}

let counter = 0

export class ToasterState {
  toasts = $state<Toast[]>([])
  private timers = new SvelteMap<number, Timer>()

  push(tone: ToastTone, input: ToastInput): number {
    const id = ++counter
    const toast: Toast = {
      id,
      tone,
      title: input.title,
      description: input.description,
      action: input.action
    }
    this.toasts = [...this.toasts, toast].slice(-MAX_TOASTS)
    const duration = input.duration ?? DEFAULT_DURATION
    if (duration > 0) this.start(id, duration)
    return id
  }

  private start(id: number, ms: number) {
    this.timers.set(id, {
      handle: setTimeout(() => this.dismiss(id), ms),
      startedAt: Date.now(),
      remaining: ms
    })
  }

  pause(id: number) {
    const timer = this.timers.get(id)
    if (!timer) return
    clearTimeout(timer.handle)
    timer.remaining -= Date.now() - timer.startedAt
  }

  resume(id: number) {
    const timer = this.timers.get(id)
    if (!timer) return
    timer.startedAt = Date.now()
    timer.handle = setTimeout(() => this.dismiss(id), timer.remaining)
  }

  dismiss(id: number) {
    const timer = this.timers.get(id)
    if (timer) {
      clearTimeout(timer.handle)
      this.timers.delete(id)
    }
    this.toasts = this.toasts.filter((t) => t.id !== id)
  }

  clear() {
    for (const timer of this.timers.values()) clearTimeout(timer.handle)
    this.timers.clear()
    this.toasts = []
  }
}

export const toaster = new ToasterState()

function make(tone: ToastTone) {
  return (title: string, options: Omit<ToastInput, 'title'> = {}) =>
    toaster.push(tone, { ...options, title })
}

export const toast = Object.assign(make('default'), {
  success: make('success'),
  info: make('info'),
  warning: make('warning'),
  danger: make('danger'),
  dismiss: (id: number) => toaster.dismiss(id),
  clear: () => toaster.clear()
})
