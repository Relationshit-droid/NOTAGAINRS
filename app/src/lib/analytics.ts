/*
 * Analytics & Telemetry
 * Tracks user events, game sessions, and relationship milestones
 * Sends events to PostHog or Segment
 */

import { ENV } from './env';

// =============================================================================
// Types
// =============================================================================

export type AnalyticsEventType =
  | 'game_start'
  | 'game_complete'
  | 'game_abandon'
  | 'game_rage_quit'
  | 'answer_submit'
  | 'achievement_unlock'
  | 'session_start'
  | 'session_end'
  | 'couple_link'
  | 'couple_unlink'
  | 'sos_trigger'
  | 'sos_resolve'
  | 'marcie_chat_start'
  | 'marcie_chat_end'
  | 'app_open'
  | 'app_close'
  | 'streak_maintained'
  | 'streak_broken'
  | 'milestone_reached';

export interface AnalyticsEvent {
  event_type: AnalyticsEventType;
  user_id: string;
  couple_id?: string;
  session_id?: string;
  game_id?: string;
  category_id?: string;
  properties?: Record<string, any>;
  timestamp?: string;
  platform?: 'ios' | 'android' | 'web';
  app_version?: string;
}

// =============================================================================
// Configuration
// =============================================================================

const ANALYTICS_ENABLED = ENV.ENABLE_ANALYTICS !== 'false';
const POSTHOG_KEY = ENV.POSTHOG_API_KEY;
const POSTHOG_HOST = ENV.POSTHOG_HOST || 'https://app.posthog.com';
const API_URL = ENV.BACKEND_URL;

// =============================================================================
// PostHog Integration
// =============================================================================

class PostHogClient {
  private initialized = false;
  private queue: AnalyticsEvent[] = [];

  async init() {
    if (!POSTHOG_KEY || !ANALYTICS_ENABLED) return;

    try {
      // Dynamically import PostHog to avoid issues if not configured
      const posthog = await import('posthog-react-native');
      await posthog.default.initAsync(POSTHOG_KEY, {
        host: POSTHOG_HOST,
      });
      this.initialized = true;

      // Flush queued events
      this.queue.forEach(event => this.capture(event));
      this.queue = [];
    } catch (err) {
      console.warn('[Analytics] PostHog init failed:', err);
    }
  }

  capture(event: AnalyticsEvent) {
    try {
      const posthog = require('posthog-react-native').default;
      // Top-level game_id/category_id are optional on the event and are
      // normally carried inside `properties`. Listing them after the spread
      // used to overwrite the real values with undefined, so every event
      // reached PostHog with its identifiers stripped.
      posthog.capture(event.event_type, {
        distinct_id: event.user_id,
        couple_id: event.couple_id,
        platform: event.platform,
        app_version: event.app_version,
        ...(event.game_id ? { game_id: event.game_id } : {}),
        ...(event.category_id ? { category_id: event.category_id } : {}),
        ...event.properties,
      });
    } catch (err) {
      if (!this.initialized) {
        this.queue.push(event);
      }
      console.warn('[Analytics] PostHog capture failed:', err);
    }
  }

  identify(userId: string, properties?: Record<string, any>) {
    try {
      const posthog = require('posthog-react-native').default;
      posthog.identify(userId, properties);
    } catch (err) {
      console.warn('[Analytics] PostHog identify failed:', err);
    }
  }
}

const posthogClient = new PostHogClient();

// =============================================================================
// Backend Analytics API
// =============================================================================

async function sendToBackend(event: AnalyticsEvent): Promise<void> {
  if (!API_URL) return;

  try {
    const response = await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.warn('[Analytics] Backend send failed:', err);
    // Store for retry
    storeForRetry(event);
  }
}

// =============================================================================
// Offline Queue
// =============================================================================

const RETRY_KEY = '@analytics_retry_queue';

async function storeForRetry(event: AnalyticsEvent): Promise<void> {
  try {
    const existing = await getRetryQueue();
    existing.push({ event, timestamp: Date.now() });
    await AsyncStorage.setItem(RETRY_KEY, JSON.stringify(existing.slice(-100))); // Keep last 100
  } catch {
    // Silently fail
  }
}

async function getRetryQueue(): Promise<Array<{ event: AnalyticsEvent; timestamp: number }>> {
  try {
    const data = await AsyncStorage.getItem(RETRY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function flushRetryQueue(): Promise<void> {
  const queue = await getRetryQueue();
  if (queue.length === 0) return;

  const failed: typeof queue = [];

  for (const item of queue) {
    try {
      await sendToBackend(item.event);
    } catch {
      // Only retry events less than 24 hours old
      if (Date.now() - item.timestamp < 24 * 60 * 60 * 1000) {
        failed.push(item);
      }
    }
  }

  await AsyncStorage.setItem(RETRY_KEY, JSON.stringify(failed));
}

// =============================================================================
// Main Analytics API
// =============================================================================

export class Analytics {
  private userId: string | null = null;
  private coupleId: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    posthogClient.init();
  }

  setUser(userId: string, properties?: Record<string, any>) {
    this.userId = userId;
    posthogClient.identify(userId, properties);
  }

  setCouple(coupleId: string) {
    this.coupleId = coupleId;
  }

  setSession(sessionId: string) {
    this.sessionId = sessionId;
  }

  track(eventType: AnalyticsEventType, properties?: Record<string, any>) {
    if (!this.userId || !ANALYTICS_ENABLED) return;

    const event: AnalyticsEvent = {
      event_type: eventType,
      user_id: this.userId,
      couple_id: this.coupleId || undefined,
      session_id: this.sessionId || undefined,
      properties: properties || {},
      timestamp: new Date().toISOString(),
      platform: this.getPlatform(),
      app_version: ENV.APP_VERSION,
    };

    // Send to all providers
    posthogClient.capture(event);
    sendToBackend(event);
  }

  // Convenience methods
  gameStart(gameId: string, categoryId: string, properties?: Record<string, any>) {
    this.track('game_start', { game_id: gameId, category_id: categoryId, ...properties });
  }

  gameComplete(gameId: string, score: number, durationSeconds: number, properties?: Record<string, any>) {
    this.track('game_complete', {
      game_id: gameId,
      score,
      duration_seconds: durationSeconds,
      ...properties,
    });
  }

  gameAbandon(gameId: string, reason?: string, properties?: Record<string, any>) {
    this.track('game_abandon', { game_id: gameId, reason, ...properties });
  }

  gameRageQuit(gameId: string, properties?: Record<string, any>) {
    this.track('game_rage_quit', { game_id: gameId, ...properties });
  }

  achievementUnlock(achievementId: string, achievementName: string) {
    this.track('achievement_unlock', { achievement_id: achievementId, achievement_name: achievementName });
  }

  sosTrigger(severity: number, trigger?: string) {
    this.track('sos_trigger', { severity, trigger });
  }

  sosResolve(durationSeconds: number, usedGame?: string) {
    this.track('sos_resolve', { duration_seconds: durationSeconds, used_game: usedGame });
  }

  milestoneReached(milestoneType: string, title: string, description?: string) {
    this.track('milestone_reached', { milestone_type: milestoneType, title, description });
  }

  streakMaintained(days: number) {
    this.track('streak_maintained', { days });
  }

  streakBroken(previousStreak: number) {
    this.track('streak_broken', { previous_streak: previousStreak });
  }

  private getPlatform(): 'ios' | 'android' | 'web' {
    // Detect platform
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/android/.test(userAgent)) return 'android';
      if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    }
    return 'web';
  }
}

// =============================================================================
// Singleton Export
// =============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

export const analytics = new Analytics();

export default analytics;
