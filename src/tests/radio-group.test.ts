import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/radio-fixture.svelte'

describe('RadioGroup', () => {
  it('renders radiogroup semantics and roving tabindex', () => {
    render(Fixture, { value: 'b' })
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
    expect(radios[1]).toHaveAttribute('aria-checked', 'true')
    expect(radios[1]).toHaveAttribute('tabindex', '0')
    expect(radios[0]).toHaveAttribute('tabindex', '-1')
  })

  it('puts the first item in tab order when nothing is checked', () => {
    render(Fixture)
    const radios = screen.getAllByRole('radio')
    expect(radios[0]).toHaveAttribute('tabindex', '0')
    expect(radios[1]).toHaveAttribute('tabindex', '-1')
  })

  it('selects on click', async () => {
    render(Fixture)
    const radio = screen.getByRole('radio', { name: 'Option C' })
    await fireEvent.click(radio)
    expect(radio).toHaveAttribute('aria-checked', 'true')
    expect(radio).toHaveAttribute('tabindex', '0')
  })

  it('moves and selects with arrow keys', async () => {
    render(Fixture, { value: 'a' })
    const group = screen.getByRole('radiogroup')
    screen.getByRole('radio', { name: 'Option A' }).focus()

    await fireEvent.keyDown(group, { key: 'ArrowDown' })
    const radioB = screen.getByRole('radio', { name: 'Option B' })
    expect(radioB).toHaveFocus()
    expect(radioB).toHaveAttribute('aria-checked', 'true')

    await fireEvent.keyDown(group, { key: 'ArrowUp' })
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveFocus()
  })

  it('wraps around at the ends', async () => {
    render(Fixture, { value: 'a' })
    const group = screen.getByRole('radiogroup')
    screen.getByRole('radio', { name: 'Option A' }).focus()

    await fireEvent.keyDown(group, { key: 'ArrowUp' })
    expect(screen.getByRole('radio', { name: 'Option C' })).toHaveFocus()
  })

  it('ignores unrelated keys', async () => {
    render(Fixture, { value: 'a' })
    const group = screen.getByRole('radiogroup')
    await fireEvent.keyDown(group, { key: 'x' })
    expect(screen.getByRole('radio', { name: 'Option A' })).toHaveAttribute('aria-checked', 'true')
  })
})
