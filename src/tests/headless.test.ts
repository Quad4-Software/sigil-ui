import { fireEvent } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  attachAccordion,
  attachAll,
  attachPaneGroup,
  attachRadioGroup,
  attachSwitch,
  attachTabs,
  attachTooltip,
  createMenu,
  createOverlay,
  createPopover,
  createTheme,
  createToastApi,
  createToaster,
  ToastStore
} from '../lib/headless/index.js'

function must<T>(value: T | null | undefined, what = 'element'): NonNullable<T> {
  if (value == null) throw new Error(`missing ${what}`)
  return value
}

function mount(html: string): HTMLElement {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  return host
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  document.body.innerHTML = ''
  delete document.documentElement.dataset.theme
})

describe('attachTabs', () => {
  const html = `
    <div class="sig-tabs">
      <div role="tablist">
        <button role="tab" data-value="a">A</button>
        <button role="tab" data-value="b">B</button>
        <button role="tab" data-value="c" disabled>C</button>
      </div>
      <div role="tabpanel">panel a</div>
      <div role="tabpanel">panel b</div>
      <div role="tabpanel">panel c</div>
    </div>`

  it('wires aria, roving tabindex and panel visibility', () => {
    const host = mount(html)
    const tabs = attachTabs(must(host.querySelector<HTMLElement>('.sig-tabs')))
    const tabEls = [...host.querySelectorAll<HTMLElement>('[role="tab"]')]
    const a = must(tabEls[0], 'tab a')
    const b = must(tabEls[1], 'tab b')
    const panels = [...host.querySelectorAll<HTMLElement>('[role="tabpanel"]')]

    expect(a).toHaveAttribute('aria-selected', 'true')
    expect(a.tabIndex).toBe(0)
    expect(b.tabIndex).toBe(-1)
    expect(panels[0]?.hidden).toBe(false)
    expect(panels[1]?.hidden).toBe(true)
    expect(a.getAttribute('aria-controls')).toBe(panels[0]?.id)

    fireEvent.click(b)
    expect(tabs.value).toBe('b')
    expect(b).toHaveAttribute('aria-selected', 'true')
    expect(b.dataset.state).toBe('active')
    expect(panels[1]?.hidden).toBe(false)
    expect(panels[0]?.hidden).toBe(true)
    tabs.destroy()
  })

  it('moves with arrow keys and skips disabled tabs', () => {
    const host = mount(html)
    attachTabs(must(host.querySelector<HTMLElement>('.sig-tabs')))
    const tabEls = [...host.querySelectorAll<HTMLElement>('[role="tab"]')]
    const a = must(tabEls[0], 'tab a')
    const b = must(tabEls[1], 'tab b')
    a.focus()
    fireEvent.keyDown(a, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(b)
    fireEvent.keyDown(b, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(a)
    fireEvent.keyDown(a, { key: 'End' })
    expect(document.activeElement).toBe(b)
  })

  it('supports ArrowLeft, Home, controller select and ignores disabled clicks', async () => {
    const host = mount(html)
    const onValueChange = vi.fn()
    const tabs = attachTabs(must(host.querySelector<HTMLElement>('.sig-tabs')), {
      value: 'b',
      onValueChange
    })
    const tabEls = [...host.querySelectorAll<HTMLElement>('[role="tab"]')]
    const a = must(tabEls[0], 'tab a')
    const b = must(tabEls[1], 'tab b')
    const c = must(tabEls[2], 'tab c')

    expect(tabs.value).toBe('b')
    b.focus()
    fireEvent.keyDown(b, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(a)
    expect(onValueChange).toHaveBeenCalledWith('a')

    fireEvent.keyDown(a, { key: 'Home' })
    expect(document.activeElement).toBe(a)

    await fireEvent.click(c)
    expect(tabs.value).toBe('a')

    tabs.select('b')
    expect(tabs.value).toBe('b')
    tabs.select('b')
    expect(onValueChange).toHaveBeenCalledTimes(2)
    tabs.destroy()
  })
})

describe('attachAccordion', () => {
  it('toggles items and enforces single-open', async () => {
    const host = mount(`
      <div class="sig-accordion">
        <div class="sig-acc-item" data-value="x">
          <button class="sig-acc-trigger">X</button>
          <div class="sig-acc-content">content x</div>
        </div>
        <div class="sig-acc-item" data-value="y">
          <button class="sig-acc-trigger">Y</button>
          <div class="sig-acc-content">content y</div>
        </div>
      </div>`)
    const acc = attachAccordion(must(host.querySelector<HTMLElement>('.sig-accordion')))
    const triggers = [...host.querySelectorAll<HTMLElement>('.sig-acc-trigger')]
    const x = must(triggers[0], 'trigger x')
    const y = must(triggers[1], 'trigger y')
    const contents = [...host.querySelectorAll<HTMLElement>('.sig-acc-content')]

    expect(x).toHaveAttribute('aria-expanded', 'false')
    expect(contents[0]?.hidden).toBe(true)

    await fireEvent.click(x)
    expect(x).toHaveAttribute('aria-expanded', 'true')
    expect(contents[0]?.hidden).toBe(false)

    await fireEvent.click(y)
    expect(y).toHaveAttribute('aria-expanded', 'true')
    expect(x).toHaveAttribute('aria-expanded', 'false')
    acc.destroy()
  })

  it('supports multiple open items, keyboard nav and the controller api', async () => {
    const host = mount(`
      <div class="sig-accordion">
        <div class="sig-acc-item" data-value="x">
          <button class="sig-acc-trigger">X</button>
          <div class="sig-acc-content">cx</div>
        </div>
        <div class="sig-acc-item" data-value="y">
          <button class="sig-acc-trigger">Y</button>
          <div class="sig-acc-content">cy</div>
        </div>
        <div class="sig-acc-item">
          <div>no trigger, filtered out</div>
        </div>
      </div>`)
    const onToggle = vi.fn()
    const acc = attachAccordion(must(host.querySelector<HTMLElement>('.sig-accordion')), {
      multiple: true,
      onToggle
    })
    const triggers = [...host.querySelectorAll<HTMLElement>('.sig-acc-trigger')]
    const x = must(triggers[0], 'x')
    const y = must(triggers[1], 'y')

    acc.open('x')
    acc.open('y')
    expect(x).toHaveAttribute('aria-expanded', 'true')
    expect(y).toHaveAttribute('aria-expanded', 'true')
    expect(onToggle).toHaveBeenCalledWith('y', true)

    acc.toggle('y')
    expect(y).toHaveAttribute('aria-expanded', 'false')
    acc.close('x')
    expect(x).toHaveAttribute('aria-expanded', 'false')
    acc.toggle('missing')

    x.focus()
    await fireEvent.keyDown(x, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(y)
    await fireEvent.keyDown(y, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(x)
    await fireEvent.keyDown(x, { key: 'End' })
    expect(document.activeElement).toBe(y)
    await fireEvent.keyDown(y, { key: 'Home' })
    expect(document.activeElement).toBe(x)
    await fireEvent.keyDown(x, { key: 'a' })
    acc.destroy()
  })
})

describe('attachRadioGroup', () => {
  it('checks on click and navigates with arrows', async () => {
    const host = mount(`
      <div class="sig-radio-group" role="radiogroup">
        <button role="radio" data-value="free">Free</button>
        <button role="radio" data-value="pro">Pro</button>
      </div>`)
    const group = attachRadioGroup(must(host.querySelector<HTMLElement>('.sig-radio-group')))
    const radios = [...host.querySelectorAll<HTMLElement>('[role="radio"]')]
    const free = must(radios[0], 'free radio')
    const pro = must(radios[1], 'pro radio')

    expect(free.tabIndex).toBe(0)
    await fireEvent.click(pro)
    expect(pro).toHaveAttribute('aria-checked', 'true')
    expect(pro.dataset.state).toBe('checked')
    expect(pro.tabIndex).toBe(0)
    expect(free.tabIndex).toBe(-1)

    pro.focus()
    await fireEvent.keyDown(pro, { key: 'ArrowDown' })
    expect(group.value).toBe('free')
    expect(document.activeElement).toBe(free)
    group.destroy()
  })

  it('honors an initial value, skips disabled items and wraps on ArrowUp', async () => {
    const host = mount(`
      <div class="sig-radio-group" role="radiogroup">
        <button role="radio" data-value="free">Free</button>
        <button role="radio" data-value="pro">Pro</button>
        <button role="radio" data-value="team" disabled>Team</button>
      </div>`)
    const onValueChange = vi.fn()
    const group = attachRadioGroup(must(host.querySelector<HTMLElement>('.sig-radio-group')), {
      value: 'pro',
      onValueChange
    })
    const radios = [...host.querySelectorAll<HTMLElement>('[role="radio"]')]
    const free = must(radios[0], 'free')
    const pro = must(radios[1], 'pro')
    const team = must(radios[2], 'team')

    expect(group.value).toBe('pro')
    expect(pro.tabIndex).toBe(0)

    await fireEvent.click(team)
    expect(group.value).toBe('pro')

    pro.focus()
    await fireEvent.keyDown(pro, { key: 'ArrowUp' })
    expect(group.value).toBe('free')
    await fireEvent.keyDown(free, { key: 'End' })
    expect(group.value).toBe('pro')
    await fireEvent.keyDown(free, { key: 'x' })
    group.select('pro')
    expect(onValueChange).toHaveBeenLastCalledWith('pro')
    group.destroy()
  })
})

describe('attachSwitch', () => {
  it('toggles aria-checked and skips disabled', async () => {
    const host = mount(`<button role="switch" class="sig-switch">x</button>`)
    const el = must(host.querySelector('button'))
    const sw = attachSwitch(el)
    expect(el).toHaveAttribute('aria-checked', 'false')
    await fireEvent.click(el)
    expect(el).toHaveAttribute('aria-checked', 'true')
    expect(el.dataset.state).toBe('checked')
    el.setAttribute('disabled', '')
    await fireEvent.click(el)
    expect(el).toHaveAttribute('aria-checked', 'true')
    sw.destroy()
  })
})

describe('createOverlay', () => {
  it('opens via trigger, traps Escape, restores focus', async () => {
    const host = mount(`
      <button id="trigger">open</button>
      <div class="sig-dialog-overlay"></div>
      <div class="sig-dialog-content"><button data-sig-close>close</button></div>`)
    const trigger = host.querySelector('#trigger') as HTMLElement
    const content = host.querySelector('.sig-dialog-content') as HTMLElement
    const overlay = host.querySelector('.sig-dialog-overlay') as HTMLElement
    trigger.focus()

    const dlg = createOverlay({ trigger, content, overlay })
    expect(content.hidden).toBe(true)

    await fireEvent.click(trigger)
    expect(dlg.isOpen()).toBe(true)
    expect(content.hidden).toBe(false)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(document.activeElement?.textContent).toBe('close')

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(dlg.isOpen()).toBe(false)
    expect(content.hidden).toBe(true)
    expect(document.activeElement).toBe(trigger)
    dlg.destroy()
  })

  it('closes on overlay click and close button', async () => {
    const host = mount(`
      <button id="t">open</button>
      <div class="sig-sheet-overlay"></div>
      <div class="sig-sheet-content"><button data-sig-close>x</button></div>`)
    const dlg = createOverlay({
      trigger: host.querySelector('#t') as HTMLElement,
      content: host.querySelector('.sig-sheet-content') as HTMLElement,
      overlay: host.querySelector('.sig-sheet-overlay') as HTMLElement
    })
    dlg.open()
    await fireEvent.click(host.querySelector('.sig-sheet-overlay') as HTMLElement)
    expect(dlg.isOpen()).toBe(false)
    dlg.open()
    await fireEvent.click(host.querySelector('[data-sig-close]') as HTMLElement)
    expect(dlg.isOpen()).toBe(false)
    dlg.destroy()
  })

  it('toggles, prefers autofocus targets and cycles Tab inside', async () => {
    const host = mount(`
      <button id="t">open</button>
      <div class="sig-dialog-content">
        <button id="first">first</button>
        <input id="auto" autofocus />
        <button id="last">last</button>
      </div>`)
    const onOpenChange = vi.fn()
    const dlg = createOverlay({
      trigger: host.querySelector('#t') as HTMLElement,
      content: host.querySelector('.sig-dialog-content') as HTMLElement,
      onOpenChange
    })
    // jsdom has no layout so offsetParent is null; fake visibility so the
    // focus trap sees all three controls
    for (const el of host.querySelectorAll<HTMLElement>('.sig-dialog-content *')) {
      Object.defineProperty(el, 'offsetParent', { get: () => document.body })
    }

    dlg.toggle()
    expect(dlg.isOpen()).toBe(true)
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(document.activeElement?.id).toBe('auto')

    const last = must(host.querySelector<HTMLElement>('#last'))
    last.focus()
    await fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement?.id).toBe('first')

    const first = must(host.querySelector<HTMLElement>('#first'))
    first.focus()
    await fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement?.id).toBe('last')

    dlg.toggle()
    expect(dlg.isOpen()).toBe(false)
    expect(document.body.style.overflow).toBe('')
    dlg.destroy()
  })

  it('works without a trigger or overlay element', () => {
    const host = mount(`<div class="sig-dialog-content"><button>b</button></div>`)
    const dlg = createOverlay({
      content: host.querySelector('.sig-dialog-content') as HTMLElement
    })
    dlg.open()
    expect(dlg.isOpen()).toBe(true)
    dlg.close()
    dlg.destroy()
  })
})

describe('createPopover', () => {
  it('toggles, sets aria, closes on outside click and Escape', async () => {
    const host = mount(`<button id="t">pop</button><div class="sig-pop-content">panel</div>`)
    const trigger = host.querySelector('#t') as HTMLElement
    const content = host.querySelector('.sig-pop-content') as HTMLElement
    const pop = createPopover({ trigger, content })

    await fireEvent.click(trigger)
    expect(pop.isOpen()).toBe(true)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(content.dataset.state).toBe('open')

    await fireEvent.pointerDown(document.body)
    expect(pop.isOpen()).toBe(false)

    await fireEvent.click(trigger)
    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(pop.isOpen()).toBe(false)
    pop.destroy()
  })
})

describe('createMenu', () => {
  it('opens, navigates items, Escape restores focus', async () => {
    const host = mount(`
      <button id="t">menu</button>
      <div class="sig-menu-content">
        <button role="menuitem">One</button>
        <button role="menuitem">Two</button>
      </div>`)
    const trigger = host.querySelector('#t') as HTMLElement
    const content = host.querySelector('.sig-menu-content') as HTMLElement
    const menu = createMenu({ trigger, content })

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(menu.isOpen()).toBe(true)
    const items = [...content.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    expect(document.activeElement).toBe(items[0])

    await fireEvent.keyDown(content, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[1])
    await fireEvent.keyDown(content, { key: 'Escape' })
    expect(menu.isOpen()).toBe(false)
    expect(document.activeElement).toBe(trigger)
    menu.destroy()
  })
})

describe('attachTooltip', () => {
  it('shows on focus and hides on blur', async () => {
    const host = mount(
      `<span class="sig-tip-wrap"><button>hover</button><span class="sig-tip">tip</span></span>`
    )
    const trigger = must(host.querySelector('button'))
    const tip = must(host.querySelector<HTMLElement>('.sig-tip'))
    const tt = attachTooltip(trigger, tip, { delay: 0 })
    expect(tip.hidden).toBe(true)
    expect(trigger.getAttribute('aria-describedby')).toBe(tip.id)

    await fireEvent.focus(trigger)
    await new Promise((r) => setTimeout(r, 5))
    expect(tip.hidden).toBe(false)
    await fireEvent.blur(trigger)
    expect(tip.hidden).toBe(true)
    tt.destroy()
  })
})

describe('attachPaneGroup', () => {
  it('sizes panes and resizes via keyboard', async () => {
    const host = mount(`
      <div class="sig-pane-group" data-direction="horizontal" style="width: 400px">
        <div class="sig-pane" data-default-size="30" data-min="10"></div>
        <div class="sig-pane-resizer"></div>
        <div class="sig-pane" data-min="10"></div>
      </div>`)
    const group = attachPaneGroup(host.querySelector('.sig-pane-group') as HTMLElement)
    const resizer = host.querySelector('.sig-pane-resizer') as HTMLElement
    const panes = [...host.querySelectorAll<HTMLElement>('.sig-pane')]

    expect(resizer).toHaveAttribute('role', 'separator')
    expect(panes[0]?.style.flexGrow).toBe('30')
    expect(group.sizes()).toEqual([30, 70])

    await fireEvent.keyDown(resizer, { key: 'ArrowRight' })
    expect(group.sizes()).toEqual([32, 68])
    expect(resizer).toHaveAttribute('aria-valuenow', '32')
    group.destroy()
  })
})

describe('createToaster', () => {
  it('renders toasts into the container and dismisses them', async () => {
    const host = mount('')
    const store = new ToastStore()
    const api = createToastApi(store)
    const t = createToaster(host, { store })

    api.success('Saved', { description: 'done', duration: 0 })
    expect(host.querySelector('.sig-toast')).toBeTruthy()
    expect(host.querySelector('.sig-toast')?.getAttribute('role')).toBe('status')
    expect(host.querySelector('.sig-toast-title')?.textContent).toBe('Saved')

    api.danger('Failed', { duration: 0 })
    const toasts = host.querySelectorAll('.sig-toast')
    expect(toasts.length).toBe(2)
    expect(toasts[1]?.getAttribute('role')).toBe('alert')

    store.dismiss(store.toasts[0]?.id ?? 0)
    expect(host.querySelectorAll('.sig-toast').length).toBe(1)
    t.destroy()
  })
})

describe('createTheme', () => {
  it('stamps data-theme, toggles and persists', () => {
    const theme = createTheme({ key: 'sig-test-theme', defaultMode: 'light' })
    expect(document.documentElement.dataset.theme).toBe('light')
    theme.toggle()
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('sig-test-theme')).toBe('"dark"')
    theme.set('system')
    expect(theme.mode).toBe('system')
    theme.destroy()
  })
})

describe('attachAll', () => {
  it('auto-wires recognized structures', async () => {
    const host = mount(`
      <button role="switch" class="sig-switch">s</button>
      <div class="sig-tabs">
        <div role="tablist"><button role="tab" data-value="a">A</button></div>
        <div role="tabpanel">p</div>
      </div>`)
    const destroy = attachAll(host)
    const sw = host.querySelector('.sig-switch') as HTMLElement
    await fireEvent.click(sw)
    expect(sw).toHaveAttribute('aria-checked', 'true')
    destroy()
  })
})

describe('createPopover placement', () => {
  it('positions each side and reports through onOpenChange', async () => {
    const host = mount(`<button id="t">pop</button><div class="sig-pop-content">panel</div>`)
    const trigger = host.querySelector('#t') as HTMLElement
    const content = host.querySelector('.sig-pop-content') as HTMLElement
    const onOpenChange = vi.fn()
    const pop = createPopover({ trigger, content, side: 'top', align: 'end', onOpenChange })

    pop.open()
    expect(pop.isOpen()).toBe(true)
    expect(content.style.position).toBe('absolute')
    expect(content.dataset.side).toBe('top')
    expect(onOpenChange).toHaveBeenCalledWith(true)

    pop.toggle()
    expect(pop.isOpen()).toBe(false)
    pop.toggle()
    expect(pop.isOpen()).toBe(true)
    pop.destroy()
  })

  it('repositions on resize for left and right sides', async () => {
    const host = mount(`<button id="t">pop</button><div class="sig-pop-content">panel</div>`)
    const trigger = host.querySelector('#t') as HTMLElement
    const content = host.querySelector('.sig-pop-content') as HTMLElement
    const pop = createPopover({ trigger, content, side: 'right', align: 'start' })
    pop.open()
    window.dispatchEvent(new Event('resize'))
    document.dispatchEvent(new Event('scroll'))
    expect(content.style.left).toContain('px')
    pop.destroy()

    const pop2 = createPopover({ trigger, content, side: 'left', align: 'end' })
    pop2.open()
    expect(content.dataset.side).toBe('left')
    pop2.destroy()
  })
})

describe('createMenu keyboard', () => {
  const menuHtml = `
    <button id="t">menu</button>
    <div class="sig-menu-content">
      <button role="menuitem">One</button>
      <button role="menuitem" disabled>Two</button>
      <button role="menuitem">Three</button>
    </div>`

  it('supports ArrowUp, Home, End, Tab and item click', async () => {
    const host = mount(menuHtml)
    const trigger = host.querySelector('#t') as HTMLElement
    const content = host.querySelector('.sig-menu-content') as HTMLElement
    const onOpenChange = vi.fn()
    const menu = createMenu({ trigger, content, onOpenChange })

    await fireEvent.click(trigger)
    expect(menu.isOpen()).toBe(true)
    const items = [...content.querySelectorAll<HTMLElement>('[role="menuitem"]')]

    await fireEvent.keyDown(content, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(items[2])
    await fireEvent.keyDown(content, { key: 'Home' })
    expect(document.activeElement).toBe(items[0])
    await fireEvent.keyDown(content, { key: 'End' })
    expect(document.activeElement).toBe(items[2])

    await fireEvent.click(must(items[0]))
    expect(menu.isOpen()).toBe(false)

    menu.open()
    await fireEvent.keyDown(content, { key: 'Tab' })
    expect(menu.isOpen()).toBe(false)

    menu.open()
    await fireEvent.pointerDown(document.body)
    expect(menu.isOpen()).toBe(false)
    menu.destroy()
  })
})

describe('attachTooltip hover and Escape', () => {
  it('shows on pointerenter, hides on leave and Escape', async () => {
    const host = mount(
      `<span class="sig-tip-wrap"><button>hover</button><span class="sig-tip">tip</span></span>`
    )
    const trigger = must(host.querySelector('button'))
    const tip = must(host.querySelector<HTMLElement>('.sig-tip'))
    const tt = attachTooltip(trigger, tip, { delay: 0 })

    await fireEvent.pointerEnter(trigger)
    await new Promise((r) => setTimeout(r, 5))
    expect(tip.hidden).toBe(false)
    expect(tip.dataset.state).toBe('open')

    await fireEvent.keyDown(document, { key: 'Escape' })
    expect(tip.hidden).toBe(true)

    await fireEvent.pointerEnter(trigger)
    await new Promise((r) => setTimeout(r, 5))
    await fireEvent.pointerLeave(trigger)
    expect(tip.hidden).toBe(true)
    tt.destroy()
  })

  it('stays hidden when focus leaves before the delay', async () => {
    const host = mount(
      `<span class="sig-tip-wrap"><button>hover</button><span class="sig-tip">tip</span></span>`
    )
    const trigger = must(host.querySelector('button'))
    const tip = must(host.querySelector<HTMLElement>('.sig-tip'))
    const tt = attachTooltip(trigger, tip, { delay: 50 })

    await fireEvent.focus(trigger)
    await fireEvent.blur(trigger)
    await new Promise((r) => setTimeout(r, 60))
    expect(tip.hidden).toBe(true)
    tt.destroy()
  })
})

describe('attachPaneGroup interactions', () => {
  function paneHost(direction = 'horizontal') {
    const host = mount(`
      <div class="sig-pane-group" data-direction="${direction}">
        <div class="sig-pane" data-default-size="30" data-min="10"></div>
        <div class="sig-pane-resizer"></div>
        <div class="sig-pane" data-min="10"></div>
      </div>`)
    const root = must(host.querySelector<HTMLElement>('.sig-pane-group'))
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
      width: 400,
      height: 400,
      top: 0,
      left: 0,
      right: 400,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect)
    return { host, root, resizer: must(host.querySelector<HTMLElement>('.sig-pane-resizer')) }
  }

  it('resizes via pointer drag and honors min constraints', async () => {
    const { root, resizer } = paneHost()
    const group = attachPaneGroup(root)

    await fireEvent.pointerDown(resizer, { clientX: 100, pointerId: 1 })
    expect(resizer.dataset.dragging).toBeDefined()
    await fireEvent.pointerMove(resizer, { clientX: 140, pointerId: 1 })
    expect(group.sizes()).toEqual([40, 60])
    await fireEvent.pointerUp(resizer, { pointerId: 1 })

    // dragging far past the min clamps at data-min=10
    await fireEvent.pointerDown(resizer, { clientX: 100, pointerId: 1 })
    await fireEvent.pointerMove(resizer, { clientX: -800, pointerId: 1 })
    expect(group.sizes()).toEqual([10, 90])
    await fireEvent.pointerUp(resizer, { pointerId: 1 })
    group.destroy()
  })

  it('supports vertical direction, Home and End keys', async () => {
    const { root, resizer } = paneHost('vertical')
    const group = attachPaneGroup(root)
    expect(resizer).toHaveAttribute('aria-orientation', 'vertical')

    await fireEvent.keyDown(resizer, { key: 'ArrowDown' })
    expect(group.sizes()).toEqual([32, 68])
    await fireEvent.keyDown(resizer, { key: 'ArrowUp', shiftKey: true })
    expect(group.sizes()).toEqual([22, 78])
    await fireEvent.keyDown(resizer, { key: 'End' })
    expect(group.sizes()).toEqual([90, 10])
    await fireEvent.keyDown(resizer, { key: 'Home' })
    expect(group.sizes()).toEqual([10, 90])
    await fireEvent.keyDown(resizer, { key: 'x' })
    group.destroy()
  })

  it('persists and restores layouts through autosave', () => {
    const { root, resizer } = paneHost()
    root.dataset.autosave = 'layout-test'
    const group = attachPaneGroup(root)
    group.setSizes([25, 75])
    expect(localStorage.getItem('sig-panes-layout-test')).toBe('[25,75]')
    group.destroy()

    const second = attachPaneGroup(root)
    expect(second.sizes()).toEqual([25, 75])
    second.setSizes([1, 2, 3])
    expect(second.sizes()).toEqual([25, 75])
    second.destroy()
    void resizer
  })
})

describe('createToaster behavior', () => {
  it('renders actions, closes via button and caps at five', async () => {
    const host = mount('')
    const store = new ToastStore()
    const api = createToastApi(store)
    const t = createToaster(host, { store, position: 'top-left' })
    expect(host.querySelector('.sig-toaster')?.getAttribute('data-position')).toBe('top-left')

    const clicked = vi.fn()
    api('Heads up', {
      duration: 0,
      action: { label: 'Undo', onclick: clicked }
    })
    const action = must(host.querySelector<HTMLElement>('.sig-toast-action'))
    await fireEvent.click(action)
    expect(clicked).toHaveBeenCalled()

    await fireEvent.click(must(host.querySelector<HTMLElement>('.sig-toast-close')))
    expect(host.querySelectorAll('.sig-toast')).toHaveLength(0)

    for (let i = 0; i < 7; i++) api.info(`toast ${i}`, { duration: 0 })
    expect(host.querySelectorAll('.sig-toast')).toHaveLength(5)
    expect(store.toasts[0]?.title).toBe('toast 2')

    api.clear()
    expect(host.querySelectorAll('.sig-toast')).toHaveLength(0)
    t.destroy()
  })

  it('auto-dismisses on a timer and pauses on hover', async () => {
    vi.useFakeTimers()
    const host = mount('')
    const store = new ToastStore()
    const api = createToastApi(store)
    const t = createToaster(host, { store })

    api.info('gone soon', { duration: 100 })
    const el = must(host.querySelector<HTMLElement>('.sig-toast'))
    await fireEvent.pointerEnter(el)
    vi.advanceTimersByTime(200)
    expect(store.toasts).toHaveLength(1)

    await fireEvent.pointerLeave(el)
    vi.advanceTimersByTime(150)
    expect(store.toasts).toHaveLength(0)
    t.destroy()
    vi.useRealTimers()
  })
})

describe('createTheme callbacks', () => {
  it('fires onChange and resolves system through matchMedia', () => {
    const onChange = vi.fn()
    const theme = createTheme({ key: 'sig-test-theme-2', onChange })
    expect(theme.resolved).toBe('light')
    expect(onChange).toHaveBeenCalledWith('light')

    theme.mode = 'dark'
    expect(theme.resolved).toBe('dark')
    expect(onChange).toHaveBeenLastCalledWith('dark')

    theme.toggle()
    expect(theme.mode).toBe('light')
    theme.destroy()
  })
})

describe('persistedValue', () => {
  it('round-trips values and syncs across storage events', async () => {
    const { persistedValue } = await import('../lib/headless/persisted.js')
    const onExternal = vi.fn()
    const store = persistedValue<string>('sig-p-test', 'a', onExternal)
    expect(store.value).toBe('a')

    store.value = 'b'
    expect(localStorage.getItem('sig-p-test')).toBe('"b"')

    window.dispatchEvent(new StorageEvent('storage', { key: 'sig-p-test', newValue: '"c"' }))
    expect(store.value).toBe('c')
    expect(onExternal).toHaveBeenCalledWith('c')

    window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: '"x"' }))
    expect(store.value).toBe('c')

    window.dispatchEvent(new StorageEvent('storage', { key: 'sig-p-test', newValue: '{bad' }))
    expect(store.value).toBe('c')

    window.dispatchEvent(new StorageEvent('storage', { key: 'sig-p-test', newValue: null }))
    expect(store.value).toBe('a')
    store.destroy()
  })
})
