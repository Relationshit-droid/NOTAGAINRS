import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { Alert } from 'react-native';

export const navigationRef = createNavigationContainerRef<any>();

// Expose the ref on web so the preview/smoke tests can drive real navigation.
if (typeof globalThis !== 'undefined') {
  (globalThis as any).__navigationRef = navigationRef;
}

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

/**
 * The slice of app-store state (src/state/store.ts) that this module maps from.
 * The store names these fields `navCurrentScreen` / `navPreviousScreen`, so this
 * input shape is deliberately distinct from the `NavigationState` output shape
 * above. Typing the parameters as `NavigationState` previously made these
 * lookups look like typos when they were in fact correct.
 */
export type NavigationStoreState = {
  navCurrentScreen: string;
  navPreviousScreen: string;
  onboardingStep: number;
  gameInProgress: boolean;
  sosSessionId?: string;
};

type NavigationOptions = { force?: boolean; transition?: 'fade' | 'slide' | 'none'; params?: any };

// Accept store state as parameter to avoid circular import
export function getCurrentState(storeState: NavigationStoreState): NavigationState {
  return {
    currentScreen: storeState.navCurrentScreen,
    previousScreen: storeState.navPreviousScreen,
    onboardingStep: storeState.onboardingStep,
    gameInProgress: storeState.gameInProgress,
    sosSessionId: storeState.sosSessionId,
  };
}

// Accept store state and setters as parameters
export function navigateTo(
  screenId: string, 
  options: NavigationOptions,
  storeState: NavigationStoreState,
  setCurrentScreen: (id: string) => void
) {
  const current = getCurrentState(storeState);
  if (screenId === 'SOSBooths' && !options?.force && current.gameInProgress) {
    Alert.alert('Pause Game?', 'You have a game in progress. Open SOS now?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open SOS', style: 'destructive', onPress: () => navigateTo(screenId, { ...options, force: true }, storeState, setCurrentScreen) },
    ]);
    return;
  }
  setCurrentScreen(screenId);
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