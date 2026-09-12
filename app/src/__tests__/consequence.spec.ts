import {
  enforceSkipPenaltyLegacy,
  isRomanceLockedLegacy,
} from '../lib/consequence-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * The AsyncStorage-backed penalty helpers were renamed to *Legacy when the
 * API-backed versions landed; the current enforceSkipPenalty/isRomanceLocked
 * take (coupleId, token) and go through the data layer. This suite covers the
 * local-storage variants, which is what it was actually written against.
 */
describe('consequence engine (local storage variants)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('enforceSkipPenaltyLegacy persists a romance lockout', async () => {
    const setSpy = jest.spyOn(AsyncStorage, 'setItem');

    await enforceSkipPenaltyLegacy(1);

    expect(setSpy).toHaveBeenCalled();
    await expect(isRomanceLockedLegacy()).resolves.toBe(true);
  });

  it('reports unlocked when no penalty has been recorded', async () => {
    await expect(isRomanceLockedLegacy()).resolves.toBe(false);
  });

  it('skips the penalty entirely for beta users', async () => {
    await AsyncStorage.setItem('beta_active', 'true');

    await enforceSkipPenaltyLegacy(1);

    await expect(isRomanceLockedLegacy()).resolves.toBe(false);
  });

  it('lets the lockout expire once its window has passed', async () => {
    await AsyncStorage.setItem(
      'consequence_state',
      JSON.stringify({ lastActive: Date.now(), romanceLockedUntil: Date.now() - 1000 })
    );

    await expect(isRomanceLockedLegacy()).resolves.toBe(false);
  });
});
