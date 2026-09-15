import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import ComboboxFixture from './fixtures/combobox-fixture.svelte'
import ContextMenuFixture from './fixtures/context-menu-fixture.svelte'

describe('Combobox', () => {
  it('opens on focus with combobox semantics', async () => {
    render(ComboboxFixture)
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-autocomplete', 'list')

    await fireEvent.focus(input)
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
    // the empty state must not render while options exist
    expect(screen.queryByText('No fruit')).not.toBeInTheDocument()
  })

  it('filters options while typing', async () => {
    render(ComboboxFixture)
    const input = screen.getByRole('combobox') as HTMLInputElement
    await fireEvent.focus(input)
    await fireEvent.input(input, { target: { value: 'ban' } })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Banana')
  })

  it('selects with click and mirrors the label into the input', async () => {
    const onSelect = vi.fn()
    render(ComboboxFixture, { onSelect })
    const input = screen.getByRole('combobox') as HTMLInputElement
    await fireEvent.focus(input)
    await fireEvent.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(onSelect).toHaveBeenCalledWith('cherry')
    expect(input.value).toBe('Cherry')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('selects the active option with Enter', async () => {
    const onSelect = vi.fn()
    render(ComboboxFixture, { onSelect })
    const input = screen.getByRole('combobox')
    await fireEvent.focus(input)
    // the first option is active on open so one ArrowDown lands on banana
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('banana')
  })

  it('shows the empty state when nothing matches', async () => {
    render(ComboboxFixture)
    const input = screen.getByRole('combobox')
    await fireEvent.focus(input)
    await fireEvent.input(input, { target: { value: 'zzz' } })
    expect(screen.getByText('No fruit')).toBeInTheDocument()
  })

  it('supports Home, End, ArrowUp wrap and Escape', async () => {
    render(ComboboxFixture)
    const input = screen.getByRole('combobox')
    await fireEvent.focus(input)
    const options = screen.getAllByRole('option')

    await fireEvent.keyDown(input, { key: 'End' })
    expect(input).toHaveAttribute('aria-activedescendant', options[2]?.id ?? '')

    await fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveAttribute('aria-activedescendant', options[1]?.id ?? '')

    await fireEvent.keyDown(input, { key: 'Home' })
    expect(input).toHaveAttribute('aria-activedescendant', options[0]?.id ?? '')

    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes on outside pointerdown', async () => {
    render(ComboboxFixture)
    const input = screen.getByRole('combobox')
    await fireEvent.focus(input)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})

describe('ContextMenu', () => {
  it('opens at the pointer on contextmenu', async () => {
    render(ContextMenuFixture)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await fireEvent.contextMenu(screen.getByText('Right click me'))
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveAttribute('data-disabled')
  })

  it('runs onSelect and closes on click', async () => {
    const onSelect = vi.fn()
    render(ContextMenuFixture, { onSelect })
    await fireEvent.contextMenu(screen.getByText('Right click me'))
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }))
    expect(onSelect).toHaveBeenCalled()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape and outside pointerdown', async () => {
    render(ContextMenuFixture)
    await fireEvent.contextMenu(screen.getByText('Right click me'))
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await fireEvent.contextMenu(screen.getByText('Right click me'))
    await fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('navigates items with arrows, Home and End', async () => {
    render(ContextMenuFixture)
    await fireEvent.contextMenu(screen.getByText('Right click me'))
    const menu = screen.getByRole('menu')
    const items = screen.getAllByRole('menuitem')

    expect(document.activeElement).toBe(items[0])
    await fireEvent.keyDown(menu, { key: 'ArrowDown' })
    // the disabled Paste item is skipped by keyboard nav
    expect(document.activeElement).toBe(items[2])
    await fireEvent.keyDown(menu, { key: 'End' })
    expect(document.activeElement).toBe(items[2])
    await fireEvent.keyDown(menu, { key: 'Home' })
    expect(document.activeElement).toBe(items[0])
    await fireEvent.keyDown(menu, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(items[2])
    await fireEvent.keyDown(menu, { key: 'Tab' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('ignores clicks on disabled items', async () => {
    const onSelect = vi.fn()
    render(ContextMenuFixture, { onSelect })
    await fireEvent.contextMenu(screen.getByText('Right click me'))
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Paste' }))
    expect(onSelect).not.toHaveBeenCalled()
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })
})
