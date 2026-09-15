import { fireEvent, render, screen } from '@testing-library/svelte'
import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Fixture from './fixtures/pane-fixture.svelte'
import NestedFixture from './fixtures/pane-nested-fixture.svelte'

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

  it('nests a group inside a pane with its own resizer and sizes', () => {
    render(NestedFixture)
    const inner = screen.getByTestId('inner')
    const main = screen.getByTestId('main')
    expect(main.contains(inner)).toBe(true)
    expect(inner).toHaveAttribute('data-direction', 'vertical')
    expect(screen.getAllByRole('separator')).toHaveLength(2)
    // Inner panes are registered and sized independently of the outer group
    const innerPanes = inner.querySelectorAll('.sig-pane')
    expect(innerPanes).toHaveLength(2)
    for (const p of innerPanes) {
      const style = (p as HTMLElement).style
      expect(style.flexGrow).not.toBe('')
      expect(Number(style.flexGrow)).toBeGreaterThan(0)
    }
  })

  it('makes panes column flex containers so nested groups can fill them', () => {
    // Percentage heights do not resolve inside flex items; pane children must
    // size via flex. Guard the stylesheet rules that make nesting work.
    const src = readFileSync(resolve(process.cwd(), 'src/lib/pane/pane.svelte'), 'utf8')
    expect(src).toMatch(/\.sig-pane\)\s*\{[^}]*display:\s*flex/s)
    expect(src).toMatch(/\.sig-pane\s*>\s*\.sig-pane-group\)\s*\{[^}]*flex:\s*1/s)
  })
})
