/**
 * Lightweight performance tracing.
 *
 * The project is Firebase-only, but Firebase Performance Monitoring ships as a
 * native module (@react-native-firebase/perf) that is unavailable in Expo Go
 * and on web, so the previous dynamic import always threw and every trace
 * silently degraded anyway. This implementation drops the dead dependency and
 * measures wall-clock time locally instead, which works on every platform.
 */

export interface Trace {
  putMetric: (key: string, value: number) => void;
  getMetrics: () => Record<string, number>;
  stop: () => Promise<number>;
}

const completed: Array<{ name: string; duration: number; metrics: Record<string, number> }> = [];

export async function initPerf(): Promise<boolean> {
  return false;
}

export async function startTrace(name: string): Promise<Trace> {
  const startedAt = Date.now();
  const metrics: Record<string, number> = {};

  return {
    putMetric: (key: string, value: number) => {
      metrics[key] = value;
    },
    getMetrics: () => ({ ...metrics }),
    stop: async () => {
      const duration = Date.now() - startedAt;
      completed.push({ name, duration, metrics });
      if (completed.length > 100) completed.shift();
      return duration;
    },
  };
}

/** Recently completed traces, newest last. Useful for debug overlays. */
export function getRecordedTraces() {
  return [...completed];
}

export async function instrumentFetch(
  url: string,
  init?: RequestInit,
  label = 'network_request'
): Promise<Response> {
  const trace = await startTrace(label);
  try {
    const res = await fetch(url, init);
    trace.putMetric('status', (res as any).status || 0);
    trace.putMetric('size', Number((res as any).headers?.get?.('content-length')) || 0);
    await trace.stop();
    return res;
  } catch (e) {
    trace.putMetric('error', 1);
    await trace.stop();
    throw e;
  }
}
