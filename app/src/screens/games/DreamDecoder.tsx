import { useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const DREAMS = [
  { conflict: "Dishes left in sink", dream: "Need for Order/Safety" },
  { conflict: "Working late", dream: "Financial Security" },
  { conflict: "Not texting back", dream: "Connection/Reassurance" },
];

export default function DreamDecoder({ route, navigation }: any) {
  const { gameId } = route.params;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Get game info from registry
  const gameInfo = getGameByScreen('DreamDecoder');
  const GAME_ID = gameInfo?.id || 'dream-decoder';
  const CATEGORY_ID = gameInfo?.categoryId || 'emotional-connection';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);

  async function guess(dream: string) {
    const currentDream = DREAMS[index];
    if (dream === currentDream.dream) {
      HapticFeedbackSystem.success();
      speakMarcie("Exactly. It's never just about the dishes.");
      
      const newScore = score + 100;
      setScore(newScore);
      const newResponses = { ...responses, [index]: { dream: currentDream.dream, correct: true } };
      setResponses(newResponses);
      
      // Update in backend
      await updateScore(newScore, [{
        questionId: String(index),
        response: dream,
        correct: true,
        points: 100
      }]);
    } else {
      HapticFeedbackSystem.warning();
      speakMarcie("Not quite. Dig deeper.");
      return;
    }

    if (index < DREAMS.length - 1) {
      setIndex(i => i + 1);
    } else {
      // Game completed
      await finishGame();
    }
  }

  const finishGame = async () => {
    const finalScore = score + 100; // Add last correct answer
    const achievements: string[] = [];
    if (finalScore >= 300) achievements.push('Dream Interpreter');
    
    await completeGame(finalScore, Object.entries(responses).map(([id, resp]: [string, any]) => ({
      questionId: id,
      response: resp.dream
    })), achievements);
    
    Alert.alert(
      "Dreams Decoded", 
      "You see the hidden meaning.", 
      [{ 
        text: "Done", 
        onPress: () => navigation.navigate('GameResults', {
          score: finalScore,
          gameId: GAME_ID,
          sessionId: session?.id
        })
      }]
    );
  };

  const options = DREAMS.map(d => d.dream).sort(() => Math.random() - 0.5);

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Typography variant="body">Loading game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  const inputArea = (
    <View style={styles.gapContainer}>
      {isSyncing && (
        <View style={{position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, zIndex: 1000}}>
          <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
        </View>
      )}
      <GlassCard padding="large">
        <Typography variant="h2">Surface Conflict</Typography>
        <Typography variant="sass" style={styles.conflict}>"{DREAMS[index].conflict}"</Typography>
        <Typography variant="body">What is the underlying dream?</Typography>
        <View style={styles.optionsContainer}>
          {options.map((opt, i) => (
            <SquishyButton key={i} onPress={() => guess(opt)} style={styles.btn} variant="ghost">
              <Typography variant="body">{opt}</Typography>
            </SquishyButton>
          ))}
        </View>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Dream Decoder',
    description: 'Find the dream within the conflict',
    category: 'emotional' as const,
    difficulty: 'hard' as const,
    xpReward: 400,
    currentStep: index,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, index]);

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gapContainer: {
    gap: SPACING.regular,
  },
  optionsContainer: {
    gap: SPACING.small,
    marginTop: SPACING.small,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  conflict: { 
    fontSize: TYPOGRAPHY.fontSize.displaySmall, 
    color: COLORS.creativeChaos, 
    textAlign: 'center', 
    marginVertical: SPACING.regular 
  },
  btn: { 
    backgroundColor: COLORS.backgroundInput, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle
  },
});
