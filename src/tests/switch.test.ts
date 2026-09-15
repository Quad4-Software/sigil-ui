import { createRawSnippet } from 'svelte'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Switch } from '../lib/index.js'

describe('Switch', () => {
  it('renders a switch role in the unchecked state', () => {
    render(Switch, { checked: false, 'aria-label': 'toggle' })
    const el = screen.getByRole('switch')
    expect(el).toHaveClass('sig-switch')
    expect(el).toHaveAttribute('data-state', 'unchecked')
  })

  it('toggles on click', async () => {
    render(Switch, { checked: false, 'aria-label': 'toggle' })
    const el = screen.getByRole('switch')
    await fireEvent.click(el)
    expect(el).toHaveAttribute('data-state', 'checked')
    await fireEvent.click(el)
    expect(el).toHaveAttribute('data-state', 'unchecked')
  })

  it('respects disabled', async () => {
    render(Switch, { checked: false, disabled: true, 'aria-label': 'toggle' })
    const el = screen.getByRole('switch')
    await fireEvent.click(el)
    expect(el).toHaveAttribute('data-state', 'unchecked')
  })

  it('renders a custom children snippet instead of the default thumb', () => {
    const thumb = createRawSnippet(() => ({ render: () => '<i data-slot="thumb"></i>' }))
    render(Switch, { children: thumb })
    expect(document.querySelector('[data-slot="thumb"]')).toBeInTheDocument()
  })
})
