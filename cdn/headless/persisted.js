// localStorage-backed value with cross-tab sync. Framework-free version of
// utils/persisted.svelte.ts used by the headless controllers.
export function persistedValue(key, initial, onExternal) {
    let value = initial;
    try {
        const raw = localStorage.getItem(key);
        if (raw !== null)
            value = JSON.parse(raw);
    }
    catch {
        // storage unavailable or malformed payload
    }
    const onStorage = (event) => {
        if (event.key !== key)
            return;
        try {
            value = event.newValue === null ? initial : JSON.parse(event.newValue);
            onExternal?.(value);
        }
        catch {
            // malformed payload
        }
    };
    if (typeof window !== 'undefined')
        window.addEventListener('storage', onStorage);
    return {
        get value() {
            return value;
        },
        set value(next) {
            value = next;
            try {
                localStorage.setItem(key, JSON.stringify(next));
            }
            catch {
                // storage unavailable
            }
        },
        destroy() {
            window.removeEventListener('storage', onStorage);
        }
    };
}
