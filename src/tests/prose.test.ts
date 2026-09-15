import { createRawSnippet } from 'svelte'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Prose } from '../lib/index.js'

const body = (text: string) => createRawSnippet(() => ({ render: () => `<p>${text}</p>` }))

describe('Prose', () => {
  it('renders sig-prose content with default size', () => {
    render(Prose, { children: body('hello') })
    const el = screen.getByText('hello').parentElement
    expect(el).toHaveClass('sig-prose')
    expect(el).not.toHaveClass('sig-prose-sm')
    expect(el).not.toHaveClass('sig-prose-invert')
  })

  it('applies size and invert classes', () => {
    render(Prose, { children: body('hello'), size: 'lg', invert: true })
    const el = screen.getByText('hello').parentElement
    expect(el).toHaveClass('sig-prose', 'sig-prose-lg', 'sig-prose-invert')
  })

  it('merges a caller class', () => {
    render(Prose, { children: body('hello'), class: 'docs' })
    expect(screen.getByText('hello').parentElement).toHaveClass('sig-prose', 'docs')
  })
})
