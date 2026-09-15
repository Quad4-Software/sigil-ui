import { fireEvent, render, screen, waitFor } from '@testing-library/svelte'
import { createRawSnippet } from 'svelte'
import { describe, expect, it, vi } from 'vitest'
import { AspectRatio } from '../lib/aspect-ratio/index.js'
import { AvatarGroup } from '../lib/avatar-group/index.js'
import { FileUpload } from '../lib/file-upload/index.js'
import { Marquee } from '../lib/marquee/index.js'
import { Presence } from '../lib/presence/index.js'
import { TagsInput } from '../lib/tags-input/index.js'
import { Timeline } from '../lib/timeline/index.js'
import { Tree } from '../lib/tree/index.js'
import AlertDialogFixture from './fixtures/alert-dialog-fixture.svelte'
import HoverCardFixture from './fixtures/hover-card-fixture.svelte'
import MenubarFixture from './fixtures/menubar-fixture.svelte'
import StepperFixture from './fixtures/stepper-fixture.svelte'
import ToggleGroupFixture from './fixtures/toggle-group-fixture.svelte'

const text = (t: string) => createRawSnippet(() => ({ render: () => `<span>${t}</span>` }))

describe('ToggleGroup', () => {
  it('renders group semantics and pressed state', async () => {
    render(ToggleGroupFixture)
    expect(screen.getByRole('group')).toHaveClass('sig-toggle-group')
    const left = screen.getByRole('button', { name: 'Left' })
    expect(left).toHaveAttribute('aria-pressed', 'false')
    await fireEvent.click(left)
    expect(left).toHaveAttribute('aria-pressed', 'true')
    expect(left).toHaveAttribute('data-state', 'on')
  })

  it('keeps a single pressed item in single mode', async () => {
    render(ToggleGroupFixture)
    const left = screen.getByRole('button', { name: 'Left' })
    const center = screen.getByRole('button', { name: 'Center' })
    await fireEvent.click(left)
    await fireEvent.click(center)
    expect(center).toHaveAttribute('aria-pressed', 'true')
    expect(left).toHaveAttribute('aria-pressed', 'false')
  })

  it('allows several pressed items in multiple mode', async () => {
    render(ToggleGroupFixture, { type: 'multiple', value: [] })
    const left = screen.getByRole('button', { name: 'Left' })
    const right = screen.getByRole('button', { name: 'Right' })
    await fireEvent.click(left)
    await fireEvent.click(right)
    expect(left).toHaveAttribute('aria-pressed', 'true')
    expect(right).toHaveAttribute('aria-pressed', 'true')
  })

  it('moves focus with arrow keys', async () => {
    render(ToggleGroupFixture)
    const group = screen.getByRole('group')
    const left = screen.getByRole('button', { name: 'Left' })
    left.focus()
    await fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Center' })).toHaveFocus()
    await fireEvent.keyDown(group, { key: 'ArrowRight' })
    await fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Left' })).toHaveFocus()
  })
})

describe('HoverCard', () => {
  it('opens on pointer enter and exposes the card', async () => {
    render(HoverCardFixture)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    const trigger = screen.getByRole('button', { name: '@octocat' })
    await fireEvent.pointerEnter(trigger)
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
    expect(screen.getByRole('tooltip')).toHaveClass('sig-hover-card')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes when the pointer leaves', async () => {
    render(HoverCardFixture)
    const trigger = screen.getByRole('button', { name: '@octocat' })
    await fireEvent.pointerEnter(trigger)
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
    await fireEvent.pointerLeave(trigger)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('opens on keyboard focus', async () => {
    render(HoverCardFixture)
    const trigger = screen.getByRole('button', { name: '@octocat' })
    await fireEvent.focus(trigger)
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument())
  })
})

describe('TagsInput', () => {
  it('adds tags on Enter and removes them', async () => {
    render(TagsInput)
    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'svelte' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getByText('svelte')).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('button', { name: 'Remove svelte' }))
    expect(screen.queryByText('svelte')).not.toBeInTheDocument()
  })

  it('rejects duplicates and honors max', async () => {
    render(TagsInput, { tags: ['a'], max: 2 })
    const input = screen.getByRole('textbox')
    await fireEvent.input(input, { target: { value: 'a' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.getAllByText('a')).toHaveLength(1)
    await fireEvent.input(input, { target: { value: 'b' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    await fireEvent.input(input, { target: { value: 'c' } })
    await fireEvent.keyDown(input, { key: 'Enter' })
    expect(screen.queryByText('c')).not.toBeInTheDocument()
  })

  it('removes the last tag on Backspace with an empty field', async () => {
    render(TagsInput, { tags: ['x', 'y'] })
    const input = screen.getByRole('textbox')
    await fireEvent.keyDown(input, { key: 'Backspace' })
    expect(screen.queryByText('y')).not.toBeInTheDocument()
    expect(screen.getByText('x')).toBeInTheDocument()
  })
})

describe('AspectRatio', () => {
  it('applies the ratio style', () => {
    const { container } = render(AspectRatio, { ratio: 1, children: text('frame') })
    const box = container.querySelector('.sig-aspect-ratio') as HTMLElement
    expect(box.getAttribute('style')).toContain('aspect-ratio: 1')
  })
})

describe('AvatarGroup', () => {
  it('clamps visible avatars and shows overflow', () => {
    const items = [
      { fallback: 'Ada Lovelace' },
      { fallback: 'Grace Hopper' },
      { fallback: 'Alan Turing' }
    ]
    const { container } = render(AvatarGroup, { items, max: 2 })
    expect(container.querySelectorAll('.sig-avatar')).toHaveLength(2)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
})

const TREE_ITEMS = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'App.svelte' },
      { id: 'main', label: 'main.ts' }
    ]
  },
  { id: 'readme', label: 'README.md' }
]

describe('Tree', () => {
  it('renders tree semantics and expands branches', async () => {
    render(Tree, { items: TREE_ITEMS })
    expect(screen.getByRole('tree')).toBeInTheDocument()
    expect(screen.getAllByRole('treeitem')).toHaveLength(2)
    const src = screen.getByRole('treeitem', { name: 'src' })
    expect(src).toHaveAttribute('aria-expanded', 'false')
    await fireEvent.click(src)
    expect(src).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('treeitem')).toHaveLength(4)
  })

  it('navigates with arrow keys and selects', async () => {
    const onSelect = vi.fn()
    render(Tree, { items: TREE_ITEMS, onSelect })
    const tree = screen.getByRole('tree')
    await fireEvent.keyDown(tree, { key: 'ArrowDown' })
    expect(onSelect).toHaveBeenCalledWith(TREE_ITEMS[1])
    await fireEvent.keyDown(tree, { key: 'ArrowUp' })
    await fireEvent.keyDown(tree, { key: 'ArrowRight' })
    expect(screen.getByRole('treeitem', { name: 'src' })).toHaveAttribute('aria-expanded', 'true')
  })
})

describe('Timeline', () => {
  it('renders items with tone and time', () => {
    const { container } = render(Timeline.Root, {
      children: createRawSnippet(() => ({
        render: () => `<li>placeholder</li>`
      }))
    })
    expect(container.querySelector('ol.sig-timeline')).toBeInTheDocument()
  })

  it('renders item parts', () => {
    const { container } = render(Timeline.Item, {
      title: 'Deployed',
      time: '2h ago',
      tone: 'success',
      description: 'v1.2.0 live'
    })
    expect(container.querySelector('.sig-timeline-title')).toHaveTextContent('Deployed')
    expect(container.querySelector('.sig-timeline-time')).toHaveTextContent('2h ago')
    expect(container.querySelector('.sig-timeline-desc')).toHaveTextContent('v1.2.0 live')
    expect(container.querySelector('.sig-timeline-item')).toHaveAttribute('data-tone', 'success')
  })
})

describe('Stepper', () => {
  it('renders state and advances on click', async () => {
    render(StepperFixture, { step: 1 })
    const steps = screen.getAllByRole('listitem')
    expect(steps[0]).toHaveAttribute('data-state', 'complete')
    expect(steps[1]).toHaveAttribute('data-state', 'current')
    expect(steps[2]).toHaveAttribute('data-state', 'upcoming')
    expect(screen.getByRole('button', { name: /Profile/ })).toHaveAttribute('aria-current', 'step')
    await fireEvent.click(screen.getByRole('button', { name: /Done/ }))
    expect(steps[2]).toHaveAttribute('data-state', 'current')
  })
})

describe('AlertDialog', () => {
  it('opens with alertdialog semantics and restores focus', async () => {
    render(AlertDialogFixture)
    const trigger = screen.getByRole('button', { name: 'Delete' })
    trigger.focus()
    await fireEvent.click(trigger)
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Delete project?')).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('fires the action callback and closes', async () => {
    const onConfirm = vi.fn()
    render(AlertDialogFixture, { onConfirm })
    await fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    await fireEvent.click(await screen.findByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })
})

describe('FileUpload', () => {
  it('lists dropped files with size and remove', async () => {
    render(FileUpload, { label: 'Upload' })
    const dropzone = screen.getByRole('button', { name: 'Upload' })
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    await fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
    expect(screen.getByText('hello.txt')).toBeInTheDocument()
    expect(screen.getByText('5 B')).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('button', { name: 'Remove hello.txt' }))
    expect(screen.queryByText('hello.txt')).not.toBeInTheDocument()
  })

  it('ignores drops when disabled', async () => {
    render(FileUpload, { label: 'Upload', disabled: true })
    const dropzone = screen.getByRole('button', { name: 'Upload' })
    const file = new File(['x'], 'x.txt')
    await fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
    expect(screen.queryByText('x.txt')).not.toBeInTheDocument()
  })
})

describe('Menubar', () => {
  it('opens a menu and selects items', async () => {
    const onPick = vi.fn()
    render(MenubarFixture, { onPick })
    expect(screen.getByRole('menubar')).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('menuitem', { name: 'File' }))
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    await fireEvent.click(screen.getByRole('menuitem', { name: 'Save' }))
    expect(onPick).toHaveBeenCalledWith('save')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('moves between menus with arrow keys', async () => {
    render(MenubarFixture)
    const file = screen.getByRole('menuitem', { name: 'File' })
    file.focus()
    await fireEvent.click(file)
    await fireEvent.keyDown(file, { key: 'ArrowRight' })
    const edit = screen.getByRole('menuitem', { name: 'Edit' })
    expect(edit).toHaveFocus()
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Copy' })).toBeInTheDocument()
  })

  it('navigates items inside an open menu', async () => {
    render(MenubarFixture)
    const file = screen.getByRole('menuitem', { name: 'File' })
    await fireEvent.click(file)
    const content = screen.getByRole('menu')
    screen.getByRole('menuitem', { name: 'Save' }).focus()
    await fireEvent.keyDown(content, { key: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Quit' })).toHaveFocus()
  })
})

describe('Presence', () => {
  it('keeps children mounted during exit', async () => {
    const { rerender } = render(Presence, { show: true, duration: 40, children: text('hi') })
    expect(screen.getByText('hi')).toBeInTheDocument()
    await rerender({ show: false, duration: 40, children: text('hi') })
    const el = screen.getByText('hi').closest('.sig-presence')
    expect(el).toHaveAttribute('data-state', 'exit')
    await waitFor(() => expect(screen.queryByText('hi')).not.toBeInTheDocument())
  })
})

describe('Marquee', () => {
  it('duplicates content with the copy hidden from AT', () => {
    const { container } = render(Marquee, { children: text('loop') })
    const groups = container.querySelectorAll('.sig-marquee-group')
    expect(groups).toHaveLength(2)
    expect(groups[1]).toHaveAttribute('aria-hidden', 'true')
  })
})
