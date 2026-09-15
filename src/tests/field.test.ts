import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/field-fixture.svelte'

describe('Field', () => {
  it('links the label to the control with for/id', () => {
    render(Fixture, { label: 'Email' })
    const input = screen.getByRole('textbox')
    expect(input.id).toBeTruthy()
    expect(screen.getByText('Email')).toHaveAttribute('for', input.id)
  })

  it('describes the control with the hint', () => {
    render(Fixture, { label: 'Email', hint: 'We never share it.' })
    const input = screen.getByRole('textbox')
    const hint = screen.getByText('We never share it.')
    expect(input).toHaveAttribute('aria-describedby', hint.id)
    expect(input).not.toHaveAttribute('aria-invalid')
  })

  it('swaps the hint for a role=alert error and sets aria-invalid', () => {
    render(Fixture, { label: 'Email', hint: 'ignored', error: 'Invalid address' })
    const input = screen.getByRole('textbox')
    const error = screen.getByRole('alert')
    expect(error).toHaveTextContent('Invalid address')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', error.id)
    expect(screen.queryByText('ignored')).not.toBeInTheDocument()
  })
})
