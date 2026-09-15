export interface OverlayOptions {
    trigger?: HTMLElement | null;
    content: HTMLElement;
    overlay?: HTMLElement | null;
    onOpenChange?: (open: boolean) => void;
}
export interface OverlayController {
    open(): void;
    close(): void;
    toggle(): void;
    isOpen(): boolean;
    destroy(): void;
}
export declare function createOverlay(options: OverlayOptions): OverlayController;
