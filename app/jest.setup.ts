/**
 * Jest Setup
 * Global test configuration
 */

import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
// expo-av pulls in expo-asset, whose platform utils touch a native global
// that Jest does not provide.
jest.mock('expo-av', () => {
  const React = require('react');
  return {
    Video: (props: any) => React.createElement('Video', props, props?.children),
    Audio: {
      Sound: { createAsync: jest.fn(async () => ({ sound: { playAsync: jest.fn(), unloadAsync: jest.fn() } })) },
      setAudioModeAsync: jest.fn(async () => {}),
    },
    ResizeMode: { CONTAIN: 'contain', COVER: 'cover', STRETCH: 'stretch' },
  };
});

// expo-haptics reaches for a native module that does not exist under Jest.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(async () => {}),
  notificationAsync: jest.fn(async () => {}),
  selectionAsync: jest.fn(async () => {}),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// AsyncStorage's native module is null in the Jest environment; back it with
// an in-memory map so persistence-dependent code paths behave predictably.
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (k: string) => (store.has(k) ? store.get(k)! : null)),
      setItem: jest.fn(async (k: string, v: string) => {
        store.set(k, v);
      }),
      removeItem: jest.fn(async (k: string) => {
        store.delete(k);
      }),
      clear: jest.fn(async () => {
        store.clear();
      }),
      getAllKeys: jest.fn(async () => Array.from(store.keys())),
      multiGet: jest.fn(async (ks: string[]) => ks.map(k => [k, store.get(k) ?? null])),
      multiSet: jest.fn(async (pairs: [string, string][]) => {
        pairs.forEach(([k, v]) => store.set(k, v));
      }),
      multiRemove: jest.fn(async (ks: string[]) => {
        ks.forEach(k => store.delete(k));
      }),
    },
  };
});

jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {},
    },
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Firebase
jest.mock('./src/lib/firebaseClient', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn((cb) => {
      cb(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
  db: {},
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

// Mock PostHog
jest.mock('posthog-react-native', () => ({
  __esModule: true,
  default: {
    initAsync: jest.fn().mockResolvedValue(undefined),
    capture: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
  },
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
  usePostHog: () => ({
    capture: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
  }),
}));

// Mock Expo Notifications used by consequence engine
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notification-id'),
  SchedulableTriggerInputTypes: {
    TIME_INTERVAL: 'timeInterval',
  },
}));

// Global fetch mock
global.fetch = jest.fn();

// Console suppressions in test
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Suppress specific React Native warnings in tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('useNativeDriver') ||
      args[0].includes('Require cycle') ||
      args[0].includes(' deprecated '))
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});
