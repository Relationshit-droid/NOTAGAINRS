let perfMod: any = null;

export async function initPerf() {
  if (perfMod) return true;
  try {
    // Lazy import to avoid breaking in environments without Firebase
    const app = await import('@react-native-firebase/app');
    const perf = await import('@react-native-firebase/perf');
    // Access default export safely
    perfMod = (perf as any).default || perf;
    return !!perfMod;
  } catch {
    perfMod = null;
    return false;
  }
}

export async function startTrace(name: string) {
  const ok = await initPerf();
  if (ok && perfMod) {
    const trace = await perfMod().newTrace(name);
    await trace.start();
    return {
      putMetric: (k: string, v: number) => trace.putMetric(k, v),
      stop: async () => { await trace.stop(); },
    };
  }
  const t0 = Date.now();
  return {
    putMetric: (_k: string, _v: number) => {},
    stop: async () => { return; },
  };
}

export async function instrumentFetch(url: string, init?: RequestInit, label = 'network_request') {
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
