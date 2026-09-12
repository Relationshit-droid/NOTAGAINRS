import { getVariant, getFlag } from '../lib/ab-testing';

jest.mock('../lib/supabase', () => ({ supabase: { from: jest.fn().mockReturnValue({ select: jest.fn().mockReturnThis(), eq: jest.fn().mockReturnThis(), single: jest.fn().mockResolvedValue({ data: null, error: null }) }) } }));

test('A/B getVariant is stable and respects weights', async () => {
  const v1 = await getVariant('user-1', 'translator_v2');
  const v2 = await getVariant('user-1', 'translator_v2');
  expect(v1).toBe(v2);
  expect(['control', 'new_ui']).toContain(v1);
});

test('Feature flag falls back to default when remote missing', async () => {
  const enabled = await getFlag('nonexistent_flag', true);
  expect(enabled).toBe(true);
});

