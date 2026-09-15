// Framework-free toast store plus a DOM renderer that mounts into any
// container. Same timing, pause-on-hover and cap rules as the Svelte
// Toaster, same sig-toast markup contract.
const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;
let counter = 0;
export class ToastStore {
    items = [];
    timers = new Map();
    listeners = new Set();
    get toasts() {
        return this.items;
    }
    subscribe(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }
    emit() {
        for (const fn of this.listeners)
            fn();
    }
    push(tone, input) {
        const id = ++counter;
        this.items = [
            ...this.items,
            { id, tone, title: input.title, description: input.description, action: input.action }
        ].slice(-MAX_TOASTS);
        const duration = input.duration ?? DEFAULT_DURATION;
        if (duration > 0)
            this.start(id, duration);
        this.emit();
        return id;
    }
    start(id, ms) {
        this.timers.set(id, {
            handle: setTimeout(() => this.dismiss(id), ms),
            startedAt: Date.now(),
            remaining: ms
        });
    }
    pause(id) {
        const timer = this.timers.get(id);
        if (!timer)
            return;
        clearTimeout(timer.handle);
        timer.remaining -= Date.now() - timer.startedAt;
    }
    resume(id) {
        const timer = this.timers.get(id);
        if (!timer)
            return;
        timer.startedAt = Date.now();
        timer.handle = setTimeout(() => this.dismiss(id), timer.remaining);
    }
    dismiss(id) {
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer.handle);
            this.timers.delete(id);
        }
        this.items = this.items.filter((t) => t.id !== id);
        this.emit();
    }
    clear() {
        for (const timer of this.timers.values())
            clearTimeout(timer.handle);
        this.timers.clear();
        this.items = [];
        this.emit();
    }
}
export const toaster = new ToastStore();
function make(store, tone) {
    return (title, options = {}) => store.push(tone, { ...options, title });
}
export function createToastApi(store) {
    return Object.assign(make(store, 'default'), {
        success: make(store, 'success'),
        info: make(store, 'info'),
        warning: make(store, 'warning'),
        danger: make(store, 'danger'),
        dismiss: (id) => store.dismiss(id),
        clear: () => store.clear()
    });
}
export const toast = createToastApi(toaster);
// Mounts the store into a container element. Each toast renders as
// .sig-toast[data-tone] with the same structure the Svelte Toaster emits,
// so components.css styles it identically.
export function createToaster(container, options = {}) {
    const { position = 'bottom-right', store = toaster } = options;
    const root = document.createElement('div');
    root.className = 'sig-toaster';
    root.dataset.position = position;
    container.appendChild(root);
    const nodes = new Map();
    function render() {
        const seen = new Set();
        for (const t of store.toasts) {
            seen.add(t.id);
            let el = nodes.get(t.id);
            if (!el) {
                el = document.createElement('div');
                el.className = 'sig-toast';
                el.dataset.tone = t.tone;
                el.setAttribute('role', t.tone === 'danger' || t.tone === 'warning' ? 'alert' : 'status');
                const text = document.createElement('div');
                text.className = 'sig-toast-text';
                const title = document.createElement('p');
                title.className = 'sig-toast-title';
                title.textContent = t.title;
                text.appendChild(title);
                if (t.description) {
                    const desc = document.createElement('p');
                    desc.className = 'sig-toast-desc';
                    desc.textContent = t.description;
                    text.appendChild(desc);
                }
                el.appendChild(text);
                if (t.action) {
                    const action = document.createElement('button');
                    action.type = 'button';
                    action.className = 'sig-toast-action';
                    action.textContent = t.action.label;
                    action.addEventListener('click', () => t.action?.onclick());
                    el.appendChild(action);
                }
                const close = document.createElement('button');
                close.type = 'button';
                close.className = 'sig-toast-close';
                close.setAttribute('aria-label', 'Dismiss');
                close.innerHTML =
                    '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
                close.addEventListener('click', () => store.dismiss(t.id));
                el.appendChild(close);
                el.addEventListener('pointerenter', () => store.pause(t.id));
                el.addEventListener('pointerleave', () => store.resume(t.id));
                el.addEventListener('focusin', () => store.pause(t.id));
                el.addEventListener('focusout', () => store.resume(t.id));
                nodes.set(t.id, el);
                root.appendChild(el);
            }
        }
        for (const [id, el] of nodes) {
            if (!seen.has(id)) {
                el.remove();
                nodes.delete(id);
            }
        }
    }
    const unsub = store.subscribe(render);
    render();
    return {
        destroy() {
            unsub();
            root.remove();
        }
    };
}
