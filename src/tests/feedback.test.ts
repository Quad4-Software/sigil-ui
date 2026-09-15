import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import { LikeButton, Loader, Waveform } from '../lib/index.js'

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
