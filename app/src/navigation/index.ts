// Navigation Components - RELATIONSHIT! Design System v2.0
export { default as AppNavigator } from './AppNavigator';
// NOTE: there is no separate AdminNavigator module. The admin surface is served
// by the `AdminPortal` route registered inside AppNavigator (see
// src/navigation/AppNavigator.tsx). This file previously re-exported
// `./AdminNavigator`, which does not exist, so importing `src/navigation`
// failed to resolve and broke the bundle.
export { default as BottomTabNavigator } from './BottomTabNavigator';
