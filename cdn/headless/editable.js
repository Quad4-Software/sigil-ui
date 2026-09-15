// Editable controller for .sig-editable markup: .sig-editable-preview
// swaps for a .sig-editable-input, Enter commits, Escape cancels.
// Framework-free.
import { destroyAll, isDisabled, on } from './dom.js';
export function attachEditable(root, options = {}) {
    const foundPreview = root.querySelector('.sig-editable-preview');
    const foundInput = root.querySelector('.sig-editable-input');
    if (!foundPreview || !foundInput)
        throw new Error('sigil: attachEditable needs .sig-editable-preview and .sig-editable-input');
    const preview = foundPreview;
    const input = foundInput;
    const submitOnBlur = options.submitOnBlur ?? true;
    let value = options.value ?? preview.textContent ?? '';
    let editing = false;
    let draft = value;
    function apply() {
        input.hidden = !editing;
        preview.hidden = editing;
        root.toggleAttribute('data-editing', editing);
        if (!editing)
            preview.textContent = value || preview.textContent;
    }
    function edit() {
        if (isDisabled(preview))
            return;
        draft = value;
        input.value = draft;
        editing = true;
        apply();
        input.focus();
        input.select();
    }
    function submit() {
        editing = false;
        if (input.value !== value) {
            value = input.value;
            apply();
            options.onChange?.(value);
        }
        else {
            apply();
        }
        options.onSubmit?.(value);
    }
    function cancel() {
        editing = false;
        input.value = value;
        apply();
    }
    const unsubs = [
        on(preview, 'click', edit),
        on(input, 'keydown', (event) => {
            if (event.key === 'Enter')
                submit();
            else if (event.key === 'Escape') {
                event.stopPropagation();
                cancel();
            }
        }),
        on(input, 'blur', () => {
            if (editing)
                (submitOnBlur ? submit : cancel)();
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
        get editing() {
            return editing;
        },
        edit,
        submit,
        cancel,
        destroy: destroyAll(...unsubs)
    };
}
