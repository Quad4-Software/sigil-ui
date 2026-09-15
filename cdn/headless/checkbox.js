// Checkbox controller for input[type=checkbox].sig-checkbox. Keeps
// data-state in sync, supports indeterminate. Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachCheckbox(input, options = {}) {
    let checked = options.checked ?? input.checked;
    let indeterminate = options.indeterminate ?? input.indeterminate;
    function apply() {
        input.checked = checked;
        input.indeterminate = indeterminate;
        input.dataset.state = indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked';
    }
    const unsubs = [
        on(input, 'change', () => {
            if (isDisabled(input)) {
                apply();
                return;
            }
            checked = input.checked;
            indeterminate = false;
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
            indeterminate = false;
            apply();
        },
        get indeterminate() {
            return indeterminate;
        },
        set indeterminate(value) {
            indeterminate = value;
            apply();
        },
        destroy: destroyAll(...unsubs)
    };
}
