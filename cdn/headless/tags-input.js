// Tags input controller for .sig-tags-input markup: a .sig-tags-field
// input plus .sig-tag chips the controller renders. Enter or comma adds,
// Backspace on an empty field removes the last tag. Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachTagsInput(root, options = {}) {
    const found = root.querySelector('.sig-tags-field, input');
    if (!found)
        throw new Error('sigil: attachTagsInput needs an input inside .sig-tags-input');
    const input = found;
    let tags = [...(options.tags ?? [])];
    function chip(tag) {
        const span = document.createElement('span');
        span.className = 'sig-tag';
        span.dataset.value = tag;
        span.append(tag);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sig-tag-remove';
        btn.setAttribute('aria-label', `Remove ${tag}`);
        btn.textContent = '×';
        span.append(btn);
        return span;
    }
    function render() {
        root.querySelectorAll('.sig-tag').forEach((el) => el.remove());
        for (const tag of tags)
            input.before(chip(tag));
    }
    function add(raw) {
        const tag = raw.trim().replace(/,+$/, '');
        if (!tag)
            return;
        if (tags.length >= (options.max ?? Infinity))
            return;
        if (!options.duplicates && tags.includes(tag))
            return;
        tags = [...tags, tag];
        render();
        options.onChange?.([...tags]);
    }
    function remove(tag) {
        const at = tags.lastIndexOf(tag);
        if (at === -1)
            return;
        tags = [...tags.slice(0, at), ...tags.slice(at + 1)];
        render();
        options.onChange?.([...tags]);
    }
    const unsubs = [
        on(input, 'keydown', (event) => {
            if (isDisabled(root))
                return;
            if (event.key === 'Enter' || event.key === ',') {
                event.preventDefault();
                add(input.value);
                input.value = '';
            }
            else if (event.key === 'Backspace' && input.value === '' && tags.length) {
                const last = tags.at(-1);
                if (last)
                    remove(last);
            }
        }),
        on(input, 'blur', () => {
            if (input.value.trim()) {
                add(input.value);
                input.value = '';
            }
        }),
        on(root, 'click', (event) => {
            const btn = event.target.closest('.sig-tag-remove');
            if (!btn || isDisabled(root))
                return;
            const tag = btn.closest('.sig-tag')?.dataset.value;
            if (tag)
                remove(tag);
        })
    ];
    render();
    return {
        get tags() {
            return [...tags];
        },
        add,
        remove,
        destroy: destroyAll(...unsubs)
    };
}
