/**
 * API Retry Logic with Exponential Backoff
 * Handles transient network failures gracefully
 */

import { ENV } from './env';

interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  retryableStatuses?: number[];
  onRetry?: (attempt: number, error: Error) => void;
}

interface RequestConfig extends RequestInit {
  retry?: RetryConfig;
}

const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  onRetry: () => {},
};

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  // Exponential backoff: 2^attempt * baseDelay
  const exponentialDelay = Math.pow(2, attempt) * baseDelay;
  
  // Add jitter (±25%) to prevent thundering herd
  const jitter = 0.75 + Math.random() * 0.5;
  
  return Math.min(exponentialDelay * jitter, maxDelay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryable(error: any, retryableStatuses: number[]): boolean {
  // Network errors
  if (error.name === 'TypeError' || error.name === 'NetworkError') {
    return true;
  }
  
  // HTTP status errors
  if (error.status && retryableStatuses.includes(error.status)) {
    return true;
  }
  
  // Timeout
  if (error.name === 'AbortError') {
    return true;
  }
  
  return false;
}

/**
 * Fetch with retry logic
 */
export async function fetchWithRetry(
  url: string,
  config: RequestConfig = {}
): Promise<Response> {
  const { retry, ...fetchConfig } = config;
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...retry };
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchConfig,
        // Add timeout signal if not provided
        signal: fetchConfig.signal || createTimeoutSignal(30000).signal,
      });
      
      // Check if response status is retryable
      if (!response.ok && retryConfig.retryableStatuses.includes(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on the last attempt
      if (attempt === retryConfig.maxRetries) {
        break;
      }
      
      // Check if error is retryable
      if (!isRetryable(error, retryConfig.retryableStatuses)) {
        throw error;
      }
      
      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        retryConfig.baseDelayMs,
        retryConfig.maxDelayMs
      );
      
      console.log(`[API Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      
      if (retryConfig.onRetry) {
        retryConfig.onRetry(attempt + 1, error);
      }
      
      await sleep(delay);
    }
  }
  
  throw lastError || new Error('Request failed after retries');
}

/**
 * Create an AbortSignal with timeout
 */
function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal as any;
}

/**
 * API client with built-in retry logic
 */
export class RetryableAPI {
  private baseURL: string;
  private defaultRetryConfig: RetryConfig;

  constructor(baseURL: string = ENV.BACKEND_URL, retryConfig: RetryConfig = {}) {
    this.baseURL = baseURL;
    this.defaultRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  }

  async get(endpoint: string, config: RequestConfig = {}): Promise<Response> {
    return fetchWithRetry(`${this.baseURL}${endpoint}`, {
      ...config,
      method: 'GET',
      retry: { ...this.defaultRetryConfig, ...config.retry },
    });
  }

  async post(endpoint: string, data: any, config: RequestConfig = {}): Promise<Response> {
    return fetchWithRetry(`${this.baseURL}${endpoint}`, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(data),
      retry: { ...this.defaultRetryConfig, ...config.retry },
    });
  }

  async put(endpoint: string, data: any, config: RequestConfig = {}): Promise<Response> {
    return fetchWithRetry(`${this.baseURL}${endpoint}`, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      body: JSON.stringify(data),
      retry: { ...this.defaultRetryConfig, ...config.retry },
    });
  }

  async delete(endpoint: string, config: RequestConfig = {}): Promise<Response> {
    return fetchWithRetry(`${this.baseURL}${endpoint}`, {
      ...config,
      method: 'DELETE',
      retry: { ...this.defaultRetryConfig, ...config.retry },
    });
  }
}

/**
 * Offline queue for failed requests
 */
export class OfflineQueue {
  private queue: Array<{
    id: string;
    url: string;
    config: RequestConfig;
    timestamp: number;
  }> = [];
  private storageKey = 'api_offline_queue';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch {
      // Ignore storage errors
    }
  }

  enqueue(url: string, config: RequestConfig) {
    const item = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      config,
      timestamp: Date.now(),
    };
    this.queue.push(item);
    this.saveToStorage();
    return item.id;
  }

  dequeue(id: string) {
    this.queue = this.queue.filter(item => item.id !== id);
    this.saveToStorage();
  }

  async processQueue(): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    const itemsToProcess = [...this.queue];
    
    for (const item of itemsToProcess) {
      try {
        await fetchWithRetry(item.url, item.config);
        this.dequeue(item.id);
        success++;
      } catch {
        failed++;
      }
    }

    return { success, failed };
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
    this.saveToStorage();
  }
}

// Export singleton instances
export const apiWithRetry = new RetryableAPI();
export const offlineQueue = new OfflineQueue();

export default fetchWithRetry;
