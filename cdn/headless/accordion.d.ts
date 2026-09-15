export interface AccordionOptions {
    multiple?: boolean;
    onToggle?: (value: string, open: boolean) => void;
}
export interface AccordionController {
    open(value: string): void;
    close(value: string): void;
    toggle(value: string): void;
    destroy(): void;
}
export declare function attachAccordion(root: HTMLElement, options?: AccordionOptions): AccordionController;
