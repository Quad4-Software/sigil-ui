import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/accordion-fixture.svelte'

describe('Accordion', () => {
  it('expands an item on click and wires aria', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Section A' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const region = screen.getByRole('region', { name: 'Section A' })
    expect(region).toBeVisible()
    expect(trigger.getAttribute('aria-controls')).toBe(region.id)
  })

  it('collapses the previous item when multiple is off', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button', { name: 'Section A' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Section B' }))

    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
    expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('keeps both items open when multiple is on', async () => {
    render(Fixture, { multiple: true })
    await fireEvent.click(screen.getByRole('button', { name: 'Section A' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Section B' }))

    expect(screen.getByRole('button', { name: 'Section A' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Section B' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('closes an open item on second click', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Section A' })
    await fireEvent.click(trigger)
    await fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
