export interface RatingOptions {
    value?: number;
    onChange?: (value: number) => void;
}
export interface RatingController {
    value: number;
    destroy(): void;
}
export declare function attachRating(root: HTMLElement, options?: RatingOptions): RatingController;
