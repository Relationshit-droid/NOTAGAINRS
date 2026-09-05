import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const GAPS = ["Hobbies: Pottery", "Childhood Friend: ?", "Dream Vacation: ?"];

export default function LoveMapGapQuest({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [question, setQuestion] = useState('');

  // Get game info from registry (LoveMapGapQuest is part of memory-lane-map)
  const gameInfo = getGameByScreen('LoveMapGapQuest');
  const GAME_ID = gameInfo?.id || 'memory-lane-map';
  const CATEGORY_ID = gameInfo?.categoryId || 'emotional-connection';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);

  async function submit() {
    if (!question.includes('?')) {
      speakMarcie("That's not a question. Try again.");
      return;
    }

    const score = 150;
    HapticFeedbackSystem.success();
    speakMarcie("Good question. Go ask them IRL.");

    await completeGame(score, [
      { question, gapsIdentified: GAPS.length, completed: true }
    ]);

    Alert.alert("Quest Logged", "You identified a gap.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading love map...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Initializing session...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const inputArea = (
    <View style={styles.container}>
      <GlassCard>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}

        <Typography variant="h2">Map Gaps Detected</Typography>
        <View style={styles.gapsList}>
            {GAPS.map((g, i) => (
                <Typography key={i} variant="body" style={[styles.gapItem, { color: g.includes('?') ? COLORS.error : COLORS.textPrimary }]}>
                  • {g}
                </Typography>
            ))}
        </View>
        <Typography variant="body">Craft a question to close a gap:</Typography>
        <TextInput
          style={styles.input}
          placeholder="e.g. Who was your best friend in 3rd grade?"
          placeholderTextColor={COLORS.textHint}
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="h2">Log Question</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Love Map Gap Quest',
    description: 'Fill in the blanks of your partner knowledge',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return (
    <ScreenLayout showHeader={false} scrollable={false}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1000,
  },
  gapsList: {
    gap: SPACING.small,
    marginVertical: SPACING.regular,
  },
  gapItem: {
    // color is dynamic based on g.includes('?')
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 60, 
    marginTop: SPACING.regular,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  btn: { 
    marginTop: SPACING.regular,
  },
});
