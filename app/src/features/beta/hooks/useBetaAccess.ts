import { useEffect, useState } from 'react';
import { isBetaActive } from '../../../lib/gating';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BetaFeatures = {
  unlockedGames: boolean;
  unlimitedSOS: boolean;
  customMarciePersonality: boolean;
  healingHospitalAccess: boolean;
  adminPanelAccess: boolean;
};

export function useBetaAccess() {
  const [isBeta, setIsBeta] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    check();
  }, []);

  async function check() {
    const active = await isBetaActive();
    const storedCode = await AsyncStorage.getItem('beta_code');
    setIsBeta(active);
    setCode(storedCode || '');
  }

  const isAdminCode = code === 'LOVEBETA2025' || code === 'TABSIMONBETA';

  const features: BetaFeatures = {
    unlockedGames: isBeta,
    unlimitedSOS: isBeta,
    customMarciePersonality: isBeta,
    healingHospitalAccess: isBeta,
    adminPanelAccess: isBeta && isAdminCode,
  };

  return { isBeta, features, code };
}
