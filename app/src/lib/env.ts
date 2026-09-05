/**
 * Centralized Environment Variable Access
 * Compatible with both Vite (import.meta.env) and Metro (process.env)
 * For Expo, all variables must be prefixed with EXPO_PUBLIC_
 */

// =============================================================================
// Environment Detection
// =============================================================================

const isWeb = typeof window !== 'undefined';
const isExpo = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

// =============================================================================
// Environment Variable Getter
// =============================================================================

const getEnv = (key: string): string => {
  // Try import.meta.env (Vite)
  // Skip import.meta usage in tests to avoid parser issues; prefer process.env first

  // Try process.env (Node/Metro)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {
    // Not in Node environment
  }

  // Try Expo Constants (if available)
  try {
    const Constants = require('expo-constants').default;
    const expoEnv = Constants.expoConfig?.extra?.[key];
    if (expoEnv) {
      return expoEnv;
    }
  } catch {
    // Expo not available
  }

  return '';
};

// =============================================================================
// Environment Configuration
// =============================================================================

export const ENV = {
  // App Info
  APP_NAME: getEnv('EXPO_PUBLIC_APP_NAME') || 'Relationshit',
  APP_VERSION: getEnv('EXPO_PUBLIC_APP_VERSION') || '2.0.0',

  // Backend API
  // Retained only for legacy call sites; data is served from Firestore.
  BACKEND_URL: getEnv('EXPO_PUBLIC_API_URL') || '',
  WS_URL: getEnv('EXPO_PUBLIC_WS_URL') || '',

  // Firebase Configuration
  FIREBASE_API_KEY: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  FIREBASE_PROJECT_ID: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
  FIREBASE_STORAGE_BUCKET: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  FIREBASE_MESSAGING_SENDER_ID: getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  FIREBASE_APP_ID: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),

  // Third-party APIs
  SENTRY_DSN: getEnv('EXPO_PUBLIC_SENTRY_DSN'),
  POSTHOG_API_KEY: getEnv('EXPO_PUBLIC_POSTHOG_API_KEY'),
  POSTHOG_HOST: getEnv('EXPO_PUBLIC_POSTHOG_HOST') || 'https://app.posthog.com',
  GEMINI_API_KEY: getEnv('EXPO_PUBLIC_GEMINI_API_KEY'),

  // Demo mode: run the preview without a live Firebase project.
  DEMO_MODE: getEnv('EXPO_PUBLIC_DEMO_MODE') === 'true',
  GIPHY_API_KEY: getEnv('EXPO_PUBLIC_GIPHY_API_KEY'),
  MAPBOX_API_KEY: getEnv('EXPO_PUBLIC_MAPBOX_API_KEY'),

  // Security
  ENCRYPTION_PEPPER: getEnv('EXPO_PUBLIC_ENCRYPTION_PEPPER'),

  // Admin
  ADMIN_BASE_URL: getEnv('EXPO_PUBLIC_ADMIN_BASE_URL'),

  // URLs
  PRIVACY_POLICY_URL: getEnv('EXPO_PUBLIC_PRIVACY_POLICY_URL') || 'https://lovetrae.app/privacy',
  TERMS_OF_SERVICE_URL: getEnv('EXPO_PUBLIC_TERMS_OF_SERVICE_URL') || 'https://lovetrae.app/terms',
  SUPPORT_EMAIL: getEnv('EXPO_PUBLIC_SUPPORT_EMAIL') || 'support@lovetrae.app',

  // Feature Flags
  ENABLE_ANALYTICS: getEnv('EXPO_PUBLIC_ENABLE_ANALYTICS') !== 'false',
  ENABLE_CRASH_REPORTING: getEnv('EXPO_PUBLIC_ENABLE_CRASH_REPORTING') !== 'false',
  ENABLE_PUSH_NOTIFICATIONS: getEnv('EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS') !== 'false',
  ENABLE_OFFLINE_MODE: getEnv('EXPO_PUBLIC_ENABLE_OFFLINE_MODE') !== 'false',
  ENABLE_BETA_FEATURES: getEnv('EXPO_PUBLIC_ENABLE_BETA_FEATURES') === 'true',
};

// =============================================================================
// Validation Helpers
// =============================================================================

export function validateEnv(): { valid: boolean; missing: string[] } {
  const required = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_API_URL',
  ];

  const missing = required.filter(key => !getEnv(key));

  return {
    valid: missing.length === 0,
    missing,
  };
}

// =============================================================================
// Debug Info (Development Only)
// =============================================================================

if (__DEV__) {
  console.log('[ENV] Environment loaded:', {
    BACKEND_URL: ENV.BACKEND_URL,
    WS_URL: ENV.WS_URL,
    FIREBASE_PROJECT_ID: ENV.FIREBASE_PROJECT_ID ? '✓' : '✗',
    SENTRY_DSN: ENV.SENTRY_DSN ? '✓' : '✗',
    POSTHOG_API_KEY: ENV.POSTHOG_API_KEY ? '✓' : '✗',
  });
}

export default ENV;
