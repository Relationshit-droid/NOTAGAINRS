/**
 * Analytics Tests
 */

import { Analytics, AnalyticsEvent } from '../../lib/analytics';

// Mock PostHog
jest.mock('posthog-react-native', () => ({
  __esModule: true,
  default: {
    initAsync: jest.fn().mockResolvedValue(undefined),
    capture: jest.fn(),
    identify: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

describe('Analytics', () => {
  let analytics: Analytics;

  beforeEach(() => {
    jest.clearAllMocks();
    analytics = new Analytics();
  });

  describe('setUser', () => {
    it('should set user and identify in PostHog', async () => {
      const userId = 'test-user-123';
      const properties = { email: 'test@example.com' };
      
      analytics.setUser(userId, properties);
      
      const posthog = require('posthog-react-native').default;
      expect(posthog.identify).toHaveBeenCalledWith(userId, properties);
    });
  });

  describe('track', () => {
    it('should not track without user', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.track('game_start', { game_id: 'test-game' });
      
      expect(posthog.capture).not.toHaveBeenCalled();
    });

    it('should track event with user', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.setUser('test-user-123');
      analytics.track('game_start', { game_id: 'test-game' });
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'game_start',
        expect.objectContaining({
          distinct_id: 'test-user-123',
          game_id: 'test-game',
        })
      );
    });
  });

  describe('convenience methods', () => {
    beforeEach(() => {
      analytics.setUser('test-user-123');
    });

    it('should track game start', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.gameStart('truth-or-trust', 'emotional-connection');
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'game_start',
        expect.objectContaining({
          game_id: 'truth-or-trust',
          category_id: 'emotional-connection',
        })
      );
    });

    it('should track game completion', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.gameComplete('truth-or-trust', 100, 120);
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'game_complete',
        expect.objectContaining({
          game_id: 'truth-or-trust',
          score: 100,
          duration_seconds: 120,
        })
      );
    });

    it('should track game abandon', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.gameAbandon('truth-or-trust', 'too hard');
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'game_abandon',
        expect.objectContaining({
          game_id: 'truth-or-trust',
          reason: 'too hard',
        })
      );
    });

    it('should track achievement unlock', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.achievementUnlock('first-kiss', 'First Kiss');
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'achievement_unlock',
        expect.objectContaining({
          achievement_id: 'first-kiss',
          achievement_name: 'First Kiss',
        })
      );
    });

    it('should track SOS trigger', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.sosTrigger(4, 'big fight');
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'sos_trigger',
        expect.objectContaining({
          severity: 4,
          trigger: 'big fight',
        })
      );
    });

    it('should track milestone', () => {
      const posthog = require('posthog-react-native').default;
      
      analytics.milestoneReached('7-day-streak', '7 Day Streak');
      
      expect(posthog.capture).toHaveBeenCalledWith(
        'milestone_reached',
        expect.objectContaining({
          milestone_type: '7-day-streak',
          title: '7 Day Streak',
        })
      );
    });
  });
});
