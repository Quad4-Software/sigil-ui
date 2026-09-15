export interface PaginationOptions {
    page?: number;
    total: number;
    onPageChange?: (page: number) => void;
}
export interface PaginationController {
    page: number;
    goTo(page: number): void;
    destroy(): void;
}
export declare function attachPagination(root: HTMLElement, options: PaginationOptions): PaginationController;
