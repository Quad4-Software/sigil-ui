import { fireEvent } from '@testing-library/svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  attachCarousel,
  attachCheckbox,
  attachEditable,
  attachFileUpload,
  attachNumberInput,
  attachPagination,
  attachPinInput,
  attachRating,
  attachSlider,
  attachTagsInput,
  attachToggle,
  attachToggleGroup,
  attachTree,
  createHoverCard
} from '../lib/headless/index.js'

function mount(html: string): HTMLElement {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  return host
}

function must<T>(value: T | null | undefined, what = 'element'): NonNullable<T> {
  if (value == null) throw new Error(`missing ${what}`)
  return value
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('attachCheckbox', () => {
  it('syncs data-state and reports changes', async () => {
    const host = mount('<input type="checkbox" class="sig-checkbox" />')
    const input = must(host.querySelector('input'))
    const onChange = vi.fn()
    const c = attachCheckbox(input, { onChange })
    expect(input.dataset.state).toBe('unchecked')
    await fireEvent.click(input)
    expect(c.checked).toBe(true)
    expect(input.dataset.state).toBe('checked')
    expect(onChange).toHaveBeenCalledWith(true)
    c.indeterminate = true
    expect(input.dataset.state).toBe('indeterminate')
    expect(input.indeterminate).toBe(true)
    c.destroy()
  })
})

describe('attachToggle', () => {
  it('toggles aria-pressed and data-state', async () => {
    const host = mount('<button class="sig-toggle">B</button>')
    const el = must(host.querySelector('button'))
    const t = attachToggle(el)
    expect(el.getAttribute('aria-pressed')).toBe('false')
    await fireEvent.click(el)
    expect(t.pressed).toBe(true)
    expect(el.dataset.state).toBe('on')
    t.destroy()
  })
})

describe('attachToggleGroup', () => {
  const html = `
    <div class="sig-toggle-group" data-type="single">
      <button class="sig-toggle-item" data-value="left">L</button>
      <button class="sig-toggle-item" data-value="center">C</button>
    </div>`

  it('single-select switches value, arrows move focus', async () => {
    const host = mount(html)
    const root = must(host.querySelector<HTMLElement>('.sig-toggle-group'))
    const onValueChange = vi.fn()
    const g = attachToggleGroup(root, { onValueChange })
    const items = [...root.querySelectorAll('button')]
    const l = must(items[0], 'left toggle')
    const c = must(items[1], 'center toggle')
    await fireEvent.click(l)
    expect(g.value).toBe('left')
    expect(l.getAttribute('aria-pressed')).toBe('true')
    await fireEvent.click(c)
    expect(g.value).toBe('center')
    l.focus()
    await fireEvent.keyDown(l, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(c)
    g.destroy()
  })

  it('multiple mode accumulates', async () => {
    const host = mount(html.replace('data-type="single"', 'data-type="multiple"'))
    const g = attachToggleGroup(must(host.querySelector('.sig-toggle-group')))
    const items = [...host.querySelectorAll('button')]
    const l = must(items[0], 'left toggle')
    const c = must(items[1], 'center toggle')
    await fireEvent.click(l)
    await fireEvent.click(c)
    expect(g.value).toEqual(['left', 'center'])
    g.destroy()
  })
})

describe('attachSlider', () => {
  it('syncs the fill variable and reports values', async () => {
    const host = mount(
      '<span class="sig-slider"><input type="range" min="0" max="100" value="40" /></span>'
    )
    const input = must(host.querySelector('input'))
    const onChange = vi.fn()
    const s = attachSlider(must(host.querySelector('.sig-slider')), { onChange })
    expect(input.style.getPropertyValue('--sig-slider-pct')).toBe('40%')
    await fireEvent.input(input, { target: { value: '70' } })
    expect(s.value).toBe(70)
    expect(input.style.getPropertyValue('--sig-slider-pct')).toBe('70%')
    expect(onChange).toHaveBeenCalledWith(70)
    s.destroy()
  })
})

describe('attachTagsInput', () => {
  const html = '<div class="sig-tags-input"><input class="sig-tags-field" /></div>'

  it('adds on Enter, removes on Backspace and remove buttons', async () => {
    const host = mount(html)
    const input = must(host.querySelector('input'))
    const t = attachTagsInput(must(host.querySelector('.sig-tags-input')), { tags: ['a'] })
    expect(host.querySelectorAll('.sig-tag').length).toBe(1)
    await fireEvent.input(input, { target: { value: 'beta' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(t.tags).toEqual(['a', 'beta'])
    expect(input.value).toBe('')
    await fireEvent.keyDown(input, { key: 'Backspace' })
    expect(t.tags).toEqual(['a'])
    await fireEvent.click(must(host.querySelector('.sig-tag-remove')))
    expect(t.tags).toEqual([])
    t.destroy()
  })

  it('rejects duplicates unless allowed', async () => {
    const host = mount(html)
    const input = must(host.querySelector('input'))
    const t = attachTagsInput(must(host.querySelector('.sig-tags-input')), { tags: ['a'] })
    await fireEvent.input(input, { target: { value: 'a' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(t.tags).toEqual(['a'])
    t.destroy()
  })
})

describe('attachPagination', () => {
  it('renders pages with gaps and navigates', async () => {
    const host = mount('<nav class="sig-pagination"></nav>')
    const onPageChange = vi.fn()
    const p = attachPagination(must(host.querySelector('nav')), { total: 10, onPageChange })
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe('1')
    const next = must([...host.querySelectorAll('.sig-page-btn')].at(-1))
    await fireEvent.click(next)
    expect(p.page).toBe(2)
    expect(onPageChange).toHaveBeenCalledWith(2)
    p.goTo(10)
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe('10')
    expect(host.querySelectorAll('.sig-page-gap').length).toBeGreaterThan(0)
    p.destroy()
  })
})

describe('attachTree', () => {
  const html = `
    <div class="sig-tree" role="tree">
      <ul class="sig-tree-level" role="group">
        <li role="none">
          <button role="treeitem" class="sig-tree-item" data-value="src">
            <svg class="sig-tree-chevron"></svg>src
          </button>
          <ul class="sig-tree-level" role="group">
            <li role="none">
              <button role="treeitem" class="sig-tree-item" data-value="lib">lib</button>
            </li>
          </ul>
        </li>
      </ul>
    </div>`

  it('collapses sub-groups and expands on ArrowRight', async () => {
    const host = mount(html)
    const tree = attachTree(must(host.querySelector('.sig-tree')))
    const src = must(host.querySelector<HTMLElement>('[data-value="src"]'))
    const sub = must(host.querySelectorAll('ul')[1])
    expect(sub.hidden).toBe(true)
    expect(src.getAttribute('aria-expanded')).toBe('false')
    await fireEvent.keyDown(src, { key: 'ArrowRight' })
    expect(sub.hidden).toBe(false)
    expect(src.getAttribute('aria-expanded')).toBe('true')
    expect(tree.expanded.has('src')).toBe(true)
    tree.destroy()
  })

  it('selects on click and ArrowDown moves to visible items', async () => {
    const host = mount(html)
    const onSelect = vi.fn()
    const tree = attachTree(must(host.querySelector('.sig-tree')), {
      expanded: ['src'],
      onSelect
    })
    const src = must(host.querySelector<HTMLElement>('[data-value="src"]'))
    const lib = must(host.querySelector<HTMLElement>('[data-value="lib"]'))
    await fireEvent.click(lib)
    expect(tree.selected).toBe('lib')
    expect(lib.dataset.state).toBe('selected')
    src.focus()
    await fireEvent.keyDown(src, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(lib)
    tree.destroy()
  })
})

describe('createHoverCard', () => {
  it('opens after openDelay and closes after closeDelay', async () => {
    vi.useFakeTimers()
    const host = mount(
      '<span class="sig-hover-wrap"><button>trigger</button><div class="sig-hover-card">card</div></span>'
    )
    const wrap = must(host.querySelector('.sig-hover-wrap'))
    const card = must(host.querySelector<HTMLElement>('.sig-hover-card'))
    const hc = createHoverCard(wrap as HTMLElement, { openDelay: 50, closeDelay: 30 })
    expect(card.hidden).toBe(true)
    await fireEvent.mouseEnter(must(host.querySelector('button')))
    vi.advanceTimersByTime(60)
    expect(card.hidden).toBe(false)
    expect(hc.open).toBe(true)
    await fireEvent.mouseLeave(must(host.querySelector('button')))
    vi.advanceTimersByTime(40)
    expect(hc.open).toBe(false)
    hc.destroy()
    vi.useRealTimers()
  })
})

describe('attachFileUpload', () => {
  it('lists dropped files and removes them', async () => {
    const host = mount(
      '<div class="sig-file-upload"><button class="sig-dropzone">Drop</button><input type="file" class="sig-file-input" /><ul class="sig-file-list"></ul></div>'
    )
    const root = must(host.querySelector<HTMLElement>('.sig-file-upload'))
    const onChange = vi.fn()
    const c = attachFileUpload(root, { onChange })
    const file = new File(['x'], 'a.txt', { type: 'text/plain' })
    await fireEvent.drop(must(host.querySelector('.sig-dropzone')), {
      dataTransfer: { files: [file] }
    })
    expect(c.files.map((f) => f.name)).toEqual(['a.txt'])
    expect(host.querySelector('.sig-file-name')?.textContent).toBe('a.txt')
    await fireEvent.click(must(host.querySelector('.sig-file-remove')))
    expect(c.files).toEqual([])
    c.destroy()
  })
})

describe('attachNumberInput', () => {
  const html = `
    <span class="sig-number-input">
      <button class="sig-number-btn sig-number-dec"></button>
      <input class="sig-number-field" value="5" />
      <button class="sig-number-btn sig-number-inc"></button>
    </span>`

  it('steps and clamps', async () => {
    const host = mount(html)
    const root = must(host.querySelector('.sig-number-input'))
    const onChange = vi.fn()
    const n = attachNumberInput(root as HTMLElement, { min: 0, max: 6, onChange })
    await fireEvent.click(must(host.querySelector('.sig-number-inc')))
    expect(n.value).toBe(6)
    await fireEvent.click(must(host.querySelector('.sig-number-inc')))
    expect(n.value).toBe(6)
    const input = must(host.querySelector('input'))
    expect(input.getAttribute('aria-valuenow')).toBe('6')
    n.destroy()
  })

  it('keyboard steps and Enter commits', async () => {
    const host = mount(html)
    const input = must(host.querySelector('input'))
    const n = attachNumberInput(must(host.querySelector('.sig-number-input')), {
      min: 0,
      max: 10
    })
    await fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(n.value).toBe(4)
    await fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(n.value).toBe(5)
    input.value = '8'
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(n.value).toBe(8)
    n.destroy()
  })

  it('decrement button, blur commit and invalid input resets', async () => {
    const host = mount(html)
    const input = must(host.querySelector('input'))
    const n = attachNumberInput(must(host.querySelector('.sig-number-input')), {
      min: 2,
      max: 10
    })
    await fireEvent.click(must(host.querySelector('.sig-number-dec')))
    expect(n.value).toBe(4)
    input.value = 'abc'
    await fireEvent.blur(input)
    expect(n.value).toBe(4)
    expect(input.value).toBe('4')
    n.value = 99
    expect(n.value).toBe(10)
    n.destroy()
  })
})

describe('attachPinInput', () => {
  const pinHtml =
    '<span class="sig-pin-input"><input class="sig-pin-cell" /><input class="sig-pin-cell" /><input class="sig-pin-cell" /></span>'

  it('advances on digits and completes', async () => {
    const host = mount(pinHtml)
    const cells = [...host.querySelectorAll('input')]
    const onComplete = vi.fn()
    const p = attachPinInput(must(host.querySelector('.sig-pin-input')), { onComplete })
    await fireEvent.input(must(cells[0]), { target: { value: '1' } })
    expect(document.activeElement).toBe(cells[1])
    await fireEvent.input(must(cells[1]), { target: { value: '2' } })
    await fireEvent.input(must(cells[2]), { target: { value: '3' } })
    expect(p.value).toBe('123')
    expect(onComplete).toHaveBeenCalledWith('123')
    p.destroy()
  })

  it('Backspace clears then steps back, arrows move focus', async () => {
    const host = mount(pinHtml)
    const cells = [...host.querySelectorAll('input')]
    const p = attachPinInput(must(host.querySelector('.sig-pin-input')))
    p.value = '12'
    const second = must(cells[1])
    const third = must(cells[2])
    await fireEvent.keyDown(second, { key: 'Backspace' })
    expect(second.value).toBe('')
    await fireEvent.keyDown(second, { key: 'Backspace' })
    expect(document.activeElement).toBe(cells[0])
    await fireEvent.keyDown(must(cells[0]), { key: 'ArrowRight' })
    expect(document.activeElement).toBe(second)
    await fireEvent.keyDown(third, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(second)
    p.destroy()
  })

  it('paste distributes digits', async () => {
    const host = mount(pinHtml)
    const cells = [...host.querySelectorAll('input')]
    const p = attachPinInput(must(host.querySelector('.sig-pin-input')))
    const data = { getData: () => '9-8-7' }
    await fireEvent.paste(must(cells[0]), { clipboardData: data })
    expect(p.value).toBe('987')
    expect(must(cells[2]).value).toBe('7')
    p.destroy()
  })
})

describe('attachRating', () => {
  it('sets, clears and arrow-adjusts', async () => {
    const host = mount(
      '<span class="sig-rating"><button class="sig-rating-star"></button><button class="sig-rating-star"></button><button class="sig-rating-star"></button></span>'
    )
    const stars = [...host.querySelectorAll('button')]
    const r = attachRating(must(host.querySelector('.sig-rating')))
    await fireEvent.click(must(stars[1]))
    expect(r.value).toBe(2)
    expect(must(stars[1]).dataset.filled).toBeDefined()
    await fireEvent.click(must(stars[1]))
    expect(r.value).toBe(0)
    await fireEvent.keyDown(must(stars[0]), { key: 'ArrowRight' })
    expect(r.value).toBe(1)
    await fireEvent.keyDown(must(stars[0]), { key: 'ArrowLeft' })
    expect(r.value).toBe(0)
    r.destroy()
  })

  it('respects data-readonly and clamps the setter', async () => {
    const host = mount(
      '<span class="sig-rating" data-readonly><button class="sig-rating-star"></button><button class="sig-rating-star"></button></span>'
    )
    const stars = [...host.querySelectorAll('button')]
    const r = attachRating(must(host.querySelector('.sig-rating')))
    await fireEvent.click(must(stars[1]))
    expect(r.value).toBe(0)
    r.value = 9
    expect(r.value).toBe(2)
    r.destroy()
  })
})

describe('attachEditable', () => {
  const editableHtml =
    '<span class="sig-editable"><button class="sig-editable-preview">name</button><input class="sig-editable-input" hidden /></span>'

  it('edits, commits on Enter', async () => {
    const host = mount(editableHtml)
    const preview = must(host.querySelector<HTMLElement>('.sig-editable-preview'))
    const input = must(host.querySelector<HTMLInputElement>('.sig-editable-input'))
    const e = attachEditable(must(host.querySelector('.sig-editable')))
    e.edit()
    expect(input.hidden).toBe(false)
    expect(preview.hidden).toBe(true)
    input.value = 'renamed'
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(e.value).toBe('renamed')
    expect(preview.hidden).toBe(false)
    e.destroy()
  })

  it('Escape reverts the draft and preview click starts editing', async () => {
    const host = mount(editableHtml)
    const input = must(host.querySelector<HTMLInputElement>('.sig-editable-input'))
    const e = attachEditable(must(host.querySelector('.sig-editable')))
    await fireEvent.click(must(host.querySelector('.sig-editable-preview')))
    expect(e.editing).toBe(true)
    input.value = 'dropped'
    await fireEvent.keyDown(input, { key: 'Escape' })
    expect(e.editing).toBe(false)
    expect(e.value).toBe('name')
    e.destroy()
  })

  it('blur submits by default and cancels with submitOnBlur false', async () => {
    const host = mount(editableHtml)
    const input = must(host.querySelector<HTMLInputElement>('.sig-editable-input'))
    const onSubmit = vi.fn()
    const e = attachEditable(must(host.querySelector('.sig-editable')), { onSubmit })
    e.edit()
    input.value = 'b'
    await fireEvent.blur(input)
    expect(e.value).toBe('b')
    expect(onSubmit).toHaveBeenCalledWith('b')
    e.destroy()

    const host2 = mount(editableHtml)
    const input2 = must(host2.querySelector<HTMLInputElement>('.sig-editable-input'))
    const e2 = attachEditable(must(host2.querySelector('.sig-editable')), {
      submitOnBlur: false
    })
    e2.edit()
    input2.value = 'b'
    await fireEvent.blur(input2)
    expect(e2.value).toBe('name')
    e2.destroy()
  })
})

describe('attachCarousel', () => {
  const html = `
    <div class="sig-carousel">
      <div class="sig-carousel-viewport"><div class="sig-carousel-track">
        <div class="sig-carousel-item">a</div>
        <div class="sig-carousel-item">b</div>
        <div class="sig-carousel-item">c</div>
      </div></div>
      <button class="sig-carousel-prev"></button>
      <button class="sig-carousel-next"></button>
      <div class="sig-carousel-dots"></div>
    </div>`

  it('navigates, loops and builds dots', async () => {
    const host = mount(html)
    const track = must(host.querySelector<HTMLElement>('.sig-carousel-track'))
    const c = attachCarousel(must(host.querySelector('.sig-carousel')))
    expect(host.querySelectorAll('.sig-carousel-dot').length).toBe(3)
    await fireEvent.click(must(host.querySelector('.sig-carousel-next')))
    expect(c.index).toBe(1)
    expect(track.style.transform).toBe('translateX(-100%)')
    c.goTo(-1)
    expect(c.index).toBe(2)
    c.destroy()
  })

  it('dot clicks and arrow keys navigate', async () => {
    const host = mount(html)
    const c = attachCarousel(must(host.querySelector('.sig-carousel')))
    const dots = [...host.querySelectorAll('.sig-carousel-dot')]
    await fireEvent.click(must(dots[2]))
    expect(c.index).toBe(2)
    const root = must(host.querySelector('.sig-carousel'))
    await fireEvent.keyDown(root, { key: 'ArrowRight' })
    expect(c.index).toBe(0)
    await fireEvent.keyDown(root, { key: 'ArrowLeft' })
    expect(c.index).toBe(2)
    c.destroy()
  })

  it('throws on incomplete markup', () => {
    const host = mount('<div class="sig-carousel"></div>')
    expect(() => attachCarousel(must(host.querySelector('.sig-carousel')))).toThrow(
      /sig-carousel-track/
    )
  })
})
