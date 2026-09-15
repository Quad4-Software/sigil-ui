import { createRawSnippet } from 'svelte'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Breadcrumb, Empty, Kbd, Measure, Slider, Textarea, Toggle } from '../lib/index.js'

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }))

describe('Textarea', () => {
  it('renders with invalid state wiring', () => {
    render(Textarea, { invalid: true, 'aria-label': 'notes' })
    const el = screen.getByLabelText('notes')
    expect(el).toHaveAttribute('aria-invalid', 'true')
    expect(el).toHaveAttribute('data-invalid', '')
  })
})

describe('Slider', () => {
  it('renders a range input with value wiring', () => {
    render(Slider, { value: 40, label: 'Volume' })
    const slider = screen.getByLabelText('Volume')
    expect(slider).toHaveAttribute('type', 'range')
    expect(slider).toHaveValue('40')
  })
})

describe('Toggle', () => {
  it('toggles aria-pressed on click', async () => {
    render(Toggle, { children: text('Bold'), 'aria-label': 'Bold' })
    const toggle = screen.getByRole('button', { name: 'Bold' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(toggle).toHaveAttribute('data-state', 'on')
  })

  it('does not toggle when disabled', async () => {
    render(Toggle, { disabled: true, children: text('x'), 'aria-label': 'x' })
    const toggle = screen.getByRole('button', { name: 'x' })
    await fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('Kbd', () => {
  it('renders a kbd element', () => {
    render(Kbd, { children: text('K') })
    expect(screen.getByText('K').closest('kbd')).not.toBeNull()
  })
})

describe('Breadcrumb', () => {
  it('renders nav landmark and marks the current item', () => {
    render(Breadcrumb.Root, {
      children: createRawSnippet(() => ({
        render: () => `<li class="sig-crumb"><a href="/">Home</a></li>`
      }))
    })
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('sets aria-current on current items', () => {
    render(Breadcrumb.Item, { current: true, children: text('Page') })
    expect(screen.getByText('Page').closest('li')).toHaveAttribute('aria-current', 'page')
  })
})

describe('Empty', () => {
  it('renders title, description and actions', () => {
    render(Empty, {
      title: 'Nothing here',
      description: 'Add something first.',
      children: text('action')
    })
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
    expect(screen.getByText('Add something first.')).toBeInTheDocument()
    expect(screen.getByText('action')).toBeInTheDocument()
  })
})

describe('Measure', () => {
  it('renders children and a size badge', () => {
    render(Measure, { children: text('content') })
    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.getByText(/x .*px/)).toBeInTheDocument()
  })
})
