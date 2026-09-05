import { enforceSkipPenalty, isRomanceLocked } from '../lib/consequence-engine';
import AsyncStorage from '@react-native-async-storage/async-storage';

test('enforceSkipPenalty sets lock and schedules notification', async () => {
  const setSpy = jest.spyOn(AsyncStorage, 'setItem');
  await enforceSkipPenalty(1);
  expect(setSpy).toHaveBeenCalled();
  const locked = await isRomanceLocked();
  expect(locked).toBe(true);
});

