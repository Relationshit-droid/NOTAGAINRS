import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { Typography, GlassCard, SquishyButton, ScreenLayout } from '../../components/ui';
import { subscribeFight, supabase } from '../../lib/supabase';
import * as Notifications from 'expo-notifications';
import { useAppStore } from '../../state/store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

type CoolDownRoomProps = {
  route: any;
  navigation: any;
};

export default function CoolDownRoom({ route, navigation }: CoolDownRoomProps) {
  const { fightId } = route.params || {};
  const breath = useSharedValue(0);
  const [remaining, setRemaining] = useState(72);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    breath.value = withRepeat(withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    Notifications.requestPermissionsAsync();

    timerRef.current = setInterval(() => setRemaining((r) => r > 0 ? r - 1 : 0), 1000);

    let sub: any;
    if (fightId) {
      subscribeFight(fightId, (payload) => {
        const after = payload.new;
        if (after?.partner_b_input) {
          Notifications.scheduleNotificationAsync({ 
            content: { title: 'Partner joined SOS', body: 'Ready for verdict.' }, 
            trigger: null 
          });
          navigation.replace('FightVerdict', { fightId });
        }
      }).then((s: any) => sub = s);
      useAppStore.getState().setSOSSessionId(fightId);
    }

    return () => { 
      clearInterval(timerRef.current); 
      if (sub) supabase.removeChannel(sub); 
    };
  }, [fightId]);

  useEffect(() => {
    if (remaining <= 0 && fightId) navigation.replace('FightVerdict', { fightId, timeout: true });
  }, [remaining]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breath.value * 0.5 }],
    opacity: 0.5 + breath.value * 0.5
  }));

  const mm = Math.floor(remaining / 60).toString().padStart(2, '0');
  const ss = Math.floor(remaining % 60).toString().padStart(2, '0');

  return (
    <ScreenLayout 
      showMarcie={true} 
      marcieQuote="Breathe with the circle. In... and out..."
      scrollable={false}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>Cool Down Room</Typography>
          <Typography variant="body" style={styles.sub}>Wait for partner & breathe</Typography>

          <View style={styles.orbContainer}>
            <Animated.View style={[styles.orb, circleStyle]} />
            <View style={styles.orbCore} />
          </View>

          <Typography variant="h2" style={styles.timer}>{mm}:{ss}</Typography>

          <GlassCard style={styles.tipCard}>
            <Ionicons name="leaf" size={32} color={COLORS.success} style={styles.tipIcon} />
            <Typography variant="body" style={styles.tipText}>
              When heartbeat {'>'} 100bpm, you physically can't listen. Breathe until the circle is slow.
            </Typography>
          </GlassCard>

          <SquishyButton 
            onPress={() => navigation.replace('FightVerdict', { fightId })}
            variant="ghost"
            size="medium"
          >
            Skip (I'm Calm)
          </SquishyButton>
        </View>
      </SafeAreaView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: { 
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: SPACING.xlarge,
  },
  title: { 
    color: COLORS.success, 
    marginBottom: SPACING.small,
    textAlign: 'center',
  },
  sub: { 
    opacity: 0.5, 
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  orbContainer: { 
    width: 200, 
    height: 200, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  orb: { 
    position: 'absolute', 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    backgroundColor: COLORS.success, 
    opacity: 0.3,
  },
  orbCore: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: COLORS.success, 
    opacity: 0.8,
    ...SHADOWS.neonSoft,
    shadowColor: COLORS.success,
  },
  timer: {
    marginBottom: SPACING.xxl,
  },
  tipCard: { 
    marginTop: SPACING.xl, 
    alignItems: 'center', 
    backgroundColor: `${COLORS.success}10`, 
    borderColor: COLORS.success,
    marginBottom: SPACING.xl,
    padding: SPACING.xlarge,
  },
  tipIcon: {
    marginBottom: SPACING.large,
  },
  tipText: {
    textAlign: 'center',
  },
});
