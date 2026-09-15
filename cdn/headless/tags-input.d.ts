export interface TagsInputOptions {
    tags?: string[];
    max?: number;
    duplicates?: boolean;
    onChange?: (tags: string[]) => void;
}
export interface TagsInputController {
    tags: string[];
    add(tag: string): void;
    remove(tag: string): void;
    destroy(): void;
}
export declare function attachTagsInput(root: HTMLElement, options?: TagsInputOptions): TagsInputController;
