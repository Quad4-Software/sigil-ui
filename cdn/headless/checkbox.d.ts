export interface CheckboxOptions {
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
}
export interface CheckboxController {
    checked: boolean;
    indeterminate: boolean;
    destroy(): void;
}
export declare function attachCheckbox(input: HTMLInputElement, options?: CheckboxOptions): CheckboxController;
