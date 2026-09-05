import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from './store';
import { Platform } from 'react-native';
import { ENV } from '../lib/env';

export default function Provider({ children }: { children: React.ReactNode }) {
  const setSarcasm = useAppStore((s) => s.setSarcasm);
  const setPersonality = useAppStore((s) => s.setPersonality);
  const setPlan = useAppStore((s) => s.setPlan);
  const setBeta = useAppStore((s) => s.setBeta);
  const setPreviewMode = useAppStore((s) => s.setPreviewMode);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const p = await supabase.from('profiles').select('sarcasm_level, personality, couple_code, plan, beta_code, beta_active, preview_mode').eq('user_id', user?.id || '').single();
      if (p.data?.sarcasm_level) setSarcasm(p.data.sarcasm_level);
      if (p.data?.personality) setPersonality(p.data.personality);
      if (p.data?.plan) setPlan(p.data.plan as any);
      if (p.data?.beta_active) { setBeta(true); await AsyncStorage.setItem('beta_active', 'true'); }
      if (typeof p.data?.preview_mode === 'boolean') setPreviewMode(!!p.data?.preview_mode);
      const ADMIN_BASE = ENV.ADMIN_BASE_URL;
      const email = (user as any)?.email as string | undefined;
      if (ADMIN_BASE && email && (email.toLowerCase() === 'tab@example.com' || email.toLowerCase() === 'simon@example.com') && !p.data?.beta_active) {
        await fetch(`${ADMIN_BASE}/api/beta/validate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code: 'TABSIMONBETA' }) });
        setBeta(true);
        setPlan('beta' as any);
        await AsyncStorage.setItem('beta_active', 'true');
      }
      if (user && p.data?.couple_code) {
        Sentry.setUser({ id: user.id, email: (user as any).email });
        Sentry.setTag('couple_code', p.data.couple_code);
        Sentry.setTag('plan', (user as any).app_metadata?.plan || 'free');
      }
    });
  }, []);
  return children as any;
}
