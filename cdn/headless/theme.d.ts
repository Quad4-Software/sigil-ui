export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export interface ThemeController {
    mode: ThemeMode;
    readonly resolved: ResolvedTheme;
    set(mode: ThemeMode): void;
    toggle(): void;
    destroy(): void;
}
export declare function createTheme(options?: {
    key?: string;
    defaultMode?: ThemeMode;
    onChange?: (resolved: ResolvedTheme) => void;
}): ThemeController;
