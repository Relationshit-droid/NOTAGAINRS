import { instrumentFetch } from './perf';
import { Linking } from 'react-native';
import { ENV } from './env';

export type SubscriptionStatus = { status: string; effective: boolean; grace_until: string | null };

const ADMIN_BASE = ENV.ADMIN_BASE_URL;

async function fetchJson(url: string, init?: RequestInit, label = 'stripe_request') {
  const max = 3;
  let lastErr: any = null;
  for (let i = 0; i < max; i++) {
    try {
      const res = await instrumentFetch(url, init, label);
      if (!('ok' in res) || !(res as any).ok) {
        if ((res as any).status >= 500) throw new Error('server_error');
      }
      const json = await (res as any).json();
      return json;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  if (!ADMIN_BASE) return { status: 'free', effective: false, grace_until: null };
  const url = `${ADMIN_BASE}/api/subscription/status?user_id=${encodeURIComponent(userId)}`;
  return fetchJson(url, undefined, 'stripe_status');
}

export async function startSubscriptionCheckout(userId: string, email?: string, trialDays = 7) {
  if (!ADMIN_BASE) return false;
  const url = `${ADMIN_BASE}/api/stripe/create-checkout`;
  const json = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(email ? { 'x-user-email': email } : {}) },
    body: JSON.stringify({ user_id: userId, mode: 'subscription', trial_days: trialDays }),
  }, 'stripe_checkout');
  if (json?.url) {
    await Linking.openURL(json.url);
    return true;
  }
  return false;
}

export async function openBillingPortal(customerId: string) {
  if (!ADMIN_BASE) return false;
  const url = `${ADMIN_BASE}/api/stripe/create-portal`;
  const json = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: customerId }),
  }, 'stripe_portal');
  if (json?.url) {
    await Linking.openURL(json.url);
    return true;
  }
  return false;
}
