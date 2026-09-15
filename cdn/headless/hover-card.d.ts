export interface HoverCardOptions {
    openDelay?: number;
    closeDelay?: number;
    onOpenChange?: (open: boolean) => void;
}
export interface HoverCardController {
    open: boolean;
    destroy(): void;
}
export declare function createHoverCard(wrap: HTMLElement, options?: HoverCardOptions): HoverCardController;
