import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { DataTable } from '../lib/index.js'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'ms', label: 'Latency', sortable: true, align: 'right' as const }
]

const rows = [
  { name: 'web', ms: 42 },
  { name: 'api', ms: 12 },
  { name: 'db', ms: 88 }
]

describe('DataTable', () => {
  it('renders rows and column headers', () => {
    render(DataTable, { columns, rows })
    expect(screen.getByText('api')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument()
  })

  it('sorts ascending then descending on header click', async () => {
    render(DataTable, { columns, rows })
    const btn = screen.getByRole('button', { name: /Name/ })
    await fireEvent.click(btn)
    let cells = screen.getAllByRole('cell').map((c) => c.textContent)
    expect(cells[0]).toBe('api')
    await fireEvent.click(btn)
    cells = screen.getAllByRole('cell').map((c) => c.textContent)
    expect(cells[0]).toBe('web')
    const th = screen.getByRole('columnheader', { name: /Name/ })
    expect(th).toHaveAttribute('aria-sort', 'descending')
  })

  it('sorts numbers numerically', async () => {
    render(DataTable, { columns, rows })
    await fireEvent.click(screen.getByRole('button', { name: /Latency/ }))
    const cells = screen.getAllByRole('cell').map((c) => c.textContent)
    expect(cells[1]).toBe('12')
  })

  it('shows the empty state', () => {
    render(DataTable, { columns, rows: [], empty: 'Nothing here' })
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('filters rows via the filterable input', async () => {
    render(DataTable, { columns, rows, filterable: true })
    const box = screen.getByRole('searchbox', { name: 'Filter rows' })
    await fireEvent.input(box, { target: { value: 'ap' } })
    const cells = screen.getAllByRole('cell').map((c) => c.textContent)
    expect(cells).toContain('api')
    expect(cells).not.toContain('db')
  })

  it('selects rows and toggles all', async () => {
    render(DataTable, { columns, rows, selectable: true })
    const rowBoxes = screen.getAllByRole('checkbox', { name: 'Select row' })
    expect(rowBoxes).toHaveLength(3)
    const first = rowBoxes[0]
    if (!first) throw new Error('missing row checkbox')
    await fireEvent.click(first)
    expect(first).toBeChecked()

    const all = screen.getByRole('checkbox', { name: 'Select all rows' })
    await fireEvent.click(all)
    for (const box of screen.getAllByRole('checkbox', { name: 'Select row' })) {
      expect(box).toBeChecked()
    }
    await fireEvent.click(all)
    for (const box of screen.getAllByRole('checkbox', { name: 'Select row' })) {
      expect(box).not.toBeChecked()
    }
  })

  it('marks sticky headers', () => {
    render(DataTable, { columns, rows, stickyHeader: true })
    expect(document.querySelector('.sig-datatable')).toHaveAttribute('data-sticky')
  })
})
