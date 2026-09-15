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
import { attachAccordion } from './accordion.js';
import { attachCarousel } from './carousel.js';
import { attachCheckbox } from './checkbox.js';
import { destroyAll } from './dom.js';
import { attachEditable } from './editable.js';
import { attachFileUpload } from './file-upload.js';
import { createHoverCard } from './hover-card.js';
import { attachNumberInput } from './number-input.js';
import { attachPagination } from './pagination.js';
import { attachPaneGroup } from './panes.js';
import { attachPinInput } from './pin-input.js';
import { attachRadioGroup } from './radio.js';
import { attachRating } from './rating.js';
import { attachSlider } from './slider.js';
import { attachSwitch } from './switch.js';
import { attachTabs } from './tabs.js';
import { attachTagsInput } from './tags-input.js';
import { attachToggle, attachToggleGroup } from './toggle.js';
import { attachTooltip } from './tooltip.js';
import { attachTree } from './tree.js';
export { attachAccordion } from './accordion.js';
export { attachCarousel } from './carousel.js';
export { attachCheckbox } from './checkbox.js';
export { destroyAll, isDisabled, nextId, on } from './dom.js';
export { attachEditable } from './editable.js';
export { attachFileUpload } from './file-upload.js';
export { createHoverCard } from './hover-card.js';
export { createMenu } from './menu.js';
export { attachNumberInput } from './number-input.js';
export { createOverlay } from './overlay.js';
export { attachPagination } from './pagination.js';
export { attachPaneGroup } from './panes.js';
export { attachPinInput } from './pin-input.js';
export { persistedValue } from './persisted.js';
export { createPopover } from './popover.js';
export { attachRadioGroup } from './radio.js';
export { attachRating } from './rating.js';
export { attachSlider } from './slider.js';
export { attachSwitch } from './switch.js';
export { attachTabs } from './tabs.js';
export { attachTagsInput } from './tags-input.js';
export { createTheme } from './theme.js';
export { createToastApi, createToaster, toast, toaster, ToastStore } from './toaster.js';
export { attachToggle, attachToggleGroup } from './toggle.js';
export { attachTooltip } from './tooltip.js';
export { attachTree } from './tree.js';
// Wires every recognized component under root and returns one destroy.
// Recognizes .sig-tabs, .sig-accordion, .sig-radio-group, .sig-toggle-group,
// .sig-pane-group, .sig-tree, .sig-pagination (data-total), .sig-carousel,
// .sig-number-input, .sig-pin-input, .sig-rating, .sig-editable,
// .sig-tags-input, .sig-file-upload, button[role=switch], .sig-slider,
// input[type=checkbox].sig-checkbox, .sig-toggle, .sig-tip-wrap pairs and
// .sig-hover-wrap pairs. Overlays (dialog, sheet, popover, menu) need
// explicit wiring via createOverlay/createPopover/createMenu since they
// involve trigger + portaled content pairs.
export function attachAll(root = document) {
    const cleanups = [];
    const all = (sel) => [...root.querySelectorAll(sel)];
    for (const el of all('.sig-tabs'))
        cleanups.push(attachTabs(el).destroy);
    for (const el of all('.sig-accordion'))
        cleanups.push(attachAccordion(el).destroy);
    for (const el of all('.sig-radio-group'))
        cleanups.push(attachRadioGroup(el).destroy);
    for (const el of all('.sig-toggle-group'))
        cleanups.push(attachToggleGroup(el).destroy);
    for (const el of all('.sig-pane-group'))
        cleanups.push(attachPaneGroup(el).destroy);
    for (const el of all('.sig-tree'))
        cleanups.push(attachTree(el).destroy);
    for (const el of all('.sig-carousel'))
        cleanups.push(attachCarousel(el).destroy);
    for (const el of all('.sig-number-input'))
        cleanups.push(attachNumberInput(el).destroy);
    for (const el of all('.sig-pin-input'))
        cleanups.push(attachPinInput(el).destroy);
    for (const el of all('.sig-rating'))
        cleanups.push(attachRating(el).destroy);
    for (const el of all('.sig-editable'))
        cleanups.push(attachEditable(el).destroy);
    for (const el of all('.sig-tags-input'))
        cleanups.push(attachTagsInput(el).destroy);
    for (const el of all('.sig-file-upload'))
        cleanups.push(attachFileUpload(el).destroy);
    for (const el of all('.sig-slider'))
        cleanups.push(attachSlider(el).destroy);
    for (const el of all('.sig-pagination')) {
        const total = Number(el.dataset.total || el.querySelectorAll('.sig-page-btn').length || 1);
        cleanups.push(attachPagination(el, { total }).destroy);
    }
    for (const el of all('button[role="switch"], .sig-switch'))
        cleanups.push(attachSwitch(el).destroy);
    for (const el of all('input[type="checkbox"].sig-checkbox'))
        cleanups.push(attachCheckbox(el).destroy);
    for (const el of all('.sig-toggle'))
        cleanups.push(attachToggle(el).destroy);
    for (const wrap of all('.sig-tip-wrap')) {
        const trigger = wrap.querySelector(':scope > :first-child');
        const tip = wrap.querySelector('.sig-tip');
        if (trigger && tip)
            cleanups.push(attachTooltip(trigger, tip).destroy);
    }
    for (const wrap of all('.sig-hover-wrap')) {
        try {
            cleanups.push(createHoverCard(wrap).destroy);
        }
        catch {
            // incomplete markup, skip
        }
    }
    return destroyAll(...cleanups.map((c) => () => c()));
}
