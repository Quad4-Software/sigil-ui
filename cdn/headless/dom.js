// Shared DOM helpers for the headless controllers. No framework imports.
export function on(el, type, fn, opts) {
    el.addEventListener(type, fn, opts);
    return () => el.removeEventListener(type, fn, opts);
}
export function destroyAll(...fns) {
    return () => {
        for (const fn of fns)
            fn?.();
    };
}
let uid = 0;
export function nextId(prefix) {
    return `${prefix}-${++uid}`;
}
export function isDisabled(el) {
    return el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
}
export function setHidden(el, hidden) {
    el.hidden = hidden;
}
