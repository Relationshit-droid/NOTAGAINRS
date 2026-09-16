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

/**
 * Build-time inlined environment table.
 *
 * `babel-preset-expo` only substitutes *static* member expressions such as
 * `process.env.EXPO_PUBLIC_FIREBASE_API_KEY`. The previous implementation read
 * `process.env[key]` with a variable key, which the transformer cannot see, so
 * in a production web bundle (`expo export`) `process.env` is just `{}` and
 * every value came back `undefined` — the app silently fell back to demo mode
 * and default URLs even when `.env` was correct.
 *
 * Enumerating the variables with dot access here lets the bundler inline the
 * real values while keeping the ergonomic `getEnv('KEY')` call sites below.
 */
const STATIC_ENV: Record<string, string | undefined> = {
  EXPO_PUBLIC_APP_NAME: process.env.EXPO_PUBLIC_APP_NAME,
  EXPO_PUBLIC_APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_WS_URL: process.env.EXPO_PUBLIC_WS_URL,
  // Firebase
  EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  // Third-party APIs
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
  EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
  EXPO_PUBLIC_GIPHY_API_KEY: process.env.EXPO_PUBLIC_GIPHY_API_KEY,
  EXPO_PUBLIC_MAPBOX_API_KEY: process.env.EXPO_PUBLIC_MAPBOX_API_KEY,
  // Security / admin
  EXPO_PUBLIC_ENCRYPTION_PEPPER: process.env.EXPO_PUBLIC_ENCRYPTION_PEPPER,
  EXPO_PUBLIC_ADMIN_BASE_URL: process.env.EXPO_PUBLIC_ADMIN_BASE_URL,
  // Support & legal
  EXPO_PUBLIC_PRIVACY_POLICY_URL: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL,
  EXPO_PUBLIC_TERMS_OF_SERVICE_URL: process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL,
  EXPO_PUBLIC_SUPPORT_EMAIL: process.env.EXPO_PUBLIC_SUPPORT_EMAIL,
  // Feature flags
  EXPO_PUBLIC_DEMO_MODE: process.env.EXPO_PUBLIC_DEMO_MODE,
  EXPO_PUBLIC_ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS,
  EXPO_PUBLIC_ENABLE_CRASH_REPORTING: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING,
  EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS,
  EXPO_PUBLIC_ENABLE_OFFLINE_MODE: process.env.EXPO_PUBLIC_ENABLE_OFFLINE_MODE,
  EXPO_PUBLIC_ENABLE_BETA_FEATURES: process.env.EXPO_PUBLIC_ENABLE_BETA_FEATURES,
  EXPO_PUBLIC_ENABLE_ADMIN_PANEL: process.env.EXPO_PUBLIC_ENABLE_ADMIN_PANEL,
};

const getEnv = (key: string): string => {
  // Try import.meta.env (Vite)
  // Skip import.meta usage in tests to avoid parser issues; prefer process.env first

  // 1. Live runtime lookup — Node, jest, the Metro dev server and the native
  //    runtime all populate a real process.env.
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key] as string;
    }
  } catch {
    // Not in Node environment
  }

  // 2. Build-time inlined value. Without this, production web bundles (where
  //    process.env is an empty object) would never see the .env values.
  const inlined = STATIC_ENV[key];
  if (inlined) {
    return inlined;
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

  // Feature Flags — enabled ONLY when explicitly "true"
  ENABLE_ANALYTICS: getEnv('EXPO_PUBLIC_ENABLE_ANALYTICS') === 'true',
  ENABLE_CRASH_REPORTING: getEnv('EXPO_PUBLIC_ENABLE_CRASH_REPORTING') === 'true',
  ENABLE_PUSH_NOTIFICATIONS: getEnv('EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS') === 'true',
  ENABLE_OFFLINE_MODE: getEnv('EXPO_PUBLIC_ENABLE_OFFLINE_MODE') === 'true',
  ENABLE_BETA_FEATURES: getEnv('EXPO_PUBLIC_ENABLE_BETA_FEATURES') === 'true',
  ENABLE_ADMIN_PANEL: getEnv('EXPO_PUBLIC_ENABLE_ADMIN_PANEL') === 'true',
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
