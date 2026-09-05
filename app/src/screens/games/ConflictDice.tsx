import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

const SCENARIOS = ["Argue about thermostat", "Who does dishes?", "In-laws visiting", "Money stress"];
const CONSTRAINTS = ["No 'You' statements", "Whisper only", "Hold hands", "Rhyme every sentence"];

export default function ConflictDice({ route, navigation }: any) {
  const { gameId } = route.params || {};
  
  // Get game info from registry
  const gameInfo = getGameByScreen('ConflictDice');
  const GAME_ID = gameInfo?.id || 'conflict-dice';
  const CATEGORY_ID = gameInfo?.categoryId || 'conflict-resolution';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [scenario, setScenario] = useState<string | null>(null);
  const [constraint, setConstraint] = useState<string | null>(null);
  const [rolled, setRolled] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  async function roll() {
    setRolled(true);
    const s = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    const c = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)];
    setScenario(s);
    setConstraint(c);
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Rolling... Good luck with this combo.");

    const newRollCount = rollCount + 1;
    setRollCount(newRollCount);
    
    // Save to backend
    await updateScore(newRollCount * 10, [{
      roll: newRollCount,
      scenario: s,
      constraint: c
    }]);
  }

  async function finish() {
    const finalScore = rollCount * 10 + 50;
    
    await completeGame(finalScore, [{
      completed: true,
      totalRolls: rollCount,
      finalScenario: scenario,
      finalConstraint: constraint
    }]);
    
    Alert.alert("Scenario Complete", "Did you survive?", [{ 
      text: "Yes", 
      onPress: () => navigation.navigate('GameResults', {
        score: finalScore,
        gameId: GAME_ID,
        sessionId: session?.id
      })
    }]);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading conflict dice...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true} showMarcie={true} marcieQuote="Practice conflict resolution with random scenarios! Constraints make communication more creative.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <GlassCard>
          {/* Dr. Marcie Section */}
          <View style={styles.drMarcieSection}>
            <View style={styles.avatarContainer}>
              <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
            </View>
            <View style={styles.quoteBox}>
              <Typography variant="sass">Practice conflict resolution with random scenarios! Constraints make communication more creative.</Typography>
            </View>
          </View>

          {!rolled ? (
            <View style={styles.rollContainer}>
              <Typography variant="h1" style={styles.diceEmoji}>🎲</Typography>
              <SquishyButton onPress={roll} style={styles.rollBtn}>
                <LinearGradient
                  colors={GRADIENTS.primary.colors}
                  start={GRADIENTS.primary.start}
                  end={GRADIENTS.primary.end}
                  style={styles.gradientButton}
                >
                  <Typography variant="h2" style={styles.rollButtonText}>Roll Dice</Typography>
                </LinearGradient>
              </SquishyButton>
            </View>
          ) : (
            <View style={styles.resultContainer}>
              <View>
                <Typography variant="body">Scenario:</Typography>
                <Typography variant="h2" style={styles.scenarioText}>{scenario}</Typography>
              </View>
              <View>
                <Typography variant="body">Constraint:</Typography>
                <Typography variant="h2" style={styles.constraintText}>{constraint}</Typography>
              </View>
              <SquishyButton onPress={finish} style={styles.doneBtn}>
                <LinearGradient
                  colors={[COLORS.mintGreen, COLORS.softViolet]}
                  start={GRADIENTS.primary.start}
                  end={GRADIENTS.primary.end}
                  style={styles.gradientButton}
                >
                  <Typography variant="h2" style={styles.doneButtonText}>We Did It</Typography>
                </LinearGradient>
              </SquishyButton>
              <SquishyButton onPress={roll} style={styles.rerollBtn}>
                <Typography variant="body">Roll Again</Typography>
              </SquishyButton>
            </View>
          )}
        </GlassCard>

        <View style={styles.scoreContainer}>
          <Typography variant="caption" color={COLORS.textSecondary}>Rolls Completed</Typography>
          <Typography variant="h2" color={COLORS.success}>{rollCount}</Typography>
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.regular,
    flex: 1,
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
  rollBtn: { 
    marginTop: SPACING.xlarge, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    width: '100%', 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  doneBtn: { 
    marginTop: SPACING.xlarge, 
    padding: SPACING.regular, 
    borderRadius: BORDER_RADIUS.large, 
    alignItems: 'center',
    ...SHADOWS.buttonGlow,
  },
  rerollBtn: {
    marginTop: SPACING.medium,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.large,
    paddingVertical: SPACING.regular,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.xxlarge,
    padding: SPACING.regular,
    marginBottom: SPACING.regular,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.brightYellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.regular,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.round,
    resizeMode: 'cover',
  },
  quoteBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundInput,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.regular,
  },
  inputArea: {
    gap: SPACING.regular,
  },
  rollContainer: {
    alignItems: 'center',
    padding: SPACING.xlarge,
  },
  diceEmoji: {
    fontSize: TYPOGRAPHY.fontSize.displayLarge,
  },
  rollButtonText: {
    color: COLORS.textPrimary,
  },
  resultContainer: {
    gap: SPACING.regular,
  },
  scenarioText: {
    color: COLORS.vibrantPink,
  },
  constraintText: {
    color: COLORS.mintGreen,
  },
  doneButtonText: {
    color: COLORS.textPrimary,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: SPACING.medium,
  },
});
