export interface EditableOptions {
    value?: string;
    submitOnBlur?: boolean;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}
export interface EditableController {
    value: string;
    editing: boolean;
    edit(): void;
    submit(): void;
    cancel(): void;
    destroy(): void;
}
export declare function attachEditable(root: HTMLElement, options?: EditableOptions): EditableController;
