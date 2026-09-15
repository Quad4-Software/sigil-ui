import { createRawSnippet } from 'svelte'
import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Badge } from '../lib/index.js'

const label = (text: string) => createRawSnippet(() => ({ render: () => `<span>${text}</span>` }))

const badge = (text: string) => screen.getByText(text).closest('.sig-badge')

describe('Badge', () => {
  it('renders children with the sig-badge class', () => {
    render(Badge, { children: label('beta') })
    const el = badge('beta')
    expect(el).not.toBeNull()
    expect(el).toHaveAttribute('data-tone', 'neutral')
  })

  it.each(['neutral', 'accent', 'danger'] as const)('sets data-tone=%s', (tone) => {
    render(Badge, { tone, children: label('x') })
    expect(badge('x')).toHaveAttribute('data-tone', tone)
  })

  it('merges the class prop', () => {
    render(Badge, { children: label('x'), class: 'extra' })
    expect(badge('x')).toHaveClass('sig-badge', 'extra')
  })
})
