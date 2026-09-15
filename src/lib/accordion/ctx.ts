import { getContext, setContext } from 'svelte'
import type { SvelteSet } from 'svelte/reactivity'

export interface AccordionContext {
  readonly multiple: boolean
  readonly baseId: string
  readonly expanded: SvelteSet<string>
  toggle(value: string): void
}

export interface AccordionItemContext {
  readonly value: string
  readonly triggerId: string
  readonly contentId: string
}

const ROOT = 'sigil-accordion'
const ITEM = 'sigil-accordion-item'

export function setAccordionContext(ctx: AccordionContext) {
  setContext(ROOT, ctx)
}

export function getAccordionContext(): AccordionContext {
  const ctx = getContext<AccordionContext>(ROOT)
  if (!ctx) throw new Error('Accordion parts must be used inside Accordion.Root')
  return ctx
}

export function setAccordionItemContext(ctx: AccordionItemContext) {
  setContext(ITEM, ctx)
}

export function getAccordionItemContext(): AccordionItemContext {
  const ctx = getContext<AccordionItemContext>(ITEM)
  if (!ctx) throw new Error('Accordion Trigger and Content must be inside Accordion.Item')
  return ctx
}
