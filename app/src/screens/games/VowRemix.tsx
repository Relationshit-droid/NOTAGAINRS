import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function VowRemix({ route, navigation }: any) {
  const { gameId } = route.params;
  const [vow, setVow] = useState('');
  const [score, setScore] = useState(0);

  // Get game info from registry
  const gameInfo = getGameByScreen('VowRemix');
  const GAME_ID = gameInfo?.id || 'vow-remix';
  const CATEGORY_ID = gameInfo?.categoryId || 'romance-hub';

  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing,
    partnerProgress
  } = useGameSession(GAME_ID, CATEGORY_ID);

  async function submit() {
    if (!vow) {
      speakMarcie("Silence is not a vow. Write.");
      return;
    }

    // Calculate score based on vow length and content
    const contentScore = Math.min(100, Math.floor(vow.length * 2));
    setScore(contentScore);

    // Update score in backend
    await updateScore(contentScore, [{
      vow,
      length: vow.length,
      timestamp: new Date().toISOString()
    }]);

    speakMarcie("A modern classic. Frame it.");
    HapticFeedbackSystem.success();
    
    // Complete the game
    await completeGame(contentScore, [{
      vow,
      finalScore: contentScore
    }], ['Vow Creator']);
    
    Alert.alert("Vow Renewed", "Saved to your profile.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputWrapper}>
      <GlassCard>
        <Typography variant="h2" center>Vow Remix</Typography>
        <Typography variant="body" center>Complete the sentence:</Typography>
        <Typography variant="sass" center style={styles.prompt}>"I vow to love you even when..."</Typography>
        <TextInput
            style={styles.input}
            placeholder="e.g. you eat all the chips"
            placeholderTextColor={COLORS.textHint}
            value={vow}
            onChangeText={setVow}
            multiline
        />
        
        {/* Sync Indicator */}
        {isSyncing && (
          <View style={{backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, marginBottom: SPACING.small, alignSelf: 'center'}}>
            <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
          </View>
        )}
        
        <SquishyButton onPress={submit} style={styles.btn}>
            <Typography variant="button">Seal Vow</Typography>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Vow Remix',
    description: 'Update your promises',
    category: 'romance' as const,
    difficulty: 'medium' as const,
    xpReward: 200,
    currentStep: vow ? 1 : 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId, vow]);

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

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  prompt: { 
    fontSize: TYPOGRAPHY.fontSize.headerMedium, 
    textAlign: 'center', 
    marginVertical: SPACING.regular, 
    color: COLORS.success 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: 80,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
    fontFamily: TYPOGRAPHY.fontFamily.regular,
  },
  btn: { 
    marginTop: SPACING.regular, 
    backgroundColor: COLORS.emotionalConnection, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.button, 
    alignItems: 'center' 
  },
  inputWrapper: {
    gap: SPACING.regular,
  },
});
