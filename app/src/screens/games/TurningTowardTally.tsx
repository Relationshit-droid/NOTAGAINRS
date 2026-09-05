import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

export default function TurningTowardTally({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [streak, setStreak] = useState(0);

  function logResponse() {
    setStreak(s => s + 1);
    speakMarcie(streak < 3 ? "Good start." : "Look at you, emotional availability champion.");
    HapticFeedbackSystem.success();
  }

  function finish() {
    Alert.alert("Tally Saved", `You turned toward ${streak} bids today.`, [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        <Typography variant="h2" center>Turning Toward Tally</Typography>
        <Typography variant="body" center>Did you respond to a bid (text/call/look) in {'<'}5 min?</Typography>
        <Typography variant="h1" center style={styles.count}>{streak}</Typography>
        <SquishyButton onPress={logResponse} style={styles.btn}>
            <Typography variant="button">Yes, I Turned Toward</Typography>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.done}>
            <Typography variant="button">Finish Logging</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Turning Toward Tally',
    description: 'Track your responsiveness',
    category: 'emotional' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  count: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 2, 
    textAlign: 'center', 
    marginVertical: SPACING.large,
    color: COLORS.success,
  },
  btn: { 
    backgroundColor: COLORS.success, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.button, 
    alignItems: 'center' 
  },
  done: { 
    marginTop: SPACING.regular, 
    backgroundColor: COLORS.healingHospital, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.button, 
    alignItems: 'center' 
  },
});
