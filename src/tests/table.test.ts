import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Spinner } from '../lib/index.js'
import Fixture from './fixtures/table-fixture.svelte'

describe('Table', () => {
  it('renders semantic table markup inside a scroll wrapper', () => {
    render(Fixture)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(document.querySelector('.sig-table-wrap')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('api').tagName).toBe('TD')
    expect(screen.getByText('Services').tagName).toBe('CAPTION')
  })
})

describe('Spinner', () => {
  it('announces itself as a status with a label', () => {
    render(Spinner)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading')
  })

  it('accepts a custom label', () => {
    render(Spinner, { label: 'Saving' })
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving')
  })
})
