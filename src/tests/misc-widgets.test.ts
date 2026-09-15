import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import { CopyButton, CountUp, Reveal } from '../lib/index.js'
import Fixture from './fixtures/pagination-fixture.svelte'

describe('CountUp', () => {
  it('renders the formatted target when duration is zero', () => {
    render(CountUp, { value: 48210, duration: 0, format: (n: number) => n.toLocaleString() })
    expect(screen.getByText('48,210')).toBeInTheDocument()
  })

  it('renders decimals', () => {
    render(CountUp, { value: 3.14159, duration: 0, decimals: 2 })
    expect(screen.getByText('3.14')).toBeInTheDocument()
  })
})

describe('Pagination', () => {
  it('renders a nav landmark and moves pages', async () => {
    render(Fixture, { pages: 10 })
    const nav = screen.getByRole('navigation', { name: 'Pagination' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
    await fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByTestId('page').textContent).toBe('2')
    await fireEvent.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(screen.getByTestId('page').textContent).toBe('3')
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('disables prev on the first page', () => {
    render(Fixture, { pages: 10 })
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })
})

describe('CopyButton', () => {
  it('copies text and shows the copied state', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(CopyButton, { text: 'pnpm add sigil-ui' })
    const btn = screen.getByRole('button', { name: 'Copy' })
    await fireEvent.click(btn)
    expect(writeText).toHaveBeenCalledWith('pnpm add sigil-ui')
    await screen.findByRole('button', { name: 'Copied' })
  })
})

describe('Reveal', () => {
  it('is visible immediately when IntersectionObserver is unavailable', () => {
    render(Reveal)
    expect(document.querySelector('.sig-reveal')).toHaveAttribute('data-visible')
  })
})
