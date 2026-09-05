import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useAppStore } from '../state/store';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) navigationRef.dispatch(CommonActions.navigate({ name, params }));
}

export type NavigationState = {
  currentScreen: string;
  previousScreen: string;
  onboardingStep: number;
  gameInProgress: boolean;
  sosSessionId?: string;
};

type NavigationOptions = { force?: boolean; transition?: 'fade' | 'slide' | 'none'; params?: any };

export function getCurrentState(): NavigationState {
  const s = useAppStore.getState();
  return {
    currentScreen: s.navCurrentScreen,
    previousScreen: s.navPreviousScreen,
    onboardingStep: s.onboardingStep,
    gameInProgress: s.gameInProgress,
    sosSessionId: s.sosSessionId,
  };
}

export function navigateTo(screenId: string, options?: NavigationOptions) {
  const current = getCurrentState();
  if (screenId === 'SOSBooths' && !options?.force && current.gameInProgress) {
    Alert.alert('Pause Game?', 'You have a game in progress. Open SOS now?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open SOS', style: 'destructive', onPress: () => navigateTo(screenId, { ...options, force: true }) },
    ]);
    return;
  }
  useAppStore.getState().setCurrentScreen(screenId);
  applyScreenTransition(screenId, options?.transition || 'fade');
  navigate(screenId, options?.params);
}

export function applyScreenTransition(_screenId: string, _transition: 'fade' | 'slide' | 'none') {
  // Transitions are handled by stack screen options; this records intent for testing/analytics
}

export function goBackSafe() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
}
