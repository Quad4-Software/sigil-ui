export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';
export interface PopoverOptions {
    trigger: HTMLElement;
    content: HTMLElement;
    side?: PopoverSide;
    align?: PopoverAlign;
    offset?: number;
    onOpenChange?: (open: boolean) => void;
}
export interface PopoverController {
    open(): void;
    close(): void;
    toggle(): void;
    isOpen(): boolean;
    destroy(): void;
}
export declare function createPopover(options: PopoverOptions): PopoverController;
