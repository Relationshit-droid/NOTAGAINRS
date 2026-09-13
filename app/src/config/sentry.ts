import * as Sentry from '@sentry/react-native';
import { ENV } from '../lib/env';

export const initSentry = () => {
  if (!ENV.ENABLE_CRASH_REPORTING) {
    console.log('[Sentry] Crash reporting disabled by feature flag.');
    return;
  }

  const dsn = ENV.SENTRY_DSN;
  if (!dsn) {
    console.warn('[Sentry] DSN missing – crash reporting will not work.');
    return;
  }

  Sentry.init({
    dsn,
    enableAutoSessionTracking: true,
    debug: __DEV__,
    release: process.env.EXPO_PUBLIC_SENTRY_RELEASE || 'lovetrae@beta',
  });
};