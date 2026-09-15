import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Alert, Avatar, Progress, Separator, Skeleton, Stat } from '../lib/index.js'

describe('Stat', () => {
  it('renders label, value and a positive delta', () => {
    render(Stat, { label: 'Revenue', value: '$48k', delta: 12.5, deltaLabel: '%' })
    expect(screen.getByText('Revenue')).toHaveClass('sig-stat-label')
    expect(screen.getByText('$48k')).toHaveClass('sig-stat-value')
    const delta = screen.getByText('+12.5 %')
    expect(delta).toHaveAttribute('data-dir', 'up')
  })

  it('renders a negative delta in the down direction', () => {
    render(Stat, { label: 'Errors', value: '3', delta: -4 })
    expect(screen.getByText('-4')).toHaveAttribute('data-dir', 'down')
  })

  it('omits the delta row when delta is not provided', () => {
    render(Stat, { label: 'Users', value: '10' })
    expect(document.querySelector('.sig-stat-delta')).not.toBeInTheDocument()
  })
})

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(Avatar, { src: '/u.png', alt: 'Ada', fallback: 'Ada Lovelace' })
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveClass('sig-avatar-img')
  })

  it('derives two initials for the fallback', () => {
    render(Avatar, { alt: 'Ada Lovelace', fallback: 'Ada Lovelace' })
    const el = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(el).toHaveTextContent('AL')
  })
})

describe('Progress', () => {
  it('exposes progressbar semantics with clamped value', () => {
    render(Progress, { value: 40, label: 'Upload' })
    const bar = screen.getByRole('progressbar', { name: 'Upload' })
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuenow', '40')
  })

  it('renders indeterminate state without aria-valuenow', () => {
    render(Progress, { label: 'Loading' })
    const bar = screen.getByRole('progressbar', { name: 'Loading' })
    expect(bar).not.toHaveAttribute('aria-valuenow')
    expect(bar).toHaveAttribute('data-indeterminate', '')
  })
})

describe('Skeleton', () => {
  it('is aria-hidden and merges classes', () => {
    render(Skeleton, { class: 'h-8' })
    const el = document.querySelector('.sig-skeleton')
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveClass('h-8')
  })
})

describe('Separator', () => {
  it('is decorative by default', () => {
    render(Separator)
    expect(document.querySelector('.sig-separator')).toHaveAttribute('role', 'none')
  })

  it('exposes separator semantics when not decorative', () => {
    render(Separator, { decorative: false, orientation: 'vertical' })
    const el = screen.getByRole('separator')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
    expect(el).toHaveAttribute('data-orientation', 'vertical')
  })
})

describe('Alert', () => {
  it('uses role=status for neutral tones', () => {
    render(Alert, { title: 'Heads up' })
    expect(screen.getByRole('status')).toHaveAttribute('data-tone', 'default')
  })

  it('uses role=alert for danger', () => {
    render(Alert, { tone: 'danger', title: 'Failed' })
    expect(screen.getByRole('alert')).toHaveAttribute('data-tone', 'danger')
  })

  it('renders title and body text', () => {
    render(Alert, { tone: 'success', title: 'Saved' })
    expect(screen.getByText('Saved')).toHaveClass('sig-alert-title')
  })
})
