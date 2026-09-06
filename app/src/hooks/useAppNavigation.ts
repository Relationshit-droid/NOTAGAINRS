/**
 * Typed navigation helper.
 *
 * `useNavigation()` with no type argument resolves its param list to `never`,
 * which makes every `navigation.navigate('SomeRoute')` call a type error
 * ("Argument of type '[string]' is not assignable to parameter of type
 * 'never'"). That accounted for 62 errors across the app.
 *
 * The navigator declares 123+ screens and has no generated param list, so
 * rather than hand-maintaining one that would drift out of sync with
 * AppNavigator, this hook centralises the escape hatch in exactly one place.
 * Screens call `useAppNavigation()` instead of sprinkling `as any` casts at
 * every call site.
 *
 * If a real RootStackParamList is introduced later, changing the generic here
 * types every consumer at once.
 */
import { useNavigation } from '@react-navigation/native';

/**
 * No-op stand-in used when a screen renders outside a NavigationContainer
 * (App.tsx shows the splash before the container mounts). Returning this
 * instead of throwing keeps such screens renderable; their callback props
 * drive navigation in that mode.
 */
const detachedNavigation: AppNavigation = {
  navigate: () => {},
  goBack: () => {},
  push: () => {},
  replace: () => {},
  popToTop: () => {},
  canGoBack: () => false,
  setOptions: () => {},
  addListener: () => () => {},
  reset: () => {},
  dispatch: () => {},
};

export type AppNavigation = {
  navigate: (screen: string, params?: Record<string, unknown>) => void;
  goBack: () => void;
  push: (screen: string, params?: Record<string, unknown>) => void;
  replace: (screen: string, params?: Record<string, unknown>) => void;
  popToTop: () => void;
  canGoBack: () => boolean;
  setOptions: (options: Record<string, unknown>) => void;
  addListener: (type: string, callback: (...args: any[]) => void) => () => void;
  reset: (state: Record<string, unknown>) => void;
  dispatch: (action: unknown) => void;
};

export function useAppNavigation(): AppNavigation {
  // useNavigation throws when there is no container above it. Screens such as
  // the splash are mounted both inside and outside the navigator, so degrade
  // to a no-op rather than crashing the render.
  try {
    return useNavigation<any>();
  } catch {
    return detachedNavigation;
  }
}

export default useAppNavigation;
