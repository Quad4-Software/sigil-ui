export interface TreeController {
    selected: string | null;
    expanded: Set<string>;
    select(id: string | null): void;
    toggle(id: string): void;
    destroy(): void;
}
export declare function attachTree(root: HTMLElement, options?: {
    selected?: string;
    expanded?: Iterable<string>;
    onSelect?: (id: string | null) => void;
    onToggle?: (id: string, expanded: boolean) => void;
}): TreeController;
