export type ToastTone = 'default' | 'success' | 'info' | 'warning' | 'danger';
export interface ToastAction {
    label: string;
    onclick: () => void;
}
export interface Toast {
    id: number;
    title: string;
    description?: string | undefined;
    tone: ToastTone;
    action?: ToastAction | undefined;
}
export interface ToastInput {
    title: string;
    description?: string | undefined;
    action?: ToastAction | undefined;
    duration?: number | undefined;
}
export declare class ToastStore {
    private items;
    private timers;
    private listeners;
    get toasts(): readonly Toast[];
    subscribe(fn: () => void): () => void;
    private emit;
    push(tone: ToastTone, input: ToastInput): number;
    private start;
    pause(id: number): void;
    resume(id: number): void;
    dismiss(id: number): void;
    clear(): void;
}
export declare const toaster: ToastStore;
export declare function createToastApi(store: ToastStore): ((title: string, options?: Omit<ToastInput, "title">) => number) & {
    success: (title: string, options?: Omit<ToastInput, "title">) => number;
    info: (title: string, options?: Omit<ToastInput, "title">) => number;
    warning: (title: string, options?: Omit<ToastInput, "title">) => number;
    danger: (title: string, options?: Omit<ToastInput, "title">) => number;
    dismiss: (id: number) => void;
    clear: () => void;
};
export declare const toast: ((title: string, options?: Omit<ToastInput, "title">) => number) & {
    success: (title: string, options?: Omit<ToastInput, "title">) => number;
    info: (title: string, options?: Omit<ToastInput, "title">) => number;
    warning: (title: string, options?: Omit<ToastInput, "title">) => number;
    danger: (title: string, options?: Omit<ToastInput, "title">) => number;
    dismiss: (id: number) => void;
    clear: () => void;
};
export type ToasterPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
export declare function createToaster(container: HTMLElement, options?: {
    position?: ToasterPosition;
    store?: ToastStore;
}): {
    destroy(): void;
};
