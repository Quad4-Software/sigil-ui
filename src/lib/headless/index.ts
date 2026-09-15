// Headless controllers: framework-free behavior for markup written with the
// documented sig-* classes and roles. This is the vanilla entry point; pair
// it with theme.css + components.css and no Svelte is required.
//
//   import 'sigil-ui/theme.css'
//   import 'sigil-ui/components.css'
//   import { attachAll, createToaster, toast } from 'sigil-ui/headless'
//
//   attachAll(document)
//   createToaster(document.body)
//   toast.success('Saved')

import { attachAccordion } from './accordion.js'
import { destroyAll } from './dom.js'
import { attachPaneGroup } from './panes.js'
import { attachRadioGroup } from './radio.js'
import { attachSwitch } from './switch.js'
import { attachTabs } from './tabs.js'
import { attachTooltip } from './tooltip.js'

export { attachAccordion } from './accordion.js'
export type { AccordionController, AccordionOptions } from './accordion.js'
export { destroyAll, isDisabled, nextId, on } from './dom.js'
export { createMenu } from './menu.js'
export type { MenuController, MenuOptions } from './menu.js'
export { createOverlay } from './overlay.js'
export type { OverlayController, OverlayOptions } from './overlay.js'
export { attachPaneGroup } from './panes.js'
export type { PaneGroupController } from './panes.js'
export { persistedValue } from './persisted.js'
export type { PersistedValue } from './persisted.js'
export { createPopover } from './popover.js'
export type { PopoverController, PopoverOptions } from './popover.js'
export { attachRadioGroup } from './radio.js'
export type { RadioGroupController, RadioGroupOptions } from './radio.js'
export { attachSwitch } from './switch.js'
export type { SwitchController } from './switch.js'
export { attachTabs } from './tabs.js'
export type { TabsController, TabsOptions } from './tabs.js'
export { createTheme } from './theme.js'
export type { ResolvedTheme, ThemeController, ThemeMode } from './theme.js'
export { createToastApi, createToaster, toast, toaster, ToastStore } from './toaster.js'
export type { Toast, ToastAction, ToastInput, ToastTone, ToasterPosition } from './toaster.js'
export { attachTooltip } from './tooltip.js'
export type { TooltipController } from './tooltip.js'

// Wires every recognized component under root and returns one destroy.
// Recognizes .sig-tabs, .sig-accordion, .sig-radio-group, .sig-pane-group,
// button[role=switch] and .sig-tip-wrap pairs. Overlays (dialog, sheet,
// popover, menu) need explicit wiring via createOverlay/createPopover/
// createMenu since they involve trigger + portaled content pairs.
export function attachAll(root: ParentNode = document): () => void {
  const cleanups: (() => void)[] = []

  const all = <T extends Element>(sel: string): T[] => [...root.querySelectorAll<T>(sel)]

  for (const el of all<HTMLElement>('.sig-tabs')) cleanups.push(attachTabs(el).destroy)
  for (const el of all<HTMLElement>('.sig-accordion')) cleanups.push(attachAccordion(el).destroy)
  for (const el of all<HTMLElement>('.sig-radio-group')) cleanups.push(attachRadioGroup(el).destroy)
  for (const el of all<HTMLElement>('.sig-pane-group')) cleanups.push(attachPaneGroup(el).destroy)
  for (const el of all<HTMLElement>('button[role="switch"], .sig-switch'))
    cleanups.push(attachSwitch(el).destroy)
  for (const wrap of all<HTMLElement>('.sig-tip-wrap')) {
    const trigger = wrap.querySelector<HTMLElement>(':scope > :first-child')
    const tip = wrap.querySelector<HTMLElement>('.sig-tip')
    if (trigger && tip) cleanups.push(attachTooltip(trigger, tip).destroy)
  }

  return destroyAll(...cleanups.map((c) => () => c()))
}
