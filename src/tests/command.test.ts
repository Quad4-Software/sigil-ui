import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import Fixture from './fixtures/command-fixture.svelte'
import DialogFixture from './fixtures/command-dialog-fixture.svelte'

describe('Command', () => {
  it('renders combobox semantics and options', () => {
    render(Fixture)
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(4)
    expect(screen.getByRole('option', { name: 'Disabled Action' })).toHaveAttribute(
      'aria-disabled',
      'true'
    )
    // the empty state must not render while items exist
    expect(screen.queryByText('Nothing here')).not.toBeInTheDocument()
  })

  it('filters items by query and keywords', async () => {
    render(Fixture)
    const input = screen.getByRole('combobox')
    await fireEvent.input(input, { target: { value: 'focus' } })
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Zen Mode')

    await fireEvent.input(input, { target: { value: 'zzz' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('navigates with arrows and selects with Enter', async () => {
    const onSelect = vi.fn()
    render(Fixture, { onSelect })
    const input = screen.getByRole('combobox')

    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('open')
  })

  it('keeps disabled items out of keyboard selection', async () => {
    const onSelect = vi.fn()
    render(Fixture, { onSelect })
    const input = screen.getByRole('combobox')
    await fireEvent.input(input, { target: { value: 'disabled' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    // the only match is disabled so no selection fires
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('loops on ArrowUp, jumps with Home and End, and selects on click', async () => {
    const onSelect = vi.fn()
    render(Fixture, { onSelect })
    const input = screen.getByRole('combobox')

    // first item is active by default; ArrowUp loops to the last
    await fireEvent.keyDown(input, { key: 'ArrowUp' })
    await fireEvent.keyDown(input, { key: 'Home' })
    await fireEvent.keyDown(input, { key: 'End' })
    await fireEvent.keyDown(input, { key: 'Enter' })
    // the last enabled item is Zen Mode since Disabled is skipped
    expect(onSelect).toHaveBeenCalledWith('zen')

    await fireEvent.click(screen.getByRole('option', { name: 'New File' }))
    expect(onSelect).toHaveBeenCalledWith('new')
  })
})

describe('Command.Dialog', () => {
  it('opens on mod+k and closes on Escape', async () => {
    render(DialogFixture)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
