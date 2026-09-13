/**
 * Safe logger that gates output to __DEV__ and sanitizes PII
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = __DEV__;

function sanitize(args: any[]): any[] {
  return args.map(arg => {
    if (typeof arg === 'string') return arg;
    if (arg === null || arg === undefined) return arg;
    if (typeof arg === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(arg)) {
        // Redact potential PII fields
        if (
          key.toLowerCase().includes('email') ||
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('display_name') ||
          key.toLowerCase().includes('displayname') ||
          key.toLowerCase().includes('name') ||
          key.toLowerCase().includes('uid') ||
          key.toLowerCase().includes('id') ||
          key.toLowerCase().includes('phone')
        ) {
          if (typeof value === 'string' && value.length > 6) {
            sanitized[key] = value.slice(0, 4) + '***' + value.slice(-2);
          } else {
            sanitized[key] = '***';
          }
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    }
    return arg;
  });
}

export const logger = {
  debug: (...args: any[]) => {
    if (isDev) console.log('[DEBUG]', ...sanitize(args));
  },
  info: (...args: any[]) => {
    if (isDev) console.info('[INFO]', ...sanitize(args));
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn('[WARN]', ...sanitize(args));
  },
  error: (...args: any[]) => {
    if (isDev) console.error('[ERROR]', ...sanitize(args));
  },
  // For non-dev environments, still allow errors through
  errorAlways: (...args: any[]) => console.error('[ERROR]', ...sanitize(args)),
};

export default logger;