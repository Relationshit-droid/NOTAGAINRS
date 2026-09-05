import { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { ScreenLayout, GlassCard, Typography, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';

// Game Constants
const GAME_ID = 'commitment-dice';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 100;

const PROMPTS = ["Text one reason you chose them today", "Send a photo of your favorite memory", "Commit to one chore this week"];

export default function CommitmentDice({ route, navigation }: any) {
  const { gameId } = route.params;
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [rolled, setRolled] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Backend session
  const { 
    session, 
    updateScore, 
    completeGame, 
    isLoading, 
    isSyncing 
  } = useGameSession(GAME_ID, CATEGORY_ID);

  function roll() {
    setRolled(true);
    const p = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setPrompt(p);
    speakMarcie(p);
    HapticFeedbackSystem.heavyImpact();
    
    // Update score for rolling
    updateScore(20);
  }

  async function submit() {
    if (!response) {
      speakMarcie("You can't commit to nothing. Type something.");
      return;
    }
    
    if (gameCompleted) return;
    setGameCompleted(true);
    
    speakMarcie("Commitment logged. I'll be watching.");
    HapticFeedbackSystem.success();
    
    // Complete the game
    const finalScore = 50 + Math.min(response.length, 50);
    await completeGame(finalScore, [{
      completed: true,
      prompt: prompt,
      responseLength: response.length
    }]);
    
    Alert.alert("Commitment Sent", "Your partner has been notified.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={styles.inputAreaGap}>
      {/* Sync Indicator */}
      {isSyncing && (
        <View style={styles.syncIndicator}>
          <Typography variant="caption">💾 Saving...</Typography>
        </View>
      )}

      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Typography variant="body">Roll the dice for random acts of commitment! Small gestures build lasting bonds.</Typography>
          </View>
        </View>

        <Typography variant="h1" center style={styles.gameTitle}>The Love Arcade</Typography>
        <Typography variant="h2" center style={styles.subtitle}>+100 Games to Deepen Connection</Typography>

        {!rolled ? (
            <View style={styles.rollContainer}>
                <Typography variant="h1" center>🎲</Typography>
                <SquishyButton onPress={roll} style={styles.rollBtn}>
                  <Typography variant="button" style={styles.buttonText}>Roll for Commitment</Typography>
                </SquishyButton>
            </View>
        ) : (
            <View style={styles.resultContainer}>
                <Typography variant="body">Prompt:</Typography>
                <Typography variant="h2" center style={styles.promptText}>{prompt}</Typography>
                <TextInput
                    style={styles.input}
                    placeholder="Your commitment..."
                    placeholderTextColor={COLORS.textHint}
                    value={response}
                    onChangeText={setResponse}
                    multiline
                />
                <SquishyButton onPress={submit} style={styles.doneBtn}>
                  <Typography variant="button" style={styles.buttonText}>Commit</Typography>
                </SquishyButton>
            </View>
        )}

        {session && (
          <Typography variant="caption" style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
        )}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Commitment Dice',
    description: 'Random acts of commitment',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 100,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showHeader={false} scrollable={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Typography variant="h2" style={styles.loadingText}>Loading Commitment Dice...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => navigation.goBack()} />;
}

const styles = StyleSheet.create({
  inputAreaGap: {
    gap: SPACING.regular,
  },
  rollContainer: {
    alignItems: 'center',
    padding: SPACING.regular,
  },
  resultContainer: {
    gap: SPACING.regular,
  },
  promptText: {
    color: COLORS.gradientStart,
  },
  buttonText: {
    color: COLORS.textPrimary,
  },
  gameTitle: {
    marginBottom: SPACING.small,
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.regular,
  },
  rollBtn: { 
    marginTop: SPACING.regular, 
  },
  input: { 
    backgroundColor: COLORS.backgroundInput, 
    color: COLORS.textPrimary, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.medium, 
    minHeight: SPACING.xxlarge * 3, 
    marginTop: SPACING.small,
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  doneBtn: { 
    marginTop: SPACING.regular, 
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular
  },
  avatarContainer: {
    width: SPACING.xxlarge + SPACING.medium,
    height: SPACING.xxlarge + SPACING.medium,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular
  },
  avatar: {
    width: SPACING.xxlarge,
    height: SPACING.xxlarge,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: SPACING.regular,
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.regular,
    right: SPACING.regular,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1,
  },
  sessionInfo: {
    textAlign: 'center',
    marginTop: SPACING.xlarge,
    opacity: 0.3,
  },
});
