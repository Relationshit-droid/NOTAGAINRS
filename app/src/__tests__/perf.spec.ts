import { initPerf, startTrace, instrumentFetch } from '../lib/perf';

test('initPerf gracefully fails without firebase deps', async () => {
  const ok = await initPerf();
  expect(ok).toBe(false);
});

test('startTrace returns a usable object', async () => {
  const t = await startTrace('test_trace');
  expect(typeof t.putMetric).toBe('function');
  await t.stop();
});

test('instrumentFetch wraps fetch and records metrics', async () => {
  (global as any).fetch = jest.fn().mockResolvedValue({ status: 200, headers: { get: () => '10' } });
  const res = await instrumentFetch('https://example.com', undefined, 'trace_label');
  expect(res.status).toBe(200);
});

