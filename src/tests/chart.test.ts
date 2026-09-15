import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'
import { Chart } from '../lib/index.js'

describe('Chart.Line', () => {
  it('renders an accessible figure with a polyline', () => {
    render(Chart.Line, { data: [1, 5, 2, 8], label: 'Traffic' })
    const fig = screen.getByRole('img', { name: 'Traffic' })
    expect(fig.querySelector('polyline')).toBeInTheDocument()
    expect(fig.querySelector('polyline')?.getAttribute('points')).toContain(',')
  })

  it('renders label ticks when labels match data length', () => {
    render(Chart.Line, { data: [1, 2], labels: ['a', 'b'] })
    expect(screen.getByText('a')).toBeInTheDocument()
    expect(screen.getByText('b')).toBeInTheDocument()
  })
})

describe('Chart.Bar', () => {
  it('renders one rect per datum', () => {
    render(Chart.Bar, {
      data: [
        { label: 'Mon', value: 4 },
        { label: 'Tue', value: 7 }
      ]
    })
    const fig = screen.getByRole('img')
    expect(fig.querySelectorAll('rect')).toHaveLength(2)
    expect(screen.getByText('Mon')).toBeInTheDocument()
  })
})

describe('Chart.Sparkline', () => {
  it('renders a scaled polyline', () => {
    render(Chart.Sparkline, { data: [0, 10, 5, 10], label: 'Trend' })
    const svg = screen.getByRole('img', { name: 'Trend' })
    expect(svg.querySelector('polyline')).toBeInTheDocument()
  })
})

describe('Chart.Donut', () => {
  it('renders a segment per datum and center content', () => {
    render(Chart.Donut, {
      data: [
        { value: 60, label: 'Used' },
        { value: 40, label: 'Free' }
      ],
      label: 'Storage'
    })
    const fig = screen.getByRole('img', { name: 'Storage' })
    expect(fig.querySelectorAll('.sig-donut-seg')).toHaveLength(2)
  })
})
