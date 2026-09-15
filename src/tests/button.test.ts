import { createRawSnippet } from 'svelte'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../lib/index.js'

const label = (text: string) => createRawSnippet(() => ({ render: () => `<span>${text}</span>` }))

describe('Button', () => {
  it('renders children and the sig-btn class', () => {
    render(Button, { children: label('Save') })
    const btn = screen.getByRole('button', { name: 'Save' })
    expect(btn).toHaveClass('sig-btn')
    expect(btn).toHaveAttribute('data-variant', 'primary')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'sets data-variant=%s',
    (variant) => {
      render(Button, { variant, children: label('x') })
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant)
    }
  )

  it('forwards native attributes and merges class', () => {
    render(Button, { children: label('x'), class: 'extra', type: 'submit' })
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('sig-btn', 'extra')
    expect(btn).toHaveAttribute('type', 'submit')
  })

  it('fires onclick when enabled', async () => {
    const onclick = vi.fn()
    render(Button, { children: label('x'), onclick })
    await fireEvent.click(screen.getByRole('button'))
    expect(onclick).toHaveBeenCalledOnce()
  })

  it('renders a disabled button', () => {
    render(Button, { children: label('x'), disabled: true })
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
