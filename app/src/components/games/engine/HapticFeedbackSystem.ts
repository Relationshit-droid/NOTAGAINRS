import * as Haptics from 'expo-haptics';

export function success() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function warning() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

export function error() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export function heavyImpact() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

export function lightImpact() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function selection() {
  Haptics.selectionAsync();
}

export async function pulse(times = 3, style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) {
  for (let i = 0; i < times; i++) {
    await Haptics.impactAsync(style);
    await new Promise((r) => setTimeout(r, 120));
  }
}

