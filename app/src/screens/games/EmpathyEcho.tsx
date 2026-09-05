import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const WORRY = "I feel overwhelmed by my job insecurity right now.";

export default function EmpathyEcho({ route, navigation }: any) {
  const { gameId } = route.params ?? {};
  const [response, setResponse] = useState('');
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Get game info from registry
  const gameInfo = getGameByScreen('EmpathyEcho');
  const GAME_ID = gameInfo?.id || 'empathy-echo';
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

  async function check() {
    const r = response.toLowerCase();
    let points = 0;
    
    if (r.includes('fix') || r.includes('solution') || r.includes('should')) {
      speakMarcie("Stop trying to fix it. Just listen.");
      HapticFeedbackSystem.error();
      points = 10;
    } else if (r.length < 10) {
      speakMarcie("Too short. Empathy requires more than a grunt.");
      points = 20;
    } else {
      speakMarcie("That sounds like validation. Good.");
      HapticFeedbackSystem.success();
      points = 100;
      setCompleted(true);
    }
    
    const newScore = score + points;
    setScore(newScore);
    
    // Update in backend
    await updateScore(newScore, [{
      questionId: '1',
      response: response,
      points: points
    }]);
    
    if (points >= 100) {
      await finishGame(newScore);
    }
  }

  const finishGame = async (finalScore: number) => {
    const achievements: string[] = [];
    if (finalScore >= 100) achievements.push('Empathy Master');
    if (response.length > 50) achievements.push('Thoughtful Listener');
    
    await completeGame(finalScore, [{
      questionId: '1',
      response: response
    }], achievements);
    
    Alert.alert(
      "Empathy Scored", 
      "You made them feel seen.", 
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
      <GlassCard>
        <Typography variant="h2" center style={styles.gameTitle}>The Love Arcade</Typography>
        <Typography variant="h3" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>
        
        <Typography variant="h3" style={styles.sectionTitle}>Partner's Worry</Typography>
        <Typography variant="h3" style={styles.worry}>"{WORRY}"</Typography>
        <Typography variant="body">Respond with validation ONLY (no fixing):</Typography>
        <TextInput
            style={styles.input}
            placeholder="That sounds really hard..."
            placeholderTextColor={COLORS.textHint}
            value={response}
            onChangeText={setResponse}
            multiline
        />
        <SquishyButton onPress={check} style={styles.btn}>
            <Typography variant="button">Send Echo</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Empathy Echo',
    description: 'Validate without fixing',
    category: 'emotional' as const,
    difficulty: 'hard' as const,
    xpReward: 300,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => check()} />;
}

const styles = StyleSheet.create({
  gapContainer: {
    gap: SPACING.regular,
  },
  sectionTitle: {
    marginTop: SPACING.large,
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    marginBottom: SPACING.regular,
  },
  worry: { 
    textAlign: 'center', 
    marginVertical: SPACING.large, 
    color: COLORS.textPrimary,
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 80,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    marginTop: SPACING.regular,
  },
  btn: { 
    marginTop: SPACING.large,
  },
});
