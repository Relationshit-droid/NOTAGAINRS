/**
 * Offline Queue System
 * Store operations locally and sync when connection returns
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ENV } from './env';

interface QueuedOperation {
  id: string;
  type: 'game_start' | 'answer_submit' | 'game_complete' | 'analytics' | 'sos_trigger';
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
  priority: 'high' | 'normal' | 'low';
}

interface OfflineQueueState {
  operations: QueuedOperation[];
  isProcessing: boolean;
  lastSyncAttempt: number | null;
}

const QUEUE_STORAGE_KEY = '@offline_queue_v1';
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

class OfflineQueue {
  private queue: QueuedOperation[] = [];
  private isProcessing: boolean = false;
  private unsubscribeNetInfo: (() => void) | null = null;
  private lastSyncAttempt: number | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Load queued operations from storage
    await this.loadQueue();

    // Subscribe to network changes
    this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleNetworkChange);

    // Process queue if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.processQueue();
    }
  }

  private handleNetworkChange = (state: NetInfoState) => {
    if (state.isConnected && this.queue.length > 0) {
      console.log('[OfflineQueue] Connection restored, processing queue...');
      this.processQueue();
    }
  };

  private async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        const state: OfflineQueueState = JSON.parse(stored);
        this.queue = state.operations || [];
        this.lastSyncAttempt = state.lastSyncAttempt;
        console.log(`[OfflineQueue] Loaded ${this.queue.length} operations`);
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to load queue:', error);
    }
  }

  private async saveQueue() {
    try {
      const state: OfflineQueueState = {
        operations: this.queue,
        isProcessing: this.isProcessing,
        lastSyncAttempt: this.lastSyncAttempt,
      };
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[OfflineQueue] Failed to save queue:', error);
    }
  }

  /**
   * Add an operation to the queue
   */
  async enqueue(
    type: QueuedOperation['type'],
    endpoint: string,
    data: any,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<string> {
    const operation: QueuedOperation = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      priority,
    };

    // High priority operations go to front of queue
    if (priority === 'high') {
      this.queue.unshift(operation);
    } else {
      this.queue.push(operation);
    }

    await this.saveQueue();
    console.log(`[OfflineQueue] Enqueued ${type} operation: ${operation.id}`);

    // Try to process immediately if online
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      this.processQueue();
    }

    return operation.id;
  }

  /**
   * Process all queued operations
   */
  async processQueue(): Promise<{ success: number; failed: number }> {
    if (this.isProcessing || this.queue.length === 0) {
      return { success: 0, failed: 0 };
    }

    this.isProcessing = true;
    this.lastSyncAttempt = Date.now();
    await this.saveQueue();

    // Sort by priority (high first) then timestamp
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.timestamp - b.timestamp;
    });

    let success = 0;
    let failed = 0;
    const toRemove: string[] = [];

    console.log(`[OfflineQueue] Processing ${this.queue.length} operations...`);

    for (const operation of [...this.queue]) {
      try {
        const result = await this.sendOperation(operation);
        
        if (result.success) {
          toRemove.push(operation.id);
          success++;
        } else {
          operation.retryCount++;
          
          if (operation.retryCount >= MAX_RETRIES) {
            console.warn(`[OfflineQueue] Max retries reached for ${operation.id}`);
            toRemove.push(operation.id);
            failed++;
            
            // Store failed operation for later inspection
            await this.storeFailedOperation(operation);
          }
        }
      } catch (error) {
        console.error(`[OfflineQueue] Error processing ${operation.id}:`, error);
        operation.retryCount++;
        
        if (operation.retryCount >= MAX_RETRIES) {
          toRemove.push(operation.id);
          failed++;
        }
      }
    }

    // Remove completed/failed operations
    this.queue = this.queue.filter(op => !toRemove.includes(op.id));
    this.isProcessing = false;
    await this.saveQueue();

    console.log(`[OfflineQueue] Sync complete: ${success} success, ${failed} failed, ${this.queue.length} pending`);

    return { success, failed };
  }

  /**
   * Send a single operation to the server
   */
  private async sendOperation(operation: QueuedOperation): Promise<{ success: boolean }> {
    const url = `${ENV.BACKEND_URL}${operation.endpoint}`;
    
    // Get fresh auth token
    const token = await this.getAuthToken();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(operation.data),
    });

    // Success or client error (don't retry 4xx except 408, 429)
    if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429)) {
      return { success: true };
    }

    return { success: false };
  }

  /**
   * Get current auth token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const { auth } = await import('./firebaseClient');
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }
    } catch {
      // Fallback: try to get from storage
      const token = await AsyncStorage.getItem('@auth_token');
      return token;
    }
    return null;
  }

  /**
   * Store failed operation for later inspection
   */
  private async storeFailedOperation(operation: QueuedOperation) {
    try {
      const failed = await AsyncStorage.getItem('@offline_failed_operations');
      const failedOps: QueuedOperation[] = failed ? JSON.parse(failed) : [];
      failedOps.push(operation);
      
      // Keep only last 50 failed operations
      if (failedOps.length > 50) {
        failedOps.shift();
      }
      
      await AsyncStorage.setItem('@offline_failed_operations', JSON.stringify(failedOps));
    } catch (error) {
      console.error('[OfflineQueue] Failed to store failed operation:', error);
    }
  }

  /**
   * Remove an operation from the queue
   */
  async dequeue(operationId: string): Promise<void> {
    this.queue = this.queue.filter(op => op.id !== operationId);
    await this.saveQueue();
  }

  /**
   * Clear all queued operations
   */
  async clear(): Promise<void> {
    this.queue = [];
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
  }

  /**
   * Get queue statistics
   */
  getStats(): { pending: number; isProcessing: boolean; lastSync: number | null } {
    return {
      pending: this.queue.length,
      isProcessing: this.isProcessing,
      lastSync: this.lastSyncAttempt,
    };
  }

  /**
   * Get pending operations count by type
   */
  getPendingByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    for (const op of this.queue) {
      counts[op.type] = (counts[op.type] || 0) + 1;
    }
    return counts;
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
  }
}

// Export singleton instance
export const offlineQueue = new OfflineQueue();

// Helper functions for common operations
export async function queueGameStart(gameId: string, categoryId: string, data: any): Promise<string> {
  return offlineQueue.enqueue(
    'game_start',
    '/api/games/sessions',
    { game_id: gameId, category_id: categoryId, ...data },
    'high'
  );
}

export async function queueAnswerSubmit(sessionId: string, questionId: string, answer: any): Promise<string> {
  return offlineQueue.enqueue(
    'answer_submit',
    `/api/games/sessions/${sessionId}/answers`,
    { session_id: sessionId, question_id: questionId, answer },
    'high'
  );
}

export async function queueGameComplete(sessionId: string, finalScore: number, data: any): Promise<string> {
  return offlineQueue.enqueue(
    'game_complete',
    `/api/games/sessions/${sessionId}/complete`,
    { session_id: sessionId, final_score: finalScore, ...data },
    'high'
  );
}

export async function queueAnalytics(event: string, properties: any): Promise<string> {
  return offlineQueue.enqueue(
    'analytics',
    '/api/analytics/track',
    { event_type: event, properties, timestamp: new Date().toISOString() },
    'low'
  );
}

export async function queueSOSTrigger(data: any): Promise<string> {
  return offlineQueue.enqueue(
    'sos_trigger',
    '/api/sos/trigger',
    data,
    'high'
  );
}

export default offlineQueue;
