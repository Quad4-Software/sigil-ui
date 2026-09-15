// Switch controller for button[role=switch]. Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachSwitch(el, options = {}) {
    let checked = options.checked ?? el.getAttribute('aria-checked') === 'true';
    el.setAttribute('role', 'switch');
    function apply() {
        el.setAttribute('aria-checked', String(checked));
        el.dataset.state = checked ? 'checked' : 'unchecked';
    }
    const unsubs = [
        on(el, 'click', () => {
            if (isDisabled(el))
                return;
            checked = !checked;
            apply();
            options.onChange?.(checked);
        })
    ];
    apply();
    return {
        get checked() {
            return checked;
        },
        set checked(value) {
            checked = value;
            apply();
        },
        destroy: destroyAll(...unsubs)
    };
}
