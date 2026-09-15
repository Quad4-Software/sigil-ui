export interface MenuOptions {
    trigger: HTMLElement;
    content: HTMLElement;
    onOpenChange?: (open: boolean) => void;
}
export interface MenuController {
    open(): void;
    close(): void;
    destroy(): void;
    isOpen(): boolean;
}
export declare function createMenu(options: MenuOptions): MenuController;
