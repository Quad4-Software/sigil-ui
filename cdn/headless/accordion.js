// Accordion controller: click toggles, aria-expanded/controls wiring,
// single or multiple open items, arrow-key movement between triggers.
// Framework-free.
import { destroyAll, isDisabled, nextId, on } from './dom.js';
export function attachAccordion(root, options = {}) {
    const items = [...root.querySelectorAll('.sig-acc-item')]
        .map((el, i) => {
        const trigger = el.querySelector('.sig-acc-trigger');
        const content = el.querySelector('.sig-acc-content');
        if (!trigger || !content)
            return null;
        if (!trigger.id)
            trigger.id = nextId('sig-acc-trigger');
        if (!content.id)
            content.id = nextId('sig-acc-content');
        trigger.setAttribute('aria-controls', content.id);
        content.setAttribute('aria-labelledby', trigger.id);
        const value = el.dataset.value ?? trigger.dataset.value ?? String(i);
        return { root: el, trigger, content, value };
    })
        .filter((i) => i !== null);
    function isOpen(item) {
        return item.trigger.getAttribute('aria-expanded') === 'true';
    }
    function setOpen(item, open) {
        if (open && !options.multiple) {
            for (const other of items)
                if (other !== item && isOpen(other))
                    setOpen(other, false);
        }
        item.trigger.setAttribute('aria-expanded', String(open));
        item.trigger.dataset.state = open ? 'open' : 'closed';
        item.content.hidden = !open;
        item.content.dataset.state = open ? 'open' : 'closed';
        item.root.dataset.state = open ? 'open' : 'closed';
        options.onToggle?.(item.value, open);
    }
    const unsubs = items.flatMap((item, i) => [
        on(item.trigger, 'click', () => {
            if (!isDisabled(item.trigger))
                setOpen(item, !isOpen(item));
        }),
        on(item.trigger, 'keydown', (event) => {
            const enabled = items.filter((x) => !isDisabled(x.trigger));
            const at = enabled.indexOf(item);
            let target;
            if (event.key === 'ArrowDown')
                target = enabled[(at + 1) % enabled.length];
            else if (event.key === 'ArrowUp')
                target = enabled[(at - 1 + enabled.length) % enabled.length];
            else if (event.key === 'Home')
                target = enabled[0];
            else if (event.key === 'End')
                target = enabled[enabled.length - 1];
            else
                return;
            event.preventDefault();
            target?.trigger.focus();
            void i;
        })
    ]);
    // ensure closed state is stamped on load
    for (const item of items) {
        if (item.trigger.getAttribute('aria-expanded') !== 'true') {
            item.trigger.setAttribute('aria-expanded', 'false');
            item.content.hidden = true;
            item.content.dataset.state = 'closed';
        }
    }
    return {
        open(value) {
            const item = items.find((i) => i.value === value);
            if (item)
                setOpen(item, true);
        },
        close(value) {
            const item = items.find((i) => i.value === value);
            if (item)
                setOpen(item, false);
        },
        toggle(value) {
            const item = items.find((i) => i.value === value);
            if (item)
                setOpen(item, !isOpen(item));
        },
        destroy: destroyAll(...unsubs)
    };
}
