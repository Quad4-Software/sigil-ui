import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/sheet-fixture.svelte'

describe('Sheet', () => {
  it('opens on trigger and shows a labelled modal dialog', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button', { name: 'Open sheet' }))
    const sheet = screen.getByRole('dialog')
    expect(sheet).toHaveAttribute('aria-modal', 'true')
    expect(sheet).toHaveAttribute('aria-labelledby', screen.getByText('Sheet title').id)
    expect(sheet).toHaveAttribute('data-side', 'right')
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Open sheet' })
    trigger.focus()
    await fireEvent.click(trigger)
    const sheet = screen.getByRole('dialog')
    expect(document.activeElement).toBe(sheet)
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(trigger)
  })

  it('closes when the overlay is clicked', async () => {
    render(Fixture, { open: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const overlay = document.querySelector('.sig-sheet-overlay') as HTMLElement
    await fireEvent.click(overlay)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('reflects the side prop in data-side', async () => {
    render(Fixture, { open: true, side: 'left' })
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'left')
  })
})
