// Slider controller for .sig-slider wrapping input[type=range]. Keeps the
// --sig-slider-pct fill variable in sync. Framework-free.
import { destroyAll, on } from './dom.js';
export function attachSlider(root, options = {}) {
    const found = root instanceof HTMLInputElement
        ? root
        : root.querySelector('input[type="range"]');
    const wrap = root instanceof HTMLInputElement ? root.parentElement : root;
    if (!found)
        throw new Error('sigil: attachSlider needs .sig-slider or an input[type=range]');
    const input = found;
    let value = options.value ?? Number(input.value || 0);
    function apply() {
        const min = Number(input.min || 0);
        const max = Number(input.max || 100);
        const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
        input.value = String(value);
        wrap?.style.setProperty('--sig-slider-pct', `${pct}%`);
        input.style.setProperty('--sig-slider-pct', `${pct}%`);
    }
    const unsubs = [
        on(input, 'input', () => {
            value = Number(input.value);
            apply();
            options.onChange?.(value);
        })
    ];
    apply();
    return {
        get value() {
            return value;
        },
        set value(v) {
            value = v;
            apply();
        },
        destroy: destroyAll(...unsubs)
    };
}
