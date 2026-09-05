import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { GlassCard, Text, SquishyButton } from '../ui';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import * as Haptics from 'expo-haptics';

type DailyChallengeCardProps = {
  title: string;
  onStart: () => void;
  durationSec?: number;
};

export default function DailyChallengeCard({ title, onStart, durationSec = 600 }: DailyChallengeCardProps) {
  const [remaining, setRemaining] = useState(durationSec);
  const pulse = useSharedValue(1);
  useEffect(() => { pulse.value = withRepeat(withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  useEffect(() => { const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000); return () => clearInterval(t); }, [durationSec]);
  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');
  return (
    <GlassCard>
      <Text variant="header">{title}</Text>
      <Text variant="keyword">{mm}:{ss}</Text>
      <Animated.View style={[style]}>
        <SquishyButton onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); onStart(); }} style={styles.btn}>
          <Text variant="header">Start</Text>
        </SquishyButton>
      </Animated.View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'flex-end',
    marginTop: SPACING.small,
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.large,
  },
});
