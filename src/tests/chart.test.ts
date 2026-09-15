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

  it('renders multi-series with a legend and per-point titles', () => {
    render(Chart.Line, {
      series: [
        { name: 'in', data: [1, 4, 2] },
        { name: 'out', data: [2, 3, 5], color: 'rgb(1,2,3)' }
      ],
      labels: ['a', 'b', 'c'],
      legend: true,
      dots: true
    })
    const fig = screen.getByRole('img')
    expect(fig.querySelectorAll('polyline')).toHaveLength(2)
    expect(fig.querySelector('.sig-chart-area')).not.toBeInTheDocument()
    expect(screen.getByText('in')).toBeInTheDocument()
    expect(screen.getByText('out')).toBeInTheDocument()
    expect(fig.querySelector('circle title')?.textContent).toBe('in: a 1')
    expect(fig.querySelectorAll('circle')).toHaveLength(6)
  })

  it('fills a single series and tolerates empty or single-point data', () => {
    const { unmount } = render(Chart.Line, { data: [3, 1, 4], filled: true, dots: true })
    let fig = screen.getByRole('img')
    expect(fig.querySelector('.sig-chart-area')).toBeInTheDocument()
    expect(fig.querySelectorAll('circle')).toHaveLength(3)
    unmount()

    render(Chart.Line, { data: [7] })
    fig = screen.getByRole('img')
    expect(fig.querySelector('polyline')).toBeInTheDocument()
  })

  it('renders an empty series list without crashing', () => {
    const { container } = render(Chart.Line, {})
    expect(container.querySelector('figure')).toBeInTheDocument()
  })
})

describe('Chart.Area', () => {
  it('renders a smooth curve through every point', () => {
    render(Chart.Area, { data: [1, 5, 2, 8, 3], label: 'Load' })
    const fig = screen.getByRole('img', { name: 'Load' })
    const path = fig.querySelector('path')
    expect(path?.getAttribute('d')).toContain('C')
  })

  it('handles a single point and empty data', () => {
    const { container, unmount } = render(Chart.Area, { data: [4] })
    expect(container.querySelector('path')?.getAttribute('d')).toMatch(/^M/)
    unmount()
    render(Chart.Area, { data: [] })
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})

describe('Chart.Gauge', () => {
  it('clamps the arc fraction between min and max', () => {
    render(Chart.Gauge, { value: 150, max: 100, label: 'CPU' })
    const fig = screen.getByRole('img', { name: 'CPU: 150' })
    const arc = fig.querySelector('.sig-gauge-arc')
    expect(arc?.getAttribute('stroke-dasharray')).toContain('125.66')
  })

  it('supports custom ranges and colors', () => {
    render(Chart.Gauge, { value: 5, min: 0, max: 10, color: 'rgb(9,9,9)' })
    const arc = document.querySelector('.sig-gauge-arc')
    expect(arc?.getAttribute('stroke')).toBe('rgb(9,9,9)')
    expect(arc?.getAttribute('stroke-dasharray')).toContain('62.83')
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

describe('Chart.Heatmap', () => {
  it('renders a cell per datum with tooltips', () => {
    render(Chart.Heatmap, {
      data: [
        [1, 2, 3],
        [4, 5, 6]
      ],
      xLabels: ['Mon', 'Tue', 'Wed'],
      yLabels: ['api', 'web'],
      label: 'Load'
    })
    const fig = screen.getByRole('img', { name: 'Load' })
    expect(fig.querySelectorAll('.sig-heatmap-cell')).toHaveLength(6)
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('api')).toBeInTheDocument()
  })
})

describe('Chart.Radar', () => {
  it('renders rings, spokes and a series polygon', () => {
    render(Chart.Radar, {
      labels: ['Speed', 'Power', 'Range'],
      data: [4, 3, 5],
      label: 'Stats'
    })
    const fig = screen.getByRole('img', { name: 'Stats' })
    expect(fig.querySelectorAll('.sig-radar-ring')).toHaveLength(4)
    expect(fig.querySelectorAll('.sig-radar-spoke')).toHaveLength(3)
    expect(fig.querySelector('.sig-radar-area')).toBeInTheDocument()
  })
})

describe('Chart.Scatter', () => {
  it('renders a dot per point', () => {
    render(Chart.Scatter, {
      data: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 5, y: 1 }
      ],
      label: 'Points'
    })
    const fig = screen.getByRole('img', { name: 'Points' })
    expect(fig.querySelectorAll('.sig-scatter-dot')).toHaveLength(3)
  })
})

describe('Chart.Uptime', () => {
  it('renders a bar per sample with derived status', () => {
    render(Chart.Uptime, { data: [12, 40, 0, 25], warnAt: 30, label: 'Ping' })
    const fig = screen.getByRole('img', { name: 'Ping' })
    const bars = fig.querySelectorAll('.sig-uptime-bar')
    expect(bars).toHaveLength(4)
    expect(bars[0]).toHaveAttribute('data-status', 'up')
    expect(bars[1]).toHaveAttribute('data-status', 'warn')
    expect(bars[2]).toHaveAttribute('data-status', 'down')
  })

  it('honors explicit status and renders the summary', () => {
    render(Chart.Uptime, {
      data: [
        { ms: 10, status: 'up' },
        { ms: 0, status: 'down' }
      ],
      summary: true
    })
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByText('5 ms avg')).toBeInTheDocument()
  })
})
