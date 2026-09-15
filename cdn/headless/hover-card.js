// Hover card controller: opens .sig-hover-card content on hover or focus
// with open/close delay hysteresis. Markup lives inside .sig-hover-wrap.
// Framework-free.
import { destroyAll, nextId, on } from './dom.js';
export function createHoverCard(wrap, options = {}) {
    const { openDelay = 300, closeDelay = 200, onOpenChange } = options;
    const foundTrigger = wrap.querySelector('[data-hover-trigger], :scope > :first-child');
    const foundContent = wrap.querySelector('.sig-hover-card');
    if (!foundTrigger || !foundContent)
        throw new Error('sigil: createHoverCard needs a trigger and .sig-hover-card inside .sig-hover-wrap');
    const trigger = foundTrigger;
    const content = foundContent;
    let open = false;
    let openTimer;
    let closeTimer;
    if (!content.id)
        content.id = nextId('sig-hover');
    trigger.setAttribute('aria-describedby', content.id);
    function apply() {
        content.hidden = !open;
        content.dataset.state = open ? 'open' : 'closed';
        trigger.setAttribute('aria-expanded', String(open));
    }
    function setOpen(next) {
        if (next === open)
            return;
        open = next;
        apply();
        onOpenChange?.(next);
    }
    function scheduleOpen() {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
        openTimer = setTimeout(() => setOpen(true), openDelay);
    }
    function scheduleClose() {
        clearTimeout(openTimer);
        clearTimeout(closeTimer);
        closeTimer = setTimeout(() => setOpen(false), closeDelay);
    }
    const unsubs = [
        on(trigger, 'mouseenter', scheduleOpen),
        on(trigger, 'mouseleave', scheduleClose),
        on(trigger, 'focusin', scheduleOpen),
        on(trigger, 'focusout', scheduleClose),
        on(content, 'mouseenter', () => {
            clearTimeout(closeTimer);
        }),
        on(content, 'mouseleave', scheduleClose),
        on(trigger, 'keydown', (event) => {
            if (event.key === 'Escape')
                setOpen(false);
        })
    ];
    apply();
    return {
        get open() {
            return open;
        },
        destroy: destroyAll(() => {
            clearTimeout(openTimer);
            clearTimeout(closeTimer);
        }, ...unsubs)
    };
}
