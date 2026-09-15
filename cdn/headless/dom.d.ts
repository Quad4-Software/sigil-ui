export type Unsub = () => void;
export declare function on<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (event: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions): Unsub;
export declare function on<K extends keyof DocumentEventMap>(el: Document, type: K, fn: (event: DocumentEventMap[K]) => void, opts?: AddEventListenerOptions): Unsub;
export declare function on<K extends keyof WindowEventMap>(el: Window, type: K, fn: (event: WindowEventMap[K]) => void, opts?: AddEventListenerOptions): Unsub;
export declare function destroyAll(...fns: (Unsub | undefined)[]): () => void;
export declare function nextId(prefix: string): string;
export declare function isDisabled(el: HTMLElement): boolean;
export declare function setHidden(el: HTMLElement, hidden: boolean): void;
