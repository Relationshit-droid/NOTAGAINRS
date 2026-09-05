import { AccessibilityInfo } from 'react-native';

let reduceMotion = false;

export async function loadA11y() {
  reduceMotion = await AccessibilityInfo.isReduceMotionEnabled();
}

export function isReduceMotion() { return reduceMotion; }
