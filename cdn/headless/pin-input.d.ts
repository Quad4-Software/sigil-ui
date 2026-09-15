export interface PinInputOptions {
    value?: string;
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
}
export interface PinInputController {
    value: string;
    destroy(): void;
}
export declare function attachPinInput(root: HTMLElement, options?: PinInputOptions): PinInputController;
