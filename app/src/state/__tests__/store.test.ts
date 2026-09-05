import { act } from '@testing-library/react-native';
import { useAppStore } from '../store';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store
    useAppStore.setState({
      points: 0,
      trustLevel: 0.65,
      isBeta: false,
      previewRole: null,
    });
  });

  it('should add points', () => {
    const { addPoints } = useAppStore.getState();
    act(() => {
      addPoints(100);
    });
    expect(useAppStore.getState().points).toBe(100);
  });

  it('should clamp trust level', () => {
    const { setTrust } = useAppStore.getState();
    act(() => {
      setTrust(1.5);
    });
    expect(useAppStore.getState().trustLevel).toBe(1);
    
    act(() => {
      setTrust(-0.5);
    });
    expect(useAppStore.getState().trustLevel).toBe(0);
  });

  it('should set beta and plan correctly', () => {
    const { setBeta } = useAppStore.getState();
    act(() => {
      setBeta(true);
    });
    expect(useAppStore.getState().isBeta).toBe(true);
    expect(useAppStore.getState().plan).toBe('beta');
  });

  it('should set preview role', () => {
    const { setPreviewRole } = useAppStore.getState();
    act(() => {
      setPreviewRole('blocked');
    });
    expect(useAppStore.getState().previewRole).toBe('blocked');
  });
});
