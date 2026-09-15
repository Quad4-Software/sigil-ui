import { fireEvent, render, screen } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../lib/button/index.js'
import { Editable } from '../lib/editable/index.js'
import { NumberInput } from '../lib/number-input/index.js'
import { PinInput } from '../lib/pin-input/index.js'
import { Rating } from '../lib/rating/index.js'
import CarouselFixture from './fixtures/carousel-fixture.svelte'

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }))

function must<T>(value: T | null | undefined, what = 'element'): NonNullable<T> {
  if (value == null) throw new Error(`missing ${what}`)
  return value
}

describe('NumberInput', () => {
  it('renders a spinbutton and steps within bounds', async () => {
    render(NumberInput, { props: { value: 5, min: 0, max: 6, label: 'Quantity' } })
    const field = screen.getByRole('spinbutton')
    expect(field).toHaveAttribute('aria-valuenow', '5')
    await fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(field).toHaveAttribute('aria-valuenow', '6')
    await fireEvent.click(screen.getByRole('button', { name: 'Increase' }))
    expect(field).toHaveAttribute('aria-valuenow', '6')
    await fireEvent.keyDown(field, { key: 'ArrowDown' })
    expect(field).toHaveAttribute('aria-valuenow', '5')
  })

  it('commits typed values clamped', async () => {
    render(NumberInput, { props: { value: 0, min: 0, max: 10 } })
    const field = screen.getByRole('spinbutton')
    await fireEvent.input(field, { target: { value: '99' } })
    await fireEvent.blur(field)
    expect(field).toHaveAttribute('aria-valuenow', '10')
  })
})

describe('PinInput', () => {
  it('renders length cells and auto-advances', async () => {
    render(PinInput, { props: { length: 4 } })
    const cells = screen.getAllByRole('textbox')
    expect(cells.length).toBe(4)
    await fireEvent.input(must(cells[0]), { target: { value: '7' } })
    expect(document.activeElement).toBe(cells[1])
  })

  it('fires onComplete when full', async () => {
    const onComplete = vi.fn()
    render(PinInput, { props: { length: 2, onComplete } })
    const cells = screen.getAllByRole('textbox')
    await fireEvent.input(must(cells[0]), { target: { value: '1' } })
    await fireEvent.input(must(cells[1]), { target: { value: '2' } })
    expect(onComplete).toHaveBeenCalledWith('12')
  })

  it('paste fills cells and Backspace steps back', async () => {
    const onChange = vi.fn()
    render(PinInput, { props: { length: 3, onChange } })
    const cells = screen.getAllByRole('textbox')
    await fireEvent.paste(must(cells[0]), {
      clipboardData: { getData: () => '4-5-6' }
    })
    expect(must(cells[2])).toHaveValue('6')
    expect(onChange).toHaveBeenLastCalledWith('456')
    await fireEvent.keyDown(must(cells[2]), { key: 'Backspace' })
    expect(onChange).toHaveBeenLastCalledWith('45')
    await fireEvent.keyDown(must(cells[2]), { key: 'Backspace' })
    expect(document.activeElement).toBe(cells[1])
  })

  it('arrow keys move focus and masked renders password cells', async () => {
    render(PinInput, { props: { length: 3, masked: true } })
    const cells = screen.getAllByLabelText(/Digit/)
    expect(must(cells[0])).toHaveAttribute('type', 'password')
    await fireEvent.keyDown(must(cells[0]), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(cells[1])
    await fireEvent.keyDown(must(cells[1]), { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(cells[0])
  })
})

describe('Rating', () => {
  it('is a radiogroup that sets and clears', async () => {
    render(Rating, { props: { value: 0, max: 5 } })
    const group = screen.getByRole('radiogroup')
    expect(group).toHaveClass('sig-rating')
    const stars = screen.getAllByRole('radio')
    await fireEvent.click(must(stars[2]))
    expect(stars[2]).toHaveAttribute('aria-checked', 'true')
    expect(stars[2]).toHaveAttribute('data-filled')
    await fireEvent.click(must(stars[2]))
    expect(stars[2]).toHaveAttribute('aria-checked', 'false')
  })

  it('arrows adjust the value', async () => {
    render(Rating, { props: { value: 2, max: 5 } })
    const stars = screen.getAllByRole('radio')
    await fireEvent.keyDown(must(stars[1]), { key: 'ArrowRight' })
    expect(stars[2]).toHaveAttribute('aria-checked', 'true')
  })

  it('readonly stars do not change', async () => {
    render(Rating, { props: { value: 3, readonly: true } })
    const stars = screen.getAllByRole('radio')
    await fireEvent.click(must(stars[4]))
    expect(stars[4]).toHaveAttribute('aria-checked', 'false')
    expect(stars[2]).toHaveAttribute('aria-checked', 'true')
  })
})

describe('Editable', () => {
  it('swaps preview for input and commits on Enter', async () => {
    render(Editable, { props: { value: 'draft' } })
    const preview = screen.getByRole('button')
    expect(preview).toHaveTextContent('draft')
    await fireEvent.click(preview)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('draft')
    await fireEvent.input(input, { target: { value: 'final' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByRole('button')).toHaveTextContent('final')
  })

  it('Escape cancels the edit', async () => {
    render(Editable, { props: { value: 'keep' } })
    await fireEvent.click(screen.getByRole('button'))
    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'drop' } })
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(screen.getByRole('button')).toHaveTextContent('keep')
  })
})

describe('Carousel', () => {
  it('renders slides, navigates and marks dots', async () => {
    render(CarouselFixture)
    expect(screen.getByRole('region')).toHaveClass('sig-carousel')
    expect(screen.getByText('First')).toBeTruthy()
    expect(screen.getAllByRole('tab').length).toBe(3)
    await fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    const dots = screen.getAllByRole('tab')
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('loops back to the start', async () => {
    render(CarouselFixture)
    const next = screen.getByRole('button', { name: 'Next slide' })
    await fireEvent.click(next)
    await fireEvent.click(next)
    await fireEvent.click(next)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Button loading', () => {
  it('sets aria-busy, disables and renders a spinner', () => {
    render(Button, { props: { loading: true, children: text('Saving') } })
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    expect(btn.querySelector('.sig-btn-spinner')).toBeTruthy()
  })

  it('omits the spinner when not loading', () => {
    render(Button, { props: { children: text('Save') } })
    const btn = screen.getByRole('button')
    expect(btn).not.toHaveAttribute('aria-busy')
    expect(btn.querySelector('.sig-btn-spinner')).toBeNull()
  })
})
