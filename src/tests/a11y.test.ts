import { render } from '@testing-library/svelte'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import { DataTable, ScrollArea } from '../lib/index.js'
import ButtonFixture from './fixtures/button-fixture.svelte'
import CommandFixture from './fixtures/command-fixture.svelte'
import ComboboxFixture from './fixtures/combobox-fixture.svelte'
import TabsFixture from './fixtures/tabs-fixture.svelte'

async function audit(el: HTMLElement) {
  const results = await axe.run(el, {
    rules: { 'color-contrast': { enabled: false } }
  })
  return results.violations
}

describe('axe accessibility audit', () => {
  it('Button and Field have no violations', async () => {
    const { container } = render(ButtonFixture)
    expect(await audit(container)).toEqual([])
  })

  it('Tabs render cleanly', async () => {
    const { container } = render(TabsFixture)
    expect(await audit(container)).toEqual([])
  })

  it('Command list has no violations', async () => {
    const { container } = render(CommandFixture)
    expect(await audit(container)).toEqual([])
  })

  it('Combobox has no violations', async () => {
    const { container } = render(ComboboxFixture)
    expect(await audit(container)).toEqual([])
  })

  it('DataTable has no violations', async () => {
    const { container } = render(DataTable, {
      columns: [{ key: 'name', label: 'Name', sortable: true }],
      rows: [{ name: 'a' }]
    })
    expect(await audit(container)).toEqual([])
  })

  it('ScrollArea has no violations', async () => {
    const { container } = render(ScrollArea)
    expect(await audit(container)).toEqual([])
  })
})
