import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/tabs-fixture.svelte'

describe('Tabs', () => {
  it('renders tablist semantics and selects the initial tab', () => {
    render(Fixture)
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    expect(tabA).toHaveAttribute('aria-selected', 'true')
    expect(tabA).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tabpanel', { name: 'Tab A' })).toBeVisible()
    expect(screen.getByText('Panel B')).not.toBeVisible()
  })

  it('switches panels on click and links tab to panel', async () => {
    render(Fixture)
    const tabB = screen.getByRole('tab', { name: 'Tab B' })
    await fireEvent.click(tabB)

    expect(tabB).toHaveAttribute('aria-selected', 'true')
    const panel = screen.getByRole('tabpanel', { name: 'Tab B' })
    expect(panel).toBeVisible()
    expect(tabB.getAttribute('aria-controls')).toBe(panel.id)
  })

  it('moves focus with arrow keys and activates the tab', async () => {
    render(Fixture)
    const list = screen.getByRole('tablist')
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    tabA.focus()

    await fireEvent.keyDown(list, { key: 'ArrowRight' })
    const tabB = screen.getByRole('tab', { name: 'Tab B' })
    expect(tabB).toHaveFocus()
    expect(tabB).toHaveAttribute('aria-selected', 'true')

    await fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus()
  })

  it('supports Home and End, skipping disabled tabs', async () => {
    render(Fixture)
    const list = screen.getByRole('tablist')
    screen.getByRole('tab', { name: 'Tab A' }).focus()

    await fireEvent.keyDown(list, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus()

    await fireEvent.keyDown(list, { key: 'Home' })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus()
  })
})
