import { PostHogCustomAsyncStorage } from './types';
export declare class SemiAsyncStorage {
    private _memoryCache;
    private _preloadSemiAsyncStoragePromise;
    private _asyncStorage;
    isPreloaded: boolean;
    constructor(asyncStorage: PostHogCustomAsyncStorage);
    preloadAsync(): Promise<void>;
    persist(): void;
    getItem(key: string): any | null | undefined;
    setItem(key: string, value: any): void;
    removeItem(key: string): void;
    clear(): void;
    getAllKeys(): readonly string[];
}
