import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import {
  ComparisonTable,
  LevelMeter,
  LikeButton,
  Loader,
  StreamingText,
  Suggestion,
  Waveform
} from '../lib/index.js'

const must = <T>(v: T | null | undefined, name: string): T => {
  if (v == null) throw new Error(`missing ${name}`)
  return v
}

describe('Loader', () => {
  it('exposes role=status with an accessible label', () => {
    render(Loader, { label: 'Saving' })
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })

  it('renders the requested kind and size', () => {
    render(Loader, { kind: 'dots', size: 'lg' })
    const el = screen.getByRole('status')
    expect(el).toHaveAttribute('data-kind', 'dots')
    expect(el).toHaveAttribute('data-size', 'lg')
    expect(el.querySelectorAll('.sig-loader-dot')).toHaveLength(3)
  })

  it('renders four bars for the equalizer kind and a pulse disc', () => {
    const { unmount } = render(Loader, { kind: 'bars' })
    expect(document.querySelectorAll('.sig-loader-bar')).toHaveLength(4)
    unmount()
    render(Loader, { kind: 'pulse' })
    expect(document.querySelector('.sig-loader-pulse')).toBeInTheDocument()
  })
})

describe('Waveform', () => {
  const amps = [0.2, 0.6, 1, 0.4, 0.8]

  it('renders one bar per amplitude as an image by default', () => {
    render(Waveform, { bars: amps, label: 'Clip' })
    const fig = screen.getByRole('img', { name: 'Clip' })
    const bars = fig.querySelectorAll('.sig-waveform-bar')
    expect(bars).toHaveLength(5)
    expect(must(bars[2], 'bar')).toHaveStyle('height: 100%')
    expect(must(bars[0], 'bar')).toHaveStyle('height: 20%')
  })

  it('marks bars before the progress point as played', () => {
    render(Waveform, { bars: amps, progress: 0.6 })
    const bars = document.querySelectorAll('.sig-waveform-bar')
    expect(bars[0]).toHaveAttribute('data-played')
    expect(bars[2]).toHaveAttribute('data-played')
    expect(bars[4]).not.toHaveAttribute('data-played')
  })

  it('becomes a slider and seeks on click when onseek is set', async () => {
    const onseek = vi.fn()
    render(Waveform, { bars: amps, progress: 0.4, onseek })
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('aria-valuenow', '40')
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 100,
      right: 100,
      top: 0,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })
    await fireEvent.click(slider, { clientX: 80 })
    expect(onseek).toHaveBeenCalledWith(0.8)
  })

  it('seeks with arrow keys and clamps at the ends', async () => {
    const onseek = vi.fn()
    render(Waveform, { bars: amps, progress: 0.5, onseek })
    const slider = screen.getByRole('slider')
    await fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(onseek).toHaveBeenLastCalledWith(0.52)
    await fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(onseek).toHaveBeenLastCalledWith(0.48)
    await fireEvent.keyDown(slider, { key: 'End' })
    expect(onseek).toHaveBeenLastCalledWith(1)
    await fireEvent.keyDown(slider, { key: 'x' })
    expect(onseek).toHaveBeenCalledTimes(3)
  })

  it('sets data-playing while audio plays', () => {
    render(Waveform, { bars: amps, playing: true })
    expect(screen.getByRole('img')).toHaveAttribute('data-playing')
  })

  it('fills bars in real time from an AnalyserNode', async () => {
    const analyser = {
      frequencyBinCount: 8,
      getByteFrequencyData(buf: Uint8Array) {
        buf.fill(200)
      }
    }
    render(Waveform, { live: analyser as unknown as AnalyserNode, barCount: 4, label: 'Mic' })
    const fig = screen.getByRole('img', { name: 'Mic' })
    expect(fig).toHaveAttribute('data-playing')
    await vi.waitFor(() => {
      const bars = fig.querySelectorAll('.sig-waveform-bar')
      expect(bars).toHaveLength(4)
      expect(must(bars[0], 'bar')).toHaveStyle('height: 100%')
    })
  })

  it('applies variant and size data attributes', () => {
    render(Waveform, { bars: amps, variant: 'dots', size: 'sm' })
    const fig = screen.getByRole('img')
    expect(fig).toHaveAttribute('data-variant', 'dots')
    expect(fig).toHaveAttribute('data-size', 'sm')
    const bars = fig.querySelectorAll('.sig-waveform-bar')
    expect(must(bars[0], 'bar')).toHaveStyle('--amp: 0.2')
    expect(bars[0]?.getAttribute('style')).not.toContain('height:')
  })

  it('creates an AudioContext for a MediaStream and closes it on teardown', async () => {
    const close = vi.fn()
    const analyser = {
      fftSize: 0,
      smoothingTimeConstant: 0,
      frequencyBinCount: 4,
      getByteFrequencyData(buf: Uint8Array) {
        buf.fill(255)
      }
    }
    const source = { connect: vi.fn() }
    vi.stubGlobal(
      'AudioContext',
      class {
        createAnalyser = () => analyser
        createMediaStreamSource = () => source
        close = close
      }
    )
    const { unmount } = render(Waveform, {
      live: { getTracks: () => [] } as unknown as MediaStream,
      barCount: 2
    })
    await vi.waitFor(() => expect(source.connect).toHaveBeenCalledWith(analyser))
    unmount()
    expect(close).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})

describe('LikeButton', () => {
  it('toggles aria-pressed and calls onclick', async () => {
    const onclick = vi.fn()
    render(LikeButton, { onclick })
    const btn = screen.getByRole('button', { name: 'Like' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    await fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(onclick).toHaveBeenCalledTimes(1)
  })

  it('starts liked and renders the count', () => {
    render(LikeButton, { liked: true, count: 42 })
    expect(screen.getByRole('button', { name: 'Unlike' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders the star shape', () => {
    render(LikeButton, { shape: 'star' })
    expect(screen.getByRole('button')).toHaveAttribute('data-shape', 'star')
  })
})

describe('LevelMeter', () => {
  it('lights segments up to the value with zones', () => {
    render(LevelMeter, { value: 0.5, segments: 10, label: 'Mic level' })
    const meter = screen.getByRole('meter', { name: 'Mic level' })
    expect(meter).toHaveAttribute('aria-valuenow', '50')
    const segs = meter.querySelectorAll('.sig-meter-seg')
    expect(segs).toHaveLength(10)
    expect(segs[4]).toHaveAttribute('data-on')
    expect(segs[5]).not.toHaveAttribute('data-on')
    expect(must(segs[0], 'seg')).toHaveAttribute('data-zone', 'safe')
    expect(must(segs[8], 'seg')).toHaveAttribute('data-zone', 'warn')
    expect(must(segs[9], 'seg')).toHaveAttribute('data-zone', 'peak')
  })

  it('clamps out-of-range values and supports vertical orientation', () => {
    render(LevelMeter, { value: 2, segments: 4, orientation: 'vertical', size: 'sm' })
    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '100')
    expect(meter).toHaveAttribute('data-orientation', 'vertical')
    expect(meter.querySelectorAll('.sig-meter-seg[data-on]')).toHaveLength(4)
  })

  it('samples a live AnalyserNode', async () => {
    const analyser = {
      frequencyBinCount: 8,
      getByteFrequencyData(buf: Uint8Array) {
        buf.fill(255)
      }
    }
    render(LevelMeter, { live: analyser as unknown as AnalyserNode, segments: 5 })
    const meter = screen.getByRole('meter')
    await vi.waitFor(() => {
      expect(meter.querySelectorAll('.sig-meter-seg[data-on]')).toHaveLength(5)
    })
  })
})

describe('StreamingText', () => {
  it('renders full text immediately when not streaming', () => {
    render(StreamingText, { text: 'hello world' })
    expect(screen.getByText('hello world')).toBeInTheDocument()
    expect(document.querySelector('.sig-stream-caret')).toBeNull()
  })

  it('shows a caret while streaming', () => {
    render(StreamingText, { text: 'partial', streaming: true })
    expect(document.querySelector('.sig-stream')).toHaveAttribute('data-streaming')
    expect(document.querySelector('.sig-stream-caret')).toBeInTheDocument()
  })
})

describe('Suggestion', () => {
  it('renders value plus ghost suffix and announces it', () => {
    render(Suggestion, { value: 'deploy to', suggestion: ' production' })
    expect(document.querySelector('.sig-suggestion-ghost')).toHaveTextContent('production')
    expect(document.querySelector('.sig-suggestion-value')).toHaveTextContent('deploy to')
    expect(document.querySelector('.sig-sr-only')).toHaveTextContent(
      'Suggestion: deploy to production'
    )
  })

  it('is a button that accepts on Tab and click when interactive', async () => {
    const onaccept = vi.fn()
    render(Suggestion, { value: 'dep', suggestion: 'loy', interactive: true, onaccept })
    const btn = screen.getByRole('button', { name: 'Accept suggestion: deploy' })
    await fireEvent.keyDown(btn, { key: 'Tab' })
    expect(onaccept).toHaveBeenCalledWith('deploy')
    await fireEvent.click(btn)
    expect(onaccept).toHaveBeenCalledTimes(2)
  })

  it('dismisses on Escape and renders plain text without a suggestion', async () => {
    const ondismiss = vi.fn()
    render(Suggestion, { value: 'dep', suggestion: 'loy', interactive: true, ondismiss })
    await fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' })
    expect(ondismiss).toHaveBeenCalled()
  })
})

describe('ComparisonTable', () => {
  const rows = [
    { label: 'Zero deps', cells: [true, false, 'partial'] },
    { label: 'Charts', cells: [true, false, false] }
  ]

  it('renders a real table with row and column headers', () => {
    render(ComparisonTable, {
      columns: ['sigil', 'A', 'B'],
      rows: [...rows],
      label: 'Feature comparison'
    })
    const table = screen.getByRole('table', { name: 'Feature comparison' })
    expect(table.querySelectorAll('th[scope="col"]')).toHaveLength(4)
    expect(table.querySelectorAll('th[scope="row"]')).toHaveLength(2)
    expect(screen.getByText('Zero deps')).toBeInTheDocument()
  })

  it('renders checks for true, dashes for false, and text otherwise', () => {
    render(ComparisonTable, { columns: ['sigil', 'A', 'B'], rows: [...rows] })
    expect(document.querySelectorAll('.sig-compare-yes')).toHaveLength(2)
    expect(document.querySelectorAll('.sig-compare-no')).toHaveLength(3)
    expect(screen.getByText('partial')).toBeInTheDocument()
    expect(screen.getAllByText('yes')).toHaveLength(2)
  })

  it('marks the highlighted column', () => {
    render(ComparisonTable, { columns: ['sigil', 'A', 'B'], rows: [...rows], highlight: 0 })
    const marked = document.querySelectorAll('[data-highlight]')
    expect(marked.length).toBeGreaterThanOrEqual(3)
    expect(marked[0]?.textContent).toBe('sigil')
  })
})
