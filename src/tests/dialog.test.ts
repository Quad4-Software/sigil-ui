import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/dialog-fixture.svelte'

describe('Dialog', () => {
  it('opens on trigger, closes on Close', async () => {
    render(Fixture)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await fireEvent.click(screen.getByText('Open'))
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('sig-dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Title')).toHaveClass('sig-dialog-title')

    await fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('wires aria-labelledby and aria-describedby', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByText('Open'))

    const dialog = await screen.findByRole('dialog')
    const title = screen.getByText('Title')
    const desc = screen.getByText('Body')
    expect(dialog).toHaveAttribute('aria-labelledby', title.id)
    expect(dialog).toHaveAttribute('aria-describedby', desc.id)
    expect(title.id).toBeTruthy()
    expect(desc.id).toBeTruthy()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    render(Fixture)
    const trigger = screen.getByText('Open')
    trigger.focus()
    await fireEvent.click(trigger)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveFocus()

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('traps Tab inside the dialog', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByText('Open'))

    const dialog = await screen.findByRole('dialog')
    const close = screen.getByText('Close')

    close.focus()
    await fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).not.toBe(document.body)

    // Shift+Tab from the first focusable wraps to the last
    await fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(close).toHaveFocus()

    // Tab with focus outside the dialog pulls it back inside
    ;(document.body as HTMLElement).focus()
    await fireEvent.keyDown(document, { key: 'Tab' })
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('closes when the overlay is clicked and locks body scroll while open', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByText('Open'))

    expect(document.body.style.overflow).toBe('hidden')
    const overlay = document.querySelector('.sig-dialog-overlay') as HTMLElement
    await fireEvent.click(overlay)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
  })
})
