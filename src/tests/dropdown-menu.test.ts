import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import Fixture from './fixtures/menu-fixture.svelte'

describe('DropdownMenu', () => {
  it('opens on click and renders menu semantics', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Actions' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')

    await fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('focuses the first item and navigates with arrows', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
    const save = screen.getByRole('menuitem', { name: 'Save' })
    expect(save).toHaveFocus()

    await fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()

    await fireEvent.keyDown(screen.getByRole('menu'), { key: 'Home' })
    expect(save).toHaveFocus()
  })

  it('calls onSelect and closes on pick', async () => {
    const onSelect = vi.fn()
    render(Fixture, { onSelect })
    await fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Save' }))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await fireEvent.click(trigger)
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on Tab and ArrowUp wraps to the last item', async () => {
    render(Fixture)
    await fireEvent.click(screen.getByRole('button', { name: 'Actions' }))
    const menu = screen.getByRole('menu')

    await fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()

    await fireEvent.keyDown(menu, { key: 'Tab' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens with ArrowDown on the trigger', async () => {
    render(Fixture)
    const trigger = screen.getByRole('button', { name: 'Actions' })
    await fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })
})
