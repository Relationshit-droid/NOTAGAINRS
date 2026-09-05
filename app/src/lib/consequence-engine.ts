import { useAppStore } from '../state/store';
import { coupleApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { useState, useCallback } from 'react';

// In-memory cache for penalties (sync with backend periodically)
let penaltyCache: Map<string, any[]> = new Map();
let lastSync: number = 0;
const SYNC_INTERVAL = 30000; // 30 seconds

interface Penalty {
  type: 'wallpaper_swap' | 'notification_spam' | 'hub_lockout' | 'public_shame' | 'romance_lockout';
  active: boolean;
  expiresAt: number;
  description: string;
}

const PENALTY_DEFS: Record<Penalty['type'], Omit<Penalty, 'active' | 'expiresAt'>> = {
  wallpaper_swap: { type: 'wallpaper_swap', description: 'Your wallpaper is now a photo of your partner looking disappointed.' },
  notification_spam: { type: 'notification_spam', description: 'Receiving hourly reminders to "Do Better".' },
  hub_lockout: { type: 'hub_lockout', description: 'Access to Romance Hub denied until tasks completed.' },
  public_shame: { type: 'public_shame', description: 'Your avatar wears a "Timeout" hat on the leaderboard.' },
  romance_lockout: { type: 'romance_lockout', description: 'Romance games locked until relationship repair completed.' }
};

async function syncPenaltiesFromBackend(coupleId: string, token: string): Promise<Penalty[]> {
  try {
    // Fetch from backend API
    const response = await coupleApi.get(coupleId, token);
    const penalties = response.penalties || [];
    const now = Date.now();
    const active = penalties.filter((p: Penalty) => p.expiresAt > now);
    
    if (active.length !== penalties.length) {
      // Update backend with cleaned penalties
      await coupleApi.updateMeters(coupleId, { 
        // penalties field would need backend support
      }, token);
    }
    
    penaltyCache.set(coupleId, active);
    lastSync = Date.now();
    return active;
  } catch (error) {
    console.error('Failed to sync penalties from backend:', error);
    return penaltyCache.get(coupleId) || [];
  }
}

export async function getActivePenalties(coupleId: string, token: string): Promise<Penalty[]> {
  const now = Date.now();
  
  // Check if cache is stale
  if (now - lastSync > SYNC_INTERVAL) {
    return syncPenaltiesFromBackend(coupleId, token);
  }
  
  const cached = penaltyCache.get(coupleId) || [];
  return cached.filter(p => p.expiresAt > now);
}

export async function triggerPenalty(
  coupleId: string, 
  token: string, 
  type: Penalty['type'], 
  durationHours: number
): Promise<Penalty[]> {
  const active = await getActivePenalties(coupleId, token);
  const existing = active.find(p => p.type === type);
  const expiresAt = Date.now() + durationHours * 3600000;
  
  if (existing) {
    existing.expiresAt = expiresAt;
  } else {
    active.push({ ...PENALTY_DEFS[type], active: true, expiresAt } as Penalty);
  }
  
  penaltyCache.set(coupleId, active);
  
  // Persist to backend
  try {
    await coupleApi.updateMeters(coupleId, { 
      // penalties would need backend field
    }, token);
  } catch (error) {
    console.error('Failed to persist penalty to backend:', error);
  }
  
  return active;
}

export async function clearPenalty(coupleId: string, token: string, type: Penalty['type']): Promise<Penalty[]> {
  const active = await getActivePenalties(coupleId, token);
  const filtered = active.filter(p => p.type !== type);
  penaltyCache.set(coupleId, filtered);
  
  try {
    await coupleApi.updateMeters(coupleId, {}, token);
  } catch (error) {
    console.error('Failed to clear penalty on backend:', error);
  }
  
  return filtered;
}

export async function isRomanceLocked(coupleId: string, token: string): Promise<boolean> {
  const penalties = await getActivePenalties(coupleId, token);
  return penalties.some(p => p.type === 'romance_lockout' || p.type === 'hub_lockout');
}

export async function enforceSkipPenalty(coupleId: string, token: string, hours = 1): Promise<void> {
  await triggerPenalty(coupleId, token, 'romance_lockout', hours);
}

// React hook for using consequence engine in components
export function useConsequenceEngine() {
  const { user } = useAuth();
  const userId = useAppStore(state => state.user_id);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPenalties = useCallback(async () => {
    if (!user || !userId) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple && couple.id) {
        const active = await getActivePenalties(couple.id, token);
        setPenalties(active);
      }
    } catch (error) {
      console.error('Failed to load penalties:', error);
    } finally {
      setLoading(false);
    }
  }, [user, userId]);

  const addPenalty = useCallback(async (type: Penalty['type'], durationHours: number) => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple && couple.id) {
        const updated = await triggerPenalty(couple.id, token, type, durationHours);
        setPenalties(updated);
      }
    } catch (error) {
      console.error('Failed to add penalty:', error);
    }
  }, [user, userId]);

  const removePenalty = useCallback(async (type: Penalty['type']) => {
    if (!user || !userId) return;
    try {
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple && couple.id) {
        const updated = await clearPenalty(couple.id, token, type);
        setPenalties(updated);
      }
    } catch (error) {
      console.error('Failed to remove penalty:', error);
    }
  }, [user, userId]);

  const checkRomanceLocked = useCallback(async (): Promise<boolean> => {
    if (!user || !userId) return false;
    try {
      const token = await user.getIdToken();
      const couple = await coupleApi.getCoupleForUser(userId, token);
      if (couple && couple.id) {
        return await isRomanceLocked(couple.id, token);
      }
    } catch (error) {
      console.error('Failed to check romance lock:', error);
    }
    return false;
  }, [user, userId]);

  return {
    penalties,
    loading,
    loadPenalties,
    addPenalty,
    removePenalty,
    checkRomanceLocked,
  };
}

// Legacy functions for backward compatibility (using AsyncStorage fallback)
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ConsequenceState = {
  lastActive: number;
  romanceLockedUntil?: number;
};

export async function markActivity() {
  const state: ConsequenceState = { lastActive: Date.now() };
  await AsyncStorage.setItem('consequence_state', JSON.stringify(state));
}

export async function checkInactivityAndTrigger() {
  const beta = await AsyncStorage.getItem('beta_active');
  if (beta === 'true') return;
  const raw = await AsyncStorage.getItem('consequence_state');
  const now = Date.now();
  const st: ConsequenceState = raw ? JSON.parse(raw) : { lastActive: now };
  if (now - st.lastActive > 24 * 3600 * 1000) {
    await Notifications.requestPermissionsAsync();
    for (let i = 0; i < 5; i++) {
      await Notifications.scheduleNotificationAsync({ 
        content: { title: 'Dr. Marcie', body: 'We need to talk.' }, 
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 60 * (i + 1) } as any 
      });
    }
    const until = now + 4 * 3600 * 1000;
    await AsyncStorage.setItem('consequence_state', JSON.stringify({ lastActive: st.lastActive, romanceLockedUntil: until }));
  }
}

export async function isRomanceLockedLegacy() {
  const beta = await AsyncStorage.getItem('beta_active');
  if (beta === 'true') return false;
  const raw = await AsyncStorage.getItem('consequence_state');
  const st: ConsequenceState = raw ? JSON.parse(raw) : { lastActive: Date.now() };
  return !!st.romanceLockedUntil && Date.now() < st.romanceLockedUntil;
}

export async function enforceSkipPenaltyLegacy(hours = 1) {
  const beta = await AsyncStorage.getItem('beta_active');
  if (beta === 'true') return;
  const raw = await AsyncStorage.getItem('consequence_state');
  const st: ConsequenceState = raw ? JSON.parse(raw) : { lastActive: Date.now() };
  const until = Date.now() + hours * 3600 * 1000;
  await AsyncStorage.setItem('consequence_state', JSON.stringify({ ...st, romanceLockedUntil: until }));
  await Notifications.requestPermissionsAsync();
  await Notifications.scheduleNotificationAsync({ content: { title: 'Dr. Marcie', body: 'Skipping sets a short cooldown.' }, trigger: { seconds: 5 } as any });
}
