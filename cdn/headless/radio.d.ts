export interface RadioGroupOptions {
    value?: string;
    onValueChange?: (value: string) => void;
}
export interface RadioGroupController {
    value: string | null;
    select(value: string): void;
    destroy(): void;
}
export declare function attachRadioGroup(root: HTMLElement, options?: RadioGroupOptions): RadioGroupController;
