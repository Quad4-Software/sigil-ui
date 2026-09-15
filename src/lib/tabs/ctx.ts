import { getContext, setContext } from 'svelte'

export interface TabsContext {
  value: string
  readonly baseId: string
}

const KEY = 'sigil-tabs'

export function setTabsContext(ctx: TabsContext) {
  setContext(KEY, ctx)
}

export function getTabsContext(): TabsContext {
  const ctx = getContext<TabsContext>(KEY)
  if (!ctx) throw new Error('Tabs parts must be used inside Tabs.Root')
  return ctx
}
