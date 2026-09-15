export interface NumberInputOptions {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    onChange?: (value: number) => void;
}
export interface NumberInputController {
    value: number;
    destroy(): void;
}
export declare function attachNumberInput(root: HTMLElement, options?: NumberInputOptions): NumberInputController;
