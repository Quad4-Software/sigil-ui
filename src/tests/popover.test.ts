import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/popover-fixture.svelte'

describe('Popover', () => {
  it('opens on trigger click with aria wiring', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Open popover' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const content = screen.getByRole('dialog')
    expect(content.id).toBe(trigger.getAttribute('aria-controls'))
  })

  it('closes on Escape and restores focus', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Open popover' })
    await fireEvent.click(trigger)
    screen.getByRole('button', { name: 'inside' }).focus()

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on outside pointer down but not inside clicks', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button', { name: 'Open popover' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await fireEvent.pointerDown(screen.getByRole('dialog'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await fireEvent.pointerDown(screen.getByTestId('outside'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ignores non-Escape keys', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button', { name: 'Open popover' }))
    await fireEvent.keyDown(document, { key: 'Enter' })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
