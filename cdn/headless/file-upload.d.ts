export interface FileUploadOptions {
    files?: File[];
    onChange?: (files: File[]) => void;
}
export interface FileUploadController {
    files: File[];
    clear(): void;
    destroy(): void;
}
export declare function attachFileUpload(root: HTMLElement, options?: FileUploadOptions): FileUploadController;
