export interface CarouselOptions {
    index?: number;
    loop?: boolean;
    onChange?: (index: number) => void;
}
export interface CarouselController {
    index: number;
    count: number;
    goTo(i: number): void;
    destroy(): void;
}
export declare function attachCarousel(root: HTMLElement, options?: CarouselOptions): CarouselController;
