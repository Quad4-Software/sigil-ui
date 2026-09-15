// Rating controller for .sig-rating markup: .sig-rating-star buttons act
// as a radiogroup with arrow-key adjustment. Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachRating(root, options = {}) {
    const stars = [...root.querySelectorAll('.sig-rating-star, [role="radio"]')];
    if (!stars.length)
        throw new Error('sigil: attachRating needs .sig-rating-star buttons');
    const readonly = root.dataset.readonly !== undefined;
    let value = options.value ??
        (() => {
            const checked = stars.findIndex((s) => s.getAttribute('aria-checked') === 'true');
            return checked === -1
                ? stars.filter((s) => s.dataset.filled !== undefined).length
                : checked + 1;
        })();
    function apply() {
        stars.forEach((s, i) => {
            const n = i + 1;
            s.setAttribute('aria-checked', String(n === value));
            s.toggleAttribute('data-filled', n <= value);
            s.tabIndex = n === value || (value === 0 && n === 1) ? 0 : -1;
        });
    }
    function set(n) {
        if (readonly)
            return;
        value = n === value ? 0 : n;
        apply();
        options.onChange?.(value);
    }
    const unsubs = stars.flatMap((s, i) => [
        on(s, 'click', () => !isDisabled(s) && set(i + 1)),
        on(s, 'keydown', (event) => {
            if (isDisabled(s))
                return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                value = Math.min(stars.length, value + 1);
                apply();
                stars[value - 1]?.focus();
                options.onChange?.(value);
            }
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                value = Math.max(0, value - 1);
                apply();
                stars[Math.max(0, value - 1)]?.focus();
                options.onChange?.(value);
            }
        })
    ]);
    apply();
    return {
        get value() {
            return value;
        },
        set value(v) {
            value = Math.min(stars.length, Math.max(0, v));
            apply();
        },
        destroy: destroyAll(...unsubs)
    };
}
