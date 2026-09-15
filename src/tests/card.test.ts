import { createRawSnippet } from 'svelte'
import { render } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Card } from '../lib/index.js'

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }))

describe('Card', () => {
  it('renders each namespace part with its sig class', () => {
    render(Card.Root, { children: text('body') })
    expect(document.querySelector('.sig-card')).toBeInTheDocument()
  })

  it('renders title, description, content and footer', () => {
    render(Card.Header, { children: text('head') })
    render(Card.Title, { children: text('t') })
    render(Card.Description, { children: text('d') })
    render(Card.Content, { children: text('c') })
    render(Card.Footer, { children: text('f') })

    expect(document.querySelector('.sig-card-header')).toBeInTheDocument()
    expect(document.querySelector('h3.sig-card-title')).toBeInTheDocument()
    expect(document.querySelector('.sig-card-description')).toBeInTheDocument()
    expect(document.querySelector('.sig-card-content')).toBeInTheDocument()
    expect(document.querySelector('.sig-card-footer')).toBeInTheDocument()
  })

  it('merges class prop', () => {
    render(Card.Root, { class: 'extra', children: text('x') })
    expect(document.querySelector('.sig-card')).toHaveClass('extra')
  })
})
