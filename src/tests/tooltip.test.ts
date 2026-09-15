import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import Fixture from './fixtures/tooltip-fixture.svelte'

describe('Tooltip', () => {
  it('renders the tooltip and wires aria-describedby on the trigger', () => {
    render(Fixture)
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('Save changes')
    const trigger = screen.getByRole('button', { name: 'Save' })
    expect(trigger).toHaveAttribute('aria-describedby', tip.id)
    expect(tip.id).toBeTruthy()
  })
})
