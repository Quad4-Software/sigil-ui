export interface TooltipController {
    show(): void;
    hide(): void;
    destroy(): void;
}
export declare function attachTooltip(trigger: HTMLElement, tip: HTMLElement, options?: {
    delay?: number;
}): TooltipController;
