import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function FlashbackFrenzy({ navigation }: any) {
  // Get game info from registry
  const gameInfo = getGameByScreen('FlashbackFrenzy');
  const GAME_ID = gameInfo?.id || 'flashback-frenzy';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [emotion, setEmotion] = useState('');
  const [guess, setGuess] = useState('');
  const [step, setStep] = useState(1);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);

  const handleEmotionSubmit = async () => {
    if (!emotion.trim()) return;
    setStep(2);
  };

  const handleGuessSubmit = async () => {
    if (!guess.trim()) return;
    setStep(3);
    
    // Calculate score based on round
    const newScore = score + 15;
    setScore(newScore);
    
    // Save to backend
    await updateScore(newScore, [{
      round: round,
      emotion: emotion,
      guess: guess,
      points: 15
    }]);
  };

  const handleNextRound = async () => {
    if (round >= 3) {
      // Complete the game
      await completeGame(score, [{
        completed: true,
        totalRounds: round,
        finalScore: score
      }]);
      
      navigation.navigate('GameResults', {
        score: score,
        gameId: GAME_ID,
        sessionId: session?.id
      });
      return;
    }
    
    setRound(round + 1);
    setStep(1);
    setEmotion('');
    setGuess('');
  };

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading flashback frenzy...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true} showMarcie={true} marcieQuote="Understand your partner's emotional triggers. Connect past experiences to present feelings.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1">Flashback Frenzy</Typography>
        </View>

        <View style={styles.roundIndicator}>
          <Typography variant="caption" color={COLORS.textSecondary}>Round {round} of 3</Typography>
          <Typography variant="h2" color={COLORS.success}>{score} XP</Typography>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.imagePlaceholder}>
            <Typography variant="h1" style={styles.emojiText}>🌧️ 🪟</Typography>
            <Typography variant="body">Image: Rainy Window</Typography>
          </View>
        </GlassCard>

        {step === 1 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Partner A: The Feeling</Typography>
            <Typography variant="body">What emotion does this trigger?</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., Abandonment, Fear..."
              placeholderTextColor={COLORS.textHint}
              value={emotion}
              onChangeText={setEmotion}
            />
            <SquishyButton onPress={handleEmotionSubmit} style={styles.btn}>
              <Typography variant="body">Submit</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2">Partner B: The Guess</Typography>
            <Typography variant="body">Why does A feel that way? Guess the memory.</Typography>
            <TextInput
              style={styles.input}
              placeholder="e.g., That night I didn't come home..."
              placeholderTextColor={COLORS.textHint}
              value={guess}
              onChangeText={setGuess}
            />
            <SquishyButton onPress={handleGuessSubmit} style={styles.btn}>
              <Typography variant="body">Check Match</Typography>
            </SquishyButton>
          </GlassCard>
        )}

        {step === 3 && (
          <GlassCard style={styles.card}>
            <Typography variant="h2" color={COLORS.success} center>Match Analysis</Typography>
            <Typography variant="body">Emotion: <Typography variant="keyword">{emotion}</Typography></Typography>
            <Typography variant="body">Guess: <Typography variant="keyword">{guess}</Typography></Typography>
            <Typography variant="body" style={styles.marcieQuote}>
              Marcie: "Spot on. Listening level: 100. (+15 XP)"
            </Typography>
            <SquishyButton onPress={handleNextRound} style={styles.btn}>
              <Typography variant="body">{round >= 3 ? 'Complete Game' : 'Next Image'}</Typography>
            </SquishyButton>
          </GlassCard>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.small,
  },
  backBtn: {
    paddingHorizontal: SPACING.regular,
    paddingVertical: SPACING.small,
  },
  roundIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.regular,
  },
  card: {
    padding: SPACING.cardPadding,
    gap: SPACING.regular,
  },
  input: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.regular,
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge,
  },
  btn: {
    marginTop: SPACING.regular,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
  },
  marcieQuote: {
    marginTop: SPACING.regular,
    fontStyle: 'italic',
    color: COLORS.romanceHub,
  },
});
