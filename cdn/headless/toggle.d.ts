export interface ToggleController {
    pressed: boolean;
    destroy(): void;
}
export declare function attachToggle(el: HTMLElement, options?: {
    pressed?: boolean;
    onChange?: (pressed: boolean) => void;
}): ToggleController;
export interface ToggleGroupOptions {
    type?: 'single' | 'multiple';
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
}
export interface ToggleGroupController {
    value: string | string[];
    destroy(): void;
}
export declare function attachToggleGroup(root: HTMLElement, options?: ToggleGroupOptions): ToggleGroupController;
