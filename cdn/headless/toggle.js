// Toggle and toggle-group controllers for aria-pressed buttons.
// Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachToggle(el, options = {}) {
    let pressed = options.pressed ?? el.getAttribute('aria-pressed') === 'true';
    function apply() {
        el.setAttribute('aria-pressed', String(pressed));
        el.dataset.state = pressed ? 'on' : 'off';
    }
    const unsubs = [
        on(el, 'click', () => {
            if (isDisabled(el))
                return;
            pressed = !pressed;
            apply();
            options.onChange?.(pressed);
        })
    ];
    apply();
    return {
        get pressed() {
            return pressed;
        },
        set pressed(value) {
            pressed = value;
            apply();
        },
        destroy: destroyAll(...unsubs)
    };
}
export function attachToggleGroup(root, options = {}) {
    const items = [...root.querySelectorAll('.sig-toggle-item, [aria-pressed]')];
    const multiple = (options.type ?? root.dataset.type) === 'multiple';
    let value = Array.isArray(options.value)
        ? options.value
        : options.value
            ? [options.value]
            : items
                .filter((i) => i.getAttribute('aria-pressed') === 'true')
                .map((i) => i.dataset.value ?? '');
    function apply() {
        items.forEach((item) => {
            const pressed = value.includes(item.dataset.value ?? '');
            item.setAttribute('aria-pressed', String(pressed));
            item.dataset.state = pressed ? 'on' : 'off';
        });
    }
    function emit() {
        options.onValueChange?.(multiple ? [...value] : (value[0] ?? ''));
    }
    const unsubs = items.flatMap((item) => [
        on(item, 'click', () => {
            if (isDisabled(item))
                return;
            const v = item.dataset.value ?? '';
            if (multiple) {
                value = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
            }
            else {
                value = value.includes(v) ? [] : [v];
            }
            apply();
            emit();
        }),
        on(item, 'keydown', (event) => {
            const enabled = items.filter((i) => !isDisabled(i));
            const at = enabled.indexOf(item);
            let target;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
                target = enabled[(at + 1) % enabled.length];
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                target = enabled[(at - 1 + enabled.length) % enabled.length];
            else
                return;
            event.preventDefault();
            target?.focus();
        })
    ]);
    apply();
    return {
        get value() {
            return multiple ? [...value] : (value[0] ?? '');
        },
        destroy: destroyAll(...unsubs)
    };
}
