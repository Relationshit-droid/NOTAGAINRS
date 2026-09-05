import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function VibeSync({ navigation }: any) {
  const [myVibe, setMyVibe] = useState(50);
  const [step, setStep] = useState(1); // 1: Set, 2: Guess/Wait (simulated), 3: Reveal
  const [partnerVibe, setPartnerVibe] = useState(0);
  const [score, setScore] = useState(0);

  // Get game info from registry
  const gameInfo = getGameByScreen('VibeSync');
  const GAME_ID = gameInfo?.id || 'vibe-check';
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

  async function lockVibe() {
    // Simulate partner value
    const sim = Math.floor(Math.random() * 100);
    setPartnerVibe(sim);
    
    // Calculate score based on how close the vibes are
    const diff = Math.abs(myVibe - sim);
    let roundScore = 0;
    if (diff < 5) roundScore = 25;
    else if (diff < 15) roundScore = 15;
    else if (diff < 30) roundScore = 5;
    
    setScore(roundScore);
    
    // Update score in backend
    await updateScore(roundScore, [{
      myVibe,
      partnerVibe: sim,
      difference: diff,
      roundScore
    }]);
    
    setStep(3);
  }

  async function playAgain() {
    // Complete the current game session
    await completeGame(score, [{
      myVibe,
      partnerVibe,
      finalScore: score
    }]);
    
    // Reset for new game
    setMyVibe(50);
    setStep(1);
    setPartnerVibe(0);
    setScore(0);
  }

  const diff = Math.abs(myVibe - partnerVibe);
  let msg = "";
  if (diff < 5) msg = "Psychic Match! (+25 XP)";
  else if (diff < 15) msg = "In Sync! (+15 XP)";
  else msg = "Vibe Mismatch. Talk it out.";

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

  return (
    <ScreenLayout showHeader={true} scrollable={true}>
      {/* Sync Indicator */}
      {isSyncing && (
        <View style={{position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', padding: 8, borderRadius: 8, zIndex: 1000}}>
          <Typography variant="caption" style={{color: COLORS.success}}>💾 Saving...</Typography>
        </View>
      )}

      <View style={styles.header}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Typography variant="button">Back</Typography>
        </SquishyButton>
        <Typography variant="h1">Vibe Sync</Typography>
      </View>

      <GlassCard style={styles.card}>
        <Typography variant="h2" center>
          {step === 3 ? "Results" : "Set Your Emotional Battery"}
        </Typography>

        <View style={styles.sliderContainer}>
          <Typography variant="h1" style={styles.value}>{myVibe}%</Typography>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={myVibe}
            onValueChange={setMyVibe}
            minimumTrackTintColor={COLORS.emotionalConnection}
            maximumTrackTintColor={COLORS.textPrimary}
            disabled={step === 3}
          />
          <View style={styles.labels}>
            <Typography variant="body">Drained</Typography>
            <Typography variant="body">Charged</Typography>
          </View>
        </View>

        {step === 3 && (
           <View style={styles.resultsContainer}>
             <Typography variant="body">Partner's Vibe (Simulated)</Typography>
             <Typography variant="h1" style={styles.partnerValue}>{partnerVibe}%</Typography>
             <Typography variant="h2" center style={styles.messageText}>{msg}</Typography>
             {score > 0 && (
               <Typography variant="body" center style={styles.scoreText}>Score: {score} XP</Typography>
             )}
           </View>
        )}

        {step !== 3 && (
          <SquishyButton onPress={lockVibe} style={styles.btn}>
            <Typography variant="button">Lock In</Typography>
          </SquishyButton>
        )}

        {step === 3 && (
           <SquishyButton onPress={playAgain} style={styles.playAgainBtn}>
             <Typography variant="button">Play Again</Typography>
           </SquishyButton>
        )}

      </GlassCard>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.regular,
    marginBottom: SPACING.xlarge,
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small, 
    backgroundColor: COLORS.backgroundInput, 
    borderRadius: BORDER_RADIUS.button 
  },
  card: { 
    padding: SPACING.xxlarge, 
    gap: SPACING.regular 
  },
  sliderContainer: { 
    alignItems: 'center', 
    gap: SPACING.regular, 
    paddingVertical: SPACING.xlarge 
  },
  slider: {
    width: '100%',
    height: 40,
  },
  value: { 
    fontSize: TYPOGRAPHY.fontSize.displayLarge * 1.5, 
    color: COLORS.emotionalConnection 
  },
  labels: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%' 
  },
  resultsContainer: {
    marginTop: SPACING.xlarge,
    alignItems: 'center',
    gap: SPACING.regular,
  },
  partnerValue: {
    color: COLORS.brightYellow,
  },
  messageText: {
    color: COLORS.success,
  },
  scoreText: {
    color: COLORS.brightYellow,
    marginTop: SPACING.small,
  },
  btn: { 
    backgroundColor: COLORS.emotionalConnection, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.button, 
    alignItems: 'center' 
  },
  playAgainBtn: {
    backgroundColor: COLORS.emotionalConnection,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.button,
    alignItems: 'center',
    marginTop: SPACING.xlarge,
  },
});
