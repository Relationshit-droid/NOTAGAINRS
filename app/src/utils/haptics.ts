/**
 * Safe haptics wrapper.
 *
 * The spec requires every action to get a visual, audio AND haptic response
 * within 100ms — but `expo-haptics` throws `UnavailabilityError` on web (and on
 * any device without a haptic engine). An unguarded `Haptics.impactAsync()` in
 * an onPress handler takes the whole app down.
 *
 * This module keeps the exact expo-haptics API surface the screens already use,
 * executes real haptics on native, and degrades to a no-op everywhere else.
 */

import { Platform } from 'react-native';
import * as ExpoHaptics from 'expo-haptics';

export const ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle;
export const NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType;

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

const safe = async (fn: () => Promise<void>): Promise<void> => {
  if (!supported) return;
  try {
    await fn();
  } catch {
    // A missing/disabled haptic engine must never break an interaction.
  }
};

export const impactAsync = (
  style: ExpoHaptics.ImpactFeedbackStyle = ExpoHaptics.ImpactFeedbackStyle.Medium,
) => safe(() => ExpoHaptics.impactAsync(style));

export const notificationAsync = (
  type: ExpoHaptics.NotificationFeedbackType = ExpoHaptics.NotificationFeedbackType.Success,
) => safe(() => ExpoHaptics.notificationAsync(type));

export const selectionAsync = () => safe(() => ExpoHaptics.selectionAsync());

export default { impactAsync, notificationAsync, selectionAsync, ImpactFeedbackStyle, NotificationFeedbackType };
