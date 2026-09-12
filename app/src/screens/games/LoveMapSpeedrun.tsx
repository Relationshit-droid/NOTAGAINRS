import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

const QUESTIONS = [
  { q: "What is their go-to comfort snack this month?", a: ["Chips", "Ice Cream", "Chocolate", "Pizza"], correct: 1 },
  { q: "Name one person they vented to last week.", a: ["Mom", "Best Friend", "Coworker", "You"], correct: 3 },
  { q: "What is their current favorite song?", a: ["Pop", "Rock", "Jazz", "Silence"], correct: 0 },
];

export default function LoveMapSpeedrun({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  function answer(idx: number) {
    if (idx === QUESTIONS[index].correct) {
      setScore(s => s + 100);
      HapticFeedbackSystem.success();
      speakMarcie("Correct. You're paying attention.");
    } else {
      HapticFeedbackSystem.error();
      speakMarcie("Wrong. They changed that ages ago. Keep up.");
    }

    if (index < QUESTIONS.length - 1) {
      setIndex(i => i + 1);
    } else {
      finish();
    }
  }

  function finish() {
    Alert.alert("Speedrun Complete", `Score: ${score}`, [{ text: "OK", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputWrapper}>
      <GlassCard>
        <Typography variant="h2">Question {index + 1}</Typography>
        <Typography variant="body">{QUESTIONS[index].q}</Typography>
        <View style={styles.grid}>
          {QUESTIONS[index].a.map((ans, i) => (
            <SquishyButton key={i} onPress={() => answer(i)} style={styles.option} variant="secondary">
              <Typography variant="body">{ans}</Typography>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Love Map Speedrun',
    description: 'How well do you know their current world?',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    gap: SPACING.regular,
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: SPACING.small, 
    marginTop: SPACING.regular,
  },
  option: { 
    width: '48%',
  },
});
