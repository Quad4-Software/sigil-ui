import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Checkbox, Input } from '../lib/index.js'
import SelectFixture from './fixtures/select-fixture.svelte'

describe('Input', () => {
  it('renders with the sig-input class and forwards attributes', () => {
    render(Input, { 'aria-label': 'Name', placeholder: 'Your name' })
    const input = screen.getByLabelText('Name')
    expect(input).toHaveClass('sig-input')
    expect(input).toHaveAttribute('placeholder', 'Your name')
  })

  it('supports error state via aria-invalid', () => {
    render(Input, { 'aria-label': 'Email', 'aria-invalid': 'true' })
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('Select', () => {
  it('renders options and binds the selected value', async () => {
    render(SelectFixture)
    const select = screen.getByLabelText('Plan')
    expect(select).toHaveClass('sig-select')
    expect(screen.getByTestId('out')).toHaveTextContent('a')

    await fireEvent.change(select, { target: { value: 'b' } })
    expect(screen.getByTestId('out')).toHaveTextContent('b')
  })
})

describe('Checkbox', () => {
  it('toggles checked on click', async () => {
    render(Checkbox, { 'aria-label': 'Agree' })
    const box = screen.getByRole('checkbox', { name: 'Agree' })
    expect(box).not.toBeChecked()
    await fireEvent.click(box)
    expect(box).toBeChecked()
  })
})
