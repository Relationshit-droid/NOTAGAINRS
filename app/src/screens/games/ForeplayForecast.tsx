import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Slider, ActivityIndicator } from 'react-native';
import { GlassCard, Typography, SquishyButton, ScreenLayout } from '../../components/ui';
import { speakMarcie } from '../../lib/voice-engine';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, GRADIENTS } from '../../theme';

// Backend integration
import { useGameSession } from '../../hooks/useGameSession';
import { LinearGradient } from 'expo-linear-gradient';

// Game Constants
const GAME_ID = 'foreplay-slider';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 100;
const TARGET_AROUSAL = 80;
const TIME_LIMIT_MINUTES = 5;

export default function ForeplayForecast({ navigation }: any) {
  const [arousalLevel, setArousalLevel] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT_MINUTES * 60);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [targetReached, setTargetReached] = useState(false);

  // Backend session
  const { 
    session, 
    updateScore, 
    completeGame, 
    isLoading, 
    isSyncing 
  } = useGameSession(GAME_ID, CATEGORY_ID);

  useEffect(() => {
    speakMarcie("Hit 82 with eye contact + hair tuck? Someone's been studying.");
  }, []);

  // Game timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeRemaining > 0 && !gameCompleted) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeRemaining, gameCompleted]);

  // Update score based on arousal level
  useEffect(() => {
    if (isPlaying && !gameCompleted && session) {
      const score = Math.floor((arousalLevel / 100) * MAX_SCORE);
      updateScore(score);
      
      if (arousalLevel >= TARGET_AROUSAL && !targetReached) {
        setTargetReached(true);
        speakMarcie("Target reached! Amazing connection!");
      }
    }
  }, [arousalLevel, isPlaying, gameCompleted, session, targetReached]);

  const startGame = () => {
    setIsPlaying(true);
    setArousalLevel(20);
    setTimeRemaining(TIME_LIMIT_MINUTES * 60);
    speakMarcie("The timer starts now! Use non-sexual acts to build connection.");
  };

  const finishGame = async () => {
    if (gameCompleted) return;
    setGameCompleted(true);
    setIsPlaying(false);
    
    const finalScore = targetReached ? 40 : Math.floor((arousalLevel / 100) * MAX_SCORE);
    await completeGame(finalScore, [{
      completed: true,
      arousalReached: arousalLevel,
      targetReached: targetReached,
      timeElapsed: (TIME_LIMIT_MINUTES * 60) - timeRemaining
    }]);
    
    speakMarcie(targetReached ? "Amazing! You hit the target!" : "Good effort! Keep practicing that connection.");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getArousalColor = () => {
    if (arousalLevel < 30) return COLORS.info;
    if (arousalLevel < 60) return COLORS.warning;
    if (arousalLevel < 80) return COLORS.warmOrange;
    return COLORS.success;
  };

  // Loading state
  if (isLoading) {
    return (
      <ScreenLayout showHeader={false} scrollable={true}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.gradientStart} />
          <Typography variant="h2" style={styles.loadingText}>Loading Foreplay Forecast...</Typography>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout showHeader={false} scrollable={true}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Sync Indicator */}
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption">💾 Saving...</Typography>
          </View>
        )}

        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Typography variant="body">Back</Typography>
          </SquishyButton>
          <Typography variant="h1" style={styles.title}>Foreplay Forecast</Typography>
        </View>

        <GlassCard style={styles.card}>
          <Typography variant="instructions" style={styles.instructionText}>Type: Live mood slider</Typography>
          <Typography variant="body">Mechanics: A sets arousal bar (0–100). B performs non-sexual acts (compliment, neck rub) to raise it.</Typography>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Typography variant="instructions" style={styles.instructionText}>Scoring</Typography>
          <Typography variant="body">
            ✅ +20 points in 5 mins = +30{'\n'}
            ✅ A names what helped = +10
          </Typography>
        </GlassCard>

        {/* Game Status */}
        {isPlaying && (
          <GlassCard style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Typography variant="h2">Time: {formatTime(timeRemaining)}</Typography>
              {targetReached && (
                <Typography variant="caption" style={styles.targetBadge}>🎯 Target Reached!</Typography>
              )}
            </View>
          </GlassCard>
        )}

        {/* Arousal Slider */}
        {isPlaying && (
          <GlassCard style={styles.sliderCard}>
            <Typography variant="h2" style={styles.sliderLabel}>Arousal Level</Typography>
            <Typography variant="h1" style={[styles.arousalValue, { color: getArousalColor() }]}>
              {arousalLevel}
            </Typography>
            
            <View style={styles.sliderContainer}>
              <Typography variant="caption">0</Typography>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={arousalLevel}
                onValueChange={setArousalLevel}
                minimumTrackTintColor={COLORS.gradientStart}
                maximumTrackTintColor={COLORS.borderSubtle}
                thumbTintColor={COLORS.gradientStart}
              />
              <Typography variant="caption">100</Typography>
            </View>

            {/* Target indicator */}
            <View style={styles.targetRow}>
              <Typography variant="caption">Target: {TARGET_AROUSAL}</Typography>
              <LinearGradient
                colors={GRADIENTS.primary.colors}
                start={GRADIENTS.primary.start}
                end={GRADIENTS.primary.end}
                style={[styles.targetMarker, { left: `${TARGET_AROUSAL}%` }]}
              />
            </View>
          </GlassCard>
        )}

        <View style={styles.actionArea}>
          {!isPlaying ? (
            <SquishyButton onPress={startGame} style={styles.playBtn}>
              <Typography variant="body">Start Forecast</Typography>
            </SquishyButton>
          ) : (
            <SquishyButton 
              onPress={finishGame} 
              style={[styles.playBtn, styles.finishBtn]}
            >
              <Typography variant="body">Finish Session</Typography>
            </SquishyButton>
          )}
        </View>

        {session && (
          <Typography variant="caption" style={styles.sessionInfo}>Session: {session.id.slice(0, 8)}...</Typography>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING.screenPadding, gap: SPACING.regular },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: SPACING.small, 
    marginTop: SPACING.large 
  },
  backBtn: { 
    paddingHorizontal: SPACING.regular, 
    paddingVertical: SPACING.small 
  },
  title: { 
    fontSize: TYPOGRAPHY.fontSize.headerLarge, 
    color: COLORS.textPrimary, 
    flex: 1 
  },
  card: { padding: SPACING.cardPadding },
  instructionText: { marginBottom: SPACING.small },
  statusCard: { 
    padding: SPACING.cardPadding,
    backgroundColor: COLORS.backgroundInput,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.small,
    color: COLORS.textPrimary,
  },
  sliderCard: {
    padding: SPACING.cardPadding,
    alignItems: 'center',
  },
  sliderLabel: {
    marginBottom: SPACING.small,
  },
  arousalValue: {
    fontSize: TYPOGRAPHY.fontSize.headerLarge * 1.5,
    marginBottom: SPACING.regular,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: SPACING.small,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.small,
    width: '100%',
    position: 'relative',
  },
  targetMarker: {
    position: 'absolute',
    width: 4,
    height: 20,
    backgroundColor: COLORS.success,
    top: -25,
  },
  actionArea: { 
    marginTop: SPACING.xlarge, 
    alignItems: 'center' 
  },
  playBtn: { 
    width: '80%', 
    paddingVertical: SPACING.regular 
  },
  finishBtn: {
    backgroundColor: COLORS.success,
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
