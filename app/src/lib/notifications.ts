/**
 * Push Notification System
 * Expo Notifications integration
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { ENV } from './env';
import { auth } from './firebaseClient';

// Notification types
export type NotificationType = 
  | 'partner_joined'
  | 'sos_triggered'
  | 'leaderboard_rank_change'
  | 'streak_reminder'
  | 'daily_challenge'
  | 'game_invite'
  | 'achievement_unlocked';

interface NotificationData {
  type: NotificationType;
  [key: string]: any;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private pushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  /**
   * Initialize notification service
   */
  async init(): Promise<boolean> {
    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('[Notifications] Permission denied');
        return false;
      }

      // Get push token
      await this.registerForPushNotifications();

      // Setup listeners
      this.setupListeners();

      console.log('[Notifications] Initialized successfully');
      return true;
    } catch (error) {
      console.error('[Notifications] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('[Notifications] Must use physical device for push notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  /**
   * Register for push notifications
   */
  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Get project ID
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!projectId) {
        console.warn('[Notifications] No project ID found');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      this.pushToken = token.data;

      console.log('[Notifications] Push token:', this.pushToken);

      // Register token with backend
      await this.registerTokenWithBackend(this.pushToken);

      // Platform-specific configuration
      if (Platform.OS === 'android') {
        await this.setupAndroidChannel();
      }

      return this.pushToken;
    } catch (error) {
      console.error('[Notifications] Failed to get push token:', error);
      return null;
    }
  }

  /**
   * Setup Android notification channel
   */
  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FA1F63',
    });

    // High priority channel for SOS
    await Notifications.setNotificationChannelAsync('sos', {
      name: 'SOS Alerts',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#FF0000',
      sound: 'default',
    });

    // Streak reminders
    await Notifications.setNotificationChannelAsync('streaks', {
      name: 'Streak Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 100, 100, 100],
    });
  }

  /**
   * Register token with backend
   */
  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn('[Notifications] No user logged in');
        return;
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch(`${ENV.BACKEND_URL}/api/users/device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          token,
          platform: Platform.OS,
          deviceId: Device.modelName || 'unknown',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register token');
      }

      console.log('[Notifications] Token registered with backend');
    } catch (error) {
      console.error('[Notifications] Failed to register token:', error);
    }
  }

  /**
   * Setup notification listeners
   */
  private setupListeners(): void {
    // Handle incoming notifications
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('[Notifications] Received:', notification);
        this.handleNotification(notification);
      }
    );

    // Handle notification responses (user taps)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('[Notifications] Response:', response);
        this.handleNotificationResponse(response);
      }
    );
  }

  /**
   * Handle incoming notification
   */
  private handleNotification(notification: Notifications.Notification): void {
    const data = notification.request.content.data as NotificationData;

    switch (data?.type) {
      case 'sos_triggered':
        // Handle SOS notification
        this.playSOSAlert();
        break;
      case 'partner_joined':
        // Handle partner joined
        break;
      case 'streak_reminder':
        // Handle streak reminder
        break;
    }
  }

  /**
   * Handle notification response (user interaction)
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as NotificationData;

    // Navigate based on notification type
    switch (data?.type) {
      case 'sos_triggered':
        // Navigate to SOS screen
        break;
      case 'partner_joined':
        // Navigate to dashboard
        break;
      case 'leaderboard_rank_change':
        // Navigate to leaderboard
        break;
      case 'game_invite':
        // Navigate to game
        break;
    }
  }

  /**
   * Play SOS alert sound
   */
  private async playSOSAlert(): Promise<void> {
    // Custom alert sound could be played here
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data: NotificationData,
    trigger: Notifications.NotificationTriggerInput | null = null
  ): Promise<string> {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        badge: 1,
      },
      trigger,
    });

    return identifier;
  }

  /**
   * Schedule streak reminder
   */
  async scheduleStreakReminder(hour: number = 20, minute: number = 0): Promise<string> {
    return this.scheduleLocalNotification(
      '🔥 Keep Your Streak Alive!',
      'Play a game with your partner today to maintain your streak.',
      { type: 'streak_reminder' },
      {
        hour,
        minute,
        repeats: true,
      }
    );
  }

  /**
   * Schedule daily challenge reminder
   */
  async scheduleDailyChallenge(hour: number = 9, minute: number = 0): Promise<string> {
    return this.scheduleLocalNotification(
      '🎮 New Daily Challenge',
      'A new couples challenge is available!',
      { type: 'daily_challenge' },
      {
        hour,
        minute,
        repeats: true,
      }
    );
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Cancel specific notification
   */
  async cancelNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear badge
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Get push token
   */
  getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Cleanup listeners
   */
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

// Export singleton
export const notificationService = new NotificationService();

// Helper functions
export async function initNotifications(): Promise<boolean> {
  return notificationService.init();
}

export async function scheduleStreakReminder(hour?: number, minute?: number): Promise<string> {
  return notificationService.scheduleStreakReminder(hour, minute);
}

export async function scheduleDailyChallenge(hour?: number, minute?: number): Promise<string> {
  return notificationService.scheduleDailyChallenge(hour, minute);
}

export async function clearBadge(): Promise<void> {
  return notificationService.clearBadge();
}

export default notificationService;
