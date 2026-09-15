export interface TabsOptions {
    value?: string;
    onValueChange?: (value: string) => void;
}
export interface TabsController {
    value: string | null;
    select(value: string): void;
    destroy(): void;
}
export declare function attachTabs(root: HTMLElement, options?: TabsOptions): TabsController;
