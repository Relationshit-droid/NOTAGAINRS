import { renderHook, waitFor } from '@testing-library/react-native';
import { useBetaAccess } from '../useBetaAccess';
import { isBetaActive } from '../../../../lib/gating';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock dependencies
jest.mock('../../../../lib/gating', () => ({
  isBetaActive: jest.fn(),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
}));

describe('useBetaAccess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial false state', async () => {
    (isBetaActive as jest.Mock).mockResolvedValue(false);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useBetaAccess());

    expect(result.current.isBeta).toBe(false);
    expect(result.current.features.unlockedGames).toBe(false);

    await waitFor(() => {
      expect(isBetaActive).toHaveBeenCalled();
    });

    expect(result.current.isBeta).toBe(false);
  });

  it('should return true when beta is active', async () => {
    (isBetaActive as jest.Mock).mockResolvedValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('SOME_CODE');

    const { result } = renderHook(() => useBetaAccess());
    await waitFor(() => {
      expect(result.current.isBeta).toBe(true);
    });

    expect(result.current.features.unlockedGames).toBe(true);
  });

  it('should unlock admin panel with correct code', async () => {
    (isBetaActive as jest.Mock).mockResolvedValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('LOVEBETA2025');

    const { result } = renderHook(() => useBetaAccess());
    await waitFor(() => {
      expect(result.current.features.adminPanelAccess).toBe(true);
    });
  });

  it('should NOT unlock admin panel with wrong code', async () => {
    (isBetaActive as jest.Mock).mockResolvedValue(true);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('REGULAR_CODE');

    const { result } = renderHook(() => useBetaAccess());
    await waitFor(() => {
      expect(result.current.isBeta).toBe(true);
    });

    expect(result.current.features.adminPanelAccess).toBe(false);
  });
});
