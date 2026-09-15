// Tree controller for role=tree markup: roving tabindex, ArrowRight/Left
// expand and collapse, ArrowUp/Down move between visible treeitems.
// Vanilla markup keeps every level rendered; the controller toggles
// hidden on the sub-groups. Items carry data-value as their id.
// Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachTree(root, options = {}) {
    let selected = options.selected ?? null;
    const expanded = new Set(options.expanded ?? []);
    const nodes = () => [...root.querySelectorAll('[role="treeitem"]')];
    const idOf = (n) => n.dataset.value ?? '';
    // the ul a treeitem's li sits inside
    const groupOf = (n) => n.parentElement?.closest('ul') ?? null;
    // the sub-group a treeitem expands, a sibling ul inside the same li
    const subOf = (n) => n.parentElement?.querySelector(':scope > ul') ?? null;
    // the treeitem that owns the group n sits in
    const parentOf = (n) => groupOf(n)?.parentElement?.querySelector(':scope > [role="treeitem"]') ?? null;
    const visible = () => nodes().filter((n) => {
        let g = groupOf(n);
        while (g) {
            if (g.hidden)
                return false;
            g = g.parentElement?.closest('ul') ?? null;
        }
        return true;
    });
    function apply() {
        for (const n of nodes()) {
            const id = idOf(n);
            const sub = subOf(n);
            if (sub) {
                const open = expanded.has(id);
                sub.hidden = !open;
                n.setAttribute('aria-expanded', String(open));
                n.querySelector('.sig-tree-chevron')?.toggleAttribute('data-open', open);
            }
            const isSelected = id !== '' && id === selected;
            n.setAttribute('aria-selected', String(isSelected));
            n.dataset.state = isSelected ? 'selected' : 'idle';
            n.tabIndex = isSelected ? 0 : -1;
        }
        if (!nodes().some((n) => n.tabIndex === 0)) {
            const first = visible()[0];
            if (first)
                first.tabIndex = 0;
        }
    }
    function select(id) {
        selected = id;
        apply();
        options.onSelect?.(id);
    }
    function toggle(id) {
        const next = !expanded.has(id);
        if (next)
            expanded.add(id);
        else
            expanded.delete(id);
        apply();
        options.onToggle?.(id, next);
    }
    const unsubs = [
        on(root, 'click', (event) => {
            const n = event.target.closest('[role="treeitem"]');
            if (!n || isDisabled(n))
                return;
            const id = idOf(n);
            if (event.target.closest('.sig-tree-chevron') && subOf(n))
                toggle(id);
            else if (id)
                select(id);
        }),
        on(root, 'keydown', (event) => {
            const n = event.target.closest('[role="treeitem"]');
            if (!n)
                return;
            const id = idOf(n);
            const vis = visible();
            const at = vis.indexOf(n);
            const sub = subOf(n);
            if (event.key === 'ArrowDown' && at < vis.length - 1) {
                event.preventDefault();
                vis[at + 1]?.focus();
            }
            else if (event.key === 'ArrowUp' && at > 0) {
                event.preventDefault();
                vis[at - 1]?.focus();
            }
            else if (event.key === 'ArrowRight' && sub) {
                event.preventDefault();
                if (!expanded.has(id))
                    toggle(id);
                else
                    vis[at + 1]?.focus();
            }
            else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                if (expanded.has(id) && sub)
                    toggle(id);
                else
                    parentOf(n)?.focus();
            }
            else if (event.key === 'Home') {
                event.preventDefault();
                vis[0]?.focus();
            }
            else if (event.key === 'End') {
                event.preventDefault();
                vis.at(-1)?.focus();
            }
            else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                select(id);
            }
        })
    ];
    apply();
    return {
        get selected() {
            return selected;
        },
        expanded,
        select,
        toggle,
        destroy: destroyAll(...unsubs)
    };
}
