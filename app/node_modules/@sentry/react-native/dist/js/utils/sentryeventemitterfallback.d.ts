import type { SentryEventEmitter } from './sentryeventemitter';
export declare const FALLBACK_TIMEOUT_MS = 10000;
export type FallBackNewFrameEvent = {
    newFrameTimestampInSeconds: number;
    isFallback?: boolean;
};
export interface SentryEventEmitterFallback {
    /**
     * Initializes the fallback event emitter
     * This method is synchronous in JS but the event emitter starts asynchronously.
     */
    initAsync: () => void;
    onceNewFrame: (listener: (event: FallBackNewFrameEvent) => void) => void;
}
/**
 * Creates emitter that allows to listen to UI Frame events when ready.
 */
export declare function createSentryFallbackEventEmitter(emitter?: SentryEventEmitter, fallbackTimeoutMs?: number): SentryEventEmitterFallback;
//# sourceMappingURL=sentryeventemitterfallback.d.ts.map