export interface SwitchController {
    checked: boolean;
    destroy(): void;
}
export declare function attachSwitch(el: HTMLElement, options?: {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}): SwitchController;
