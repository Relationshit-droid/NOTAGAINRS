import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Text, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const ROUNDS = [
  { context: "They are stonewalling you.", options: ["Yell louder", "Take a 20m break", "Ignore them back"], correct: 1 },
  { context: "They just criticized your cooking.", options: ["Criticize their cleaning", "Explain your feelings", "Defend yourself"], correct: 1 },
];

export default function RepairRelay({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [index, setIndex] = useState(0);

  function choose(idx: number) {
    if (idx === ROUNDS[index].correct) {
      speakMarcie("Good repair. Baton passed.");
      HapticFeedbackSystem.success();
    } else {
      speakMarcie("That's an escalation, not a repair. Try again.");
      HapticFeedbackSystem.error();
      return;
    }

    if (index < ROUNDS.length - 1) {
      setIndex(i => i + 1);
    } else {
      finish();
    }
  }

  function finish() {
    Alert.alert("Relay Won", "Conflict de-escalated.", [{ text: "Victory", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        <Typography variant="h2">Lap {index + 1}</Typography>
        <Typography variant="body" style={styles.context}>{ROUNDS[index].context}</Typography>
        <View style={styles.optionsContainer}>
          {ROUNDS[index].options.map((opt, i) => (
            <SquishyButton 
              key={i} 
              onPress={() => choose(i)} 
              variant="secondary"
              size="medium"
              style={styles.btn}
            >
              <Typography variant="body">{opt}</Typography>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Repair Relay',
    description: 'Race to fix the conflict',
    category: 'conflict' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  context: { 
    textAlign: 'center', 
    marginVertical: SPACING.xlarge,
  },
  optionsContainer: {
    gap: SPACING.regular,
  },
  btn: { 
    backgroundColor: COLORS.backgroundInput,
  },
});
