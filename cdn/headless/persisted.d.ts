export interface PersistedValue<T> {
    value: T;
    destroy(): void;
}
export declare function persistedValue<T>(key: string, initial: T, onExternal?: (value: T) => void): PersistedValue<T>;
