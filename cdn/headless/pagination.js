// Pagination controller for .sig-pagination markup. Renders .sig-page-btn
// items with ellipsis gaps and aria-current from page/total. Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
function items(page, total) {
    const pages = new Set([1, total, page - 1, page, page + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    for (const p of sorted) {
        if (p - prev > 1)
            out.push('gap');
        out.push(p);
        prev = p;
    }
    return out;
}
export function attachPagination(root, options) {
    let page = options.page ?? 1;
    const total = Math.max(1, options.total);
    function render() {
        root.innerHTML = '';
        const btn = (label, target, current = false) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'sig-page-btn';
            b.textContent = label;
            if (current)
                b.setAttribute('aria-current', 'page');
            else
                b.setAttribute('aria-label', `Page ${target}`);
            b.dataset.page = String(target);
            return b;
        };
        const prev = btn('‹', page - 1);
        prev.setAttribute('aria-label', 'Previous page');
        prev.disabled = page <= 1;
        root.append(prev);
        for (const item of items(page, total)) {
            if (item === 'gap') {
                const gap = document.createElement('span');
                gap.className = 'sig-page-gap';
                gap.setAttribute('aria-hidden', 'true');
                gap.textContent = '…';
                root.append(gap);
            }
            else {
                root.append(btn(String(item), item, item === page));
            }
        }
        const next = btn('›', page + 1);
        next.setAttribute('aria-label', 'Next page');
        next.disabled = page >= total;
        root.append(next);
    }
    function goTo(target) {
        const next = Math.min(total, Math.max(1, target));
        if (next === page)
            return;
        page = next;
        render();
        options.onPageChange?.(page);
    }
    const unsubs = [
        on(root, 'click', (event) => {
            const btn = event.target.closest('.sig-page-btn');
            if (!btn || isDisabled(btn))
                return;
            goTo(Number(btn.dataset.page));
        })
    ];
    render();
    return {
        get page() {
            return page;
        },
        goTo,
        destroy: destroyAll(...unsubs)
    };
}
