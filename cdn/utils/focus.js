const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
export function focusableIn(el) {
    return [...el.querySelectorAll(FOCUSABLE)].filter((node) => node.offsetParent !== null || node === document.activeElement);
}
// Cycles Tab inside container. Call from a keydown handler registered on
// document in capture phase while the overlay is open.
export function trapTab(container, event) {
    const items = focusableIn(container);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) {
        event.preventDefault();
        container.focus();
        return;
    }
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
    }
    else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
    }
    else if (!container.contains(active)) {
        event.preventDefault();
        first.focus();
    }
}
