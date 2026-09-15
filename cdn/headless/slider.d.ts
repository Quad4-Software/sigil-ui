export interface SliderController {
    value: number;
    destroy(): void;
}
export declare function attachSlider(root: HTMLElement, options?: {
    value?: number;
    onChange?: (value: number) => void;
}): SliderController;
