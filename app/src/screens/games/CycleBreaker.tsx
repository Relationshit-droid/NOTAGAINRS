import React, { useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { getGameByScreen } from '../../lib/gameRegistry';

export default function CycleBreaker({ route, navigation }: any) {
  const { gameId } = route.params || {};
  
  // Get game info from registry
  const gameInfo = getGameByScreen('CycleBreaker');
  const GAME_ID = gameInfo?.id || 'cycle-breaker';
  const CATEGORY_ID = gameInfo?.categoryId || 'healing-hospital';
  
  // Backend session
  const {
    session,
    updateScore,
    completeGame,
    isLoading,
    isSyncing
  } = useGameSession(GAME_ID, CATEGORY_ID);
  
  const [pos, setPos] = useState(0);
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    speakMarcie("Welcome to Cycle Breaker. You're playing against The Loop.");
  }, []);

  async function roll() {
    HapticFeedbackSystem.selection();
    
    let newPos = pos;
    let newProgress = progress;
    
    // Simulate progression
    if (pos === 0) {
      newPos = 2;
      newProgress = 33;
      setPos(newPos);
      setProgress(newProgress);
      speakMarcie("Space 2: Trigger Analysis. Name the fear.");
    } else if (pos === 2) {
      newPos = 6;
      newProgress = 66;
      setPos(newPos);
      setProgress(newProgress);
      speakMarcie("Space 6: Cycle Rewrite. Unlock the Escape Hatch.");
    } else {
      await finish();
      return;
    }
    
    // Save to backend
    await updateScore(newProgress, [{
      position: newPos,
      progress: newProgress,
      action: 'roll'
    }]);
  }

  async function finish() {
    const finalScore = 200;
    
    await completeGame(finalScore, [{
      completed: true,
      finalPosition: 10,
      progress: 100,
      xp: 200
    }]);
    
    Alert.alert("Cycle Smashed", "Escape Hatch Unlocked.", [
      { 
        text: "Collect XP", 
        onPress: () => navigation.navigate('GameResults', {
          score: finalScore,
          gameId: GAME_ID,
          sessionId: session?.id
        })
      }
    ]);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showMarcie={true} marcieQuote="Loading cycle breaker...">
        <View style={styles.loadingContainer}>
          <Typography variant="body" center>Starting game...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={true} scrollable={true} showMarcie={true} marcieQuote="Break free from destructive cycles! Identify triggers and rewrite reactions.">
      <View style={styles.container}>
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" color={COLORS.success}>💾 Saving...</Typography>
          </View>
        )}
        
        <Typography variant="h1" center>The Love Arcade</Typography>
        <Typography variant="h2" center>+100 Games to Deepen Connection</Typography>

        <ScrollView style={styles.scrollView}>
          <GlassCard>
            {/* Dr. Marcie Section */}
            <View style={styles.drMarcieSection}>
              <View style={styles.avatarContainer}>
                <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
              </View>
              <View style={styles.quoteBox}>
                <Typography variant="sass">Break free from destructive cycles! Identify triggers and rewrite reactions.</Typography>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <Typography variant="caption" color={COLORS.textSecondary}>Progress</Typography>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Typography variant="body" color={COLORS.success}>{progress}%</Typography>
            </View>

            <Typography variant="h2">Current Space: {pos}</Typography>

            {pos === 0 && <Typography variant="body">Start. Roll to move.</Typography>}

            {pos === 2 && (
              <View>
                <Typography variant="instructions">Trigger: Late Phone Call.</Typography>
                <SquishyButton onPress={roll} style={styles.actionBtn}>
                  <Typography variant="body">Action: Name 'Catastrophic Thought'</Typography>
                </SquishyButton>
              </View>
            )}

            {pos === 6 && (
              <View>
                <Typography variant="instructions">Rewrite the reaction.</Typography>
                <SquishyButton onPress={roll} style={styles.actionBtn}>
                  <Typography variant="body">Action: Say 'My alarm is loud' instead of attacking</Typography>
                </SquishyButton>
              </View>
            )}

            {pos === 0 && (
              <SquishyButton onPress={roll} style={styles.rollBtn}>
                <LinearGradient
                  colors={GRADIENTS.primary.colors}
                  start={GRADIENTS.primary.start}
                  end={GRADIENTS.primary.end}
                  style={styles.gradientButton}
                >
                  <Typography variant="h2" style={styles.rollButtonText}>Roll Die</Typography>
                </LinearGradient>
              </SquishyButton>
            )}
          </GlassCard>
        </ScrollView>
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
  progressContainer: {
    marginBottom: SPACING.regular,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.small,
    marginVertical: SPACING.small,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.small,
  },
  rollBtn: {
    padding: SPACING.xlarge,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: SPACING.xlarge,
    ...SHADOWS.buttonGlow,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.round,
    paddingVertical: SPACING.xlarge,
  },
  actionBtn: {
    marginTop: SPACING.xlarge,
    backgroundColor: COLORS.mintGreen,
    padding: SPACING.regular,
    borderRadius: BORDER_RADIUS.large,
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
    ...SHADOWS.buttonGlow,
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
  scrollView: {
    gap: SPACING.regular,
  },
  rollButtonText: {
    color: COLORS.textPrimary,
  },
});
