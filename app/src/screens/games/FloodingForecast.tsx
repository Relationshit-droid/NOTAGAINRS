import { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function FloodingForecast({ route, navigation }: any) {
  const { gameId } = route.params;
  const [bpm, setBpm] = useState(80);

  useEffect(() => {
    // Simulate heart rate rising
    const t = setInterval(() => {
      setBpm(b => Math.min(120, b + Math.floor(Math.random() * 5)));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  function calmDown() {
    HapticFeedbackSystem.pulse(2);
    setBpm(b => Math.max(60, b - 10));
    speakMarcie("Breathe... in... out...");
  }

  function finish() {
    Alert.alert("Forecast", bpm > 100 ? "Risk of Flooding! Take a break." : "Clear skies. Carry on.", [{ text: "OK", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputContainer}>
      <GlassCard>
        <Typography variant="h2">Heart Rate Monitor</Typography>
        <Typography variant="keyword" style={styles.bpm}>{bpm} BPM</Typography>
        <View style={styles.barWrap}>
          <View style={[styles.bar, { width: `${(bpm / 120) * 100}%`, backgroundColor: bpm > 100 ? COLORS.error : COLORS.success }]} />
        </View>
        <Typography variant="body" style={styles.statusText}>
          {bpm > 100 ? "FLOODING IMMINENT" : "Safe Zone"}
        </Typography>
        <SquishyButton onPress={calmDown} style={styles.btn}>
          <Typography variant="body">Box Breathe</Typography>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.checkBtn}>
          <Typography variant="body">Check Forecast</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Flooding Forecast',
    description: 'Monitor physiology during conflict',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 350,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { 
    gap: SPACING.regular 
  },
  bpm: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge, 
    textAlign: 'center', 
    marginVertical: SPACING.regular, 
    color: COLORS.textPrimary 
  },
  barWrap: { 
    height: 20, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.round, 
    overflow: 'hidden' 
  },
  bar: { height: '100%' },
  statusText: { 
    textAlign: 'center', 
    marginTop: SPACING.small 
  },
  btn: { marginTop: SPACING.regular },
  checkBtn: { marginTop: SPACING.regular },
});
