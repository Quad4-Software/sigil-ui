export interface PaneGroupController {
    sizes(): number[];
    setSizes(sizes: number[]): void;
    destroy(): void;
}
export declare function attachPaneGroup(root: HTMLElement): PaneGroupController;
