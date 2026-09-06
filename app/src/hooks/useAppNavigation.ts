/**
 * Typed, container-safe navigation helper.
 *
 * Two problems this hook solves, in one place:
 *
 * 1. TYPES. `useNavigation()` with no type argument resolves its param list to
 *    `never`, making every `navigation.navigate('SomeRoute')` a type error.
 *    The navigator declares 130+ screens with no generated param list, so this
 *    hook centralises the escape hatch instead of sprinkling `as any` casts.
 *
 * 2. SAFETY. Screens in this app render in three different contexts:
 *      a. inside a Screen of a stack   -> full stack navigation prop
 *      b. inside a NavigationContainer but not a Screen -> only the ROOT REF,
 *         which has navigate/goBack/reset/dispatch but NO push/replace/
 *         popToTop/setOptions (those are stack-navigator additions)
 *      c. outside any container (App.tsx renders the splash before the
 *         container mounts) -> nothing at all
 *
 *    Upstream `useNavigation` throws in (c) and silently returns a partial
 *    object in (b). A bare try/catch only covers (c); calling
 *    `navigation.replace(...)` in case (b) still dies with
 *    "navigation.replace is not a function". This hook normalises all three
 *    into one always-complete object.
 *
 * Stack-only methods are synthesised from `dispatch(StackActions.*)` when the
 * underlying object lacks them, so `replace`/`push`/`popToTop` do the right
 * thing whenever a stack is actually mounted, and degrade to a logged no-op
 * when one is not — never a crash.
 */
import * as React from 'react';
import {
  NavigationContainerRefContext,
  NavigationContext,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

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

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

/** Warn once per unique message so a render loop cannot flood the console. */
const warned = new Set<string>();
function warnOnce(message: string) {
  if (!isDev || warned.has(message)) return;
  warned.add(message);
  console.warn(`[useAppNavigation] ${message}`);
}

/**
 * Wraps whatever navigation-ish object is available (a real stack navigation
 * prop, the root container ref, or nothing) into the full AppNavigation shape.
 */
function buildNavigation(source: any | undefined): AppNavigation {
  const has = (name: string) => typeof source?.[name] === 'function';

  const dispatch = (action: unknown) => {
    if (has('dispatch')) {
      source.dispatch(action);
      return;
    }
    warnOnce('dispatch() called with no navigator mounted; ignoring.');
  };

  // Each method below prefers the native implementation when the underlying
  // object has it (a real stack navigation prop), and otherwise falls back to
  // dispatching the equivalent action for the nearest stack router to handle.
  return {
    navigate: (screen, params) => {
      if (has('navigate')) {
        source.navigate(screen, params);
        return;
      }
      if (has('dispatch')) {
        source.dispatch(CommonActions.navigate({ name: screen, params }));
        return;
      }
      warnOnce(`navigate('${screen}') ignored: no navigator mounted.`);
    },

    goBack: () => {
      if (has('goBack')) {
        source.goBack();
        return;
      }
      warnOnce('goBack() ignored: no navigator mounted.');
    },

    push: (screen, params) => {
      if (has('push')) {
        source.push(screen, params);
        return;
      }
      if (has('dispatch')) {
        // Root ref / non-stack parent: let the nearest stack router handle it.
        source.dispatch(StackActions.push(screen, params));
        return;
      }
      warnOnce(`push('${screen}') ignored: no navigator mounted.`);
    },

    replace: (screen, params) => {
      if (has('replace')) {
        source.replace(screen, params);
        return;
      }
      if (has('dispatch')) {
        source.dispatch(StackActions.replace(screen, params));
        return;
      }
      warnOnce(`replace('${screen}') ignored: no navigator mounted.`);
    },

    popToTop: () => {
      if (has('popToTop')) {
        source.popToTop();
        return;
      }
      if (has('dispatch')) {
        source.dispatch(StackActions.popToTop());
        return;
      }
      warnOnce('popToTop() ignored: no navigator mounted.');
    },

    canGoBack: () => (has('canGoBack') ? !!source.canGoBack() : false),

    setOptions: (options) => {
      // Only a screen's own navigation prop can set its options. The root ref
      // has no equivalent, so this is a legitimate no-op there.
      if (has('setOptions')) {
        source.setOptions(options);
        return;
      }
      warnOnce('setOptions() ignored: not inside a screen.');
    },

    addListener: (type, callback) => {
      if (has('addListener')) {
        const unsubscribe = source.addListener(type, callback);
        // Stack navigation props return an unsubscribe fn; be defensive in
        // case a partial implementation returns undefined.
        return typeof unsubscribe === 'function' ? unsubscribe : () => {};
      }
      warnOnce(`addListener('${type}') ignored: no navigator mounted.`);
      return () => {};
    },

    reset: (state) => {
      if (has('reset')) {
        source.reset(state);
        return;
      }
      if (has('dispatch')) {
        source.dispatch(CommonActions.reset(state as any));
        return;
      }
      warnOnce('reset() ignored: no navigator mounted.');
    },

    dispatch,
  };
}

/**
 * Always returns a complete, safe navigation object.
 *
 * Note: this reads the same two contexts upstream `useNavigation` reads, so
 * the hook call order is fixed and unconditional — no try/catch around a hook,
 * and no risk of violating the rules of hooks.
 */
export function useAppNavigation(): AppNavigation {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationContext);

  const source = navigation ?? root;
  const detached = source == null;

  if (detached) {
    warnOnce(
      'Rendered outside a NavigationContainer; navigation calls are no-ops. ' +
        'Use the screen callback props to navigate in this mode.',
    );
  }

  // Memoise so the returned object is referentially stable across renders and
  // safe to list in useEffect / useCallback dependency arrays.
  return React.useMemo(() => buildNavigation(source), [source]);
}

export default useAppNavigation;
