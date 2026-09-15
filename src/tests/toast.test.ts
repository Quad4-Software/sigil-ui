import { fireEvent, render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Toaster, toast, toaster } from '../lib/index.js'

describe('Toaster', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    toaster.clear()
    vi.useRealTimers()
  })

  it('renders pushed toasts with a status role', async () => {
    render(Toaster)
    toast.success('Saved')
    await vi.runAllTicks()

    const el = screen.getByRole('status')
    expect(el).toHaveClass('sig-toast')
    expect(el).toHaveAttribute('data-tone', 'success')
    expect(el).toHaveTextContent('Saved')
  })

  it('uses role=alert for danger toasts', async () => {
    render(Toaster)
    toast.danger('Failed')
    await vi.runAllTicks()
    expect(screen.getByRole('alert')).toHaveAttribute('data-tone', 'danger')
  })

  it('dismisses via the close button', async () => {
    render(Toaster)
    toast('Hello')
    await vi.runAllTicks()
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    await vi.runAllTicks()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('auto-dismisses after the default duration', async () => {
    render(Toaster)
    toast('Timed')
    await vi.runAllTicks()
    expect(screen.getByRole('status')).toBeInTheDocument()
    await vi.advanceTimersByTimeAsync(6000)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('runs action callbacks and dismisses', async () => {
    render(Toaster)
    const action = vi.fn()
    toast('Deleted', { action: { label: 'Undo', onclick: action } })
    await vi.runAllTicks()
    await fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    await vi.runAllTicks()
    expect(action).toHaveBeenCalledOnce()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('pauses the timer while hovered', async () => {
    render(Toaster)
    toast('Hover me')
    await vi.runAllTicks()
    const el = screen.getByRole('status')

    await fireEvent.mouseEnter(el)
    await vi.advanceTimersByTimeAsync(6000)
    expect(el).toBeInTheDocument()

    await fireEvent.mouseLeave(el)
    await vi.advanceTimersByTimeAsync(6000)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('caps the stack at five toasts', async () => {
    render(Toaster)
    for (let i = 0; i < 7; i++) toast(`t${i}`)
    await vi.runAllTicks()
    expect(screen.getAllByRole('status')).toHaveLength(5)
  })
})
