import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import Fixture from './fixtures/pane-fixture.svelte'

describe('PaneGroup', () => {
  it('sizes panes from defaultSize with the rest split equally', () => {
    render(Fixture)
    const a = screen.getByTestId('pane-a')
    const b = screen.getByTestId('pane-b')
    expect(a).toHaveStyle({ flexGrow: '40' })
    expect(b).toHaveStyle({ flexGrow: '60' })
  })

  it('renders the resizer as a focusable separator with aria values', () => {
    render(Fixture)
    const resizer = screen.getByRole('separator')
    expect(resizer).toHaveAttribute('aria-orientation', 'vertical')
    expect(resizer).toHaveAttribute('aria-valuenow', '40')
    expect(resizer).toHaveAttribute('aria-valuemin', '20')
    expect(resizer).toHaveAttribute('aria-valuemax', '80')
    expect(resizer).toHaveAttribute('tabindex', '0')
  })

  it('resizes with arrow keys and calls onLayout', async () => {
    const onLayout = vi.fn()
    render(Fixture, { onLayout })
    const resizer = screen.getByRole('separator')
    resizer.focus()

    await fireEvent.keyDown(resizer, { key: 'ArrowRight' })
    expect(screen.getByTestId('pane-a')).toHaveStyle({ flexGrow: '45' })
    expect(onLayout).toHaveBeenCalledWith([45, 55])

    await fireEvent.keyDown(resizer, { key: 'ArrowLeft' })
    expect(screen.getByTestId('pane-a')).toHaveStyle({ flexGrow: '40' })
  })

  it('clamps resizing to pane min and max', async () => {
    render(Fixture)
    const resizer = screen.getByRole('separator')
    resizer.focus()

    for (let i = 0; i < 20; i++) await fireEvent.keyDown(resizer, { key: 'ArrowRight' })
    expect(screen.getByTestId('pane-a')).toHaveStyle({ flexGrow: '80' })
    expect(screen.getByTestId('pane-b')).toHaveStyle({ flexGrow: '20' })

    for (let i = 0; i < 30; i++) await fireEvent.keyDown(resizer, { key: 'ArrowLeft' })
    expect(screen.getByTestId('pane-a')).toHaveStyle({ flexGrow: '20' })
    expect(screen.getByTestId('pane-b')).toHaveStyle({ flexGrow: '80' })
  })

  it('drags with pointer events', async () => {
    const onLayout = vi.fn()
    render(Fixture, { onLayout })
    const resizer = screen.getByRole('separator')
    const group = screen.getByTestId('group')

    vi.spyOn(group, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
      height: 400,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect)

    await fireEvent.pointerDown(resizer, { button: 0, clientX: 400 })
    await fireEvent.pointerMove(resizer, { clientX: 500 })
    expect(screen.getByTestId('pane-a')).toHaveStyle({ flexGrow: '50' })

    await fireEvent.pointerUp(resizer)
    expect(onLayout).toHaveBeenCalledWith([50, 50])
  })

  it('uses vertical orientation values for vertical groups', () => {
    render(Fixture, { direction: 'vertical' })
    const resizer = screen.getByRole('separator')
    expect(resizer).toHaveAttribute('aria-orientation', 'horizontal')
    expect(screen.getByTestId('group')).toHaveAttribute('data-direction', 'vertical')
  })
})
