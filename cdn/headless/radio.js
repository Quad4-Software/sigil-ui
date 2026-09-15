// Radio group controller: roving tabindex, arrow-key select-and-focus,
// aria-checked and data-state wiring. Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachRadioGroup(root, options = {}) {
    const items = [...root.querySelectorAll('[role="radio"]')];
    let current = options.value ??
        items.find((i) => i.getAttribute('aria-checked') === 'true')?.dataset.value ??
        null;
    function apply() {
        const anyChecked = current !== null;
        items.forEach((item, i) => {
            const checked = item.dataset.value === current;
            item.setAttribute('aria-checked', String(checked));
            item.dataset.state = checked ? 'checked' : 'unchecked';
            item.tabIndex = checked || (!anyChecked && i === 0) ? 0 : -1;
        });
    }
    function select(value, focus = false) {
        if (value === current)
            return;
        current = value;
        apply();
        if (focus)
            items.find((i) => i.dataset.value === value)?.focus();
        options.onValueChange?.(value);
    }
    const unsubs = items.flatMap((item) => [
        on(item, 'click', () => {
            if (!isDisabled(item) && item.dataset.value)
                select(item.dataset.value);
        }),
        on(item, 'keydown', (event) => {
            const enabled = items.filter((i) => !isDisabled(i));
            const at = enabled.indexOf(item);
            let target;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
                target = enabled[(at + 1) % enabled.length];
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
                target = enabled[(at - 1 + enabled.length) % enabled.length];
            else if (event.key === 'Home')
                target = enabled[0];
            else if (event.key === 'End')
                target = enabled[enabled.length - 1];
            else
                return;
            event.preventDefault();
            if (target?.dataset.value)
                select(target.dataset.value, true);
        })
    ]);
    apply();
    return {
        get value() {
            return current;
        },
        select,
        destroy: destroyAll(...unsubs)
    };
}
