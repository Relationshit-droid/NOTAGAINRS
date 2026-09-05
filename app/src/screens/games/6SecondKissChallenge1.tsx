/**
 * 6-Second Kiss Challenge Game Screen
 * 
 * This game has been updated to connect to the backend API.
 * - Creates game session on mount
 - Saves score to backend when completed
 * - Uses GameConnector for automatic sync
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppNavigation } from '../../hooks/useAppNavigation';

import { ScreenLayout, Typography, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS, ANIMATIONS, GRADIENTS } from '../../theme';

// Backend API imports
import { GameConnector } from '../../components/games/GameConnector';
import { gamesApi, GameSession } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';

// Game Constants
const GAME_ID = 'six-second-kiss';
const CATEGORY_ID = 'romance-hub';
const MAX_SCORE = 100;

interface GameProps {
  session: GameSession | null;
  updateScore: (score: number, completed?: boolean, responses?: any[]) => void;
  isSyncing: boolean;
}

const SixSecondKissGame: React.FC<GameProps> = ({ session, updateScore, isSyncing }) => {
  const navigation = useAppNavigation();
  const [player1Hold, setPlayer1Hold] = useState(false);
  const [player2Hold, setPlayer2Hold] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 0.01), 10);
    } else if (countdown <= 0) {
      setIsRunning(false);
      setCountdown(0);
      handleComplete();
    }
    return () => clearTimeout(timer);
  }, [isRunning, countdown]);

  // Start timer when both players hold
  useEffect(() => {
    if (player1Hold && player2Hold) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [player1Hold, player2Hold]);

  // Handle game completion
  const handleComplete = useCallback(() => {
    if (completed) return;
    
    setCompleted(true);
    const finalScore = Math.round(MAX_SCORE);
    
    // Save to backend
    updateScore(finalScore, true, [
      { player1Held: player1Hold, player2Held: player2Hold, time: 6 }
    ]);
    
    // Show completion alert
    Alert.alert(
      'Challenge Complete! 💋',
      'You completed the 6-second kiss challenge!',
      [
        { 
          text: 'View Results', 
          onPress: () => navigation.navigate('SixSecondKissResults', { 
            score: finalScore,
            sessionId: session?.id 
          }) 
        }
      ]
    );
  }, [completed, player1Hold, player2Hold, updateScore, navigation, session]);

  const resetGame = () => {
    setPlayer1Hold(false);
    setPlayer2Hold(false);
    setIsRunning(false);
    setCountdown(6);
    setCompleted(false);
  };

  const TouchZone = ({ player, onHold, isHolding }: { 
    player: string; 
    onHold: (val: boolean) => void; 
    isHolding: boolean;
  }) => {
    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: isHolding ? 1.05 : 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }, [isHolding]);

    return (
      <Animated.View style={[styles.touchZoneAnimated, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={GRADIENTS.primary.colors}
          start={GRADIENTS.primary.start}
          end={GRADIENTS.primary.end}
          style={[styles.touchZone, isHolding && styles.touchZoneActive]}
        >
          <TouchableOpacity
            style={styles.touchZoneInner}
            onPressIn={() => onHold(true)}
            onPressOut={() => onHold(false)}
            disabled={completed}
          >
            <MaterialIcons 
              name="touch_app" 
              size={40} 
              color={isHolding ? COLORS.textPrimary : COLORS.textSecondary} 
            />
            <Typography variant="body" style={styles.touchZoneText}>{player}</Typography>
            {isHolding && <Typography variant="caption" style={styles.connectedText}>Connected</Typography>}
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <ScreenLayout showHeader={false} scrollable={true} showMarcie={true} marcieQuote="Ready to share some intimate moments? The 6-second kiss challenge helps couples connect deeply through sustained eye contact and physical touch.">
      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          The Love Arcade
        </Typography>
        <Typography variant="h2" style={styles.subtitle}>
          +100 Games to Deepen Connection
        </Typography>

        {/* Sync indicator */}
        {isSyncing && (
          <View style={styles.syncIndicator}>
            <Typography variant="caption" style={styles.syncText}>💾 Saving...</Typography>
          </View>
        )}

        <View style={styles.gameArea}>
          <TouchZone 
            player="Player 1" 
            onHold={setPlayer1Hold} 
            isHolding={player1Hold} 
          />
          
          <View style={styles.timerContainer}>
            <LinearGradient
              colors={COLORS.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.timerGradient}
            >
              <Typography variant="h1" style={styles.timerText}>
                {countdown.toFixed(2)}s
              </Typography>
            </LinearGradient>
          </View>

          <TouchZone 
            player="Player 2" 
            onHold={setPlayer2Hold} 
            isHolding={player2Hold} 
          />
        </View>

        <GlassCard style={styles.instructionsContainer}>
          <Typography variant="body" style={styles.instructions}>
            Both partners must hold their buttons simultaneously for 6 seconds
          </Typography>
        </GlassCard>

        <SquishyButton onPress={resetGame} style={styles.resetButton}>
          <Typography variant="button">Reset Challenge</Typography>
        </SquishyButton>

        {/* Session info (debug) */}
        {session && (
          <Typography variant="caption" style={styles.sessionInfo}>
            Session: {session.id.slice(0, 8)}...
          </Typography>
        )}
      </View>
    </ScreenLayout>
  );
};

// Main exported component wrapped with GameConnector
const SixSecondKissChallenge1: React.FC = () => {
  const navigation = useAppNavigation();

  const handleComplete = (score: number, session: GameSession) => {
    console.log('[SixSecondKissChallenge1] Game completed:', { score, sessionId: session.id });
    // Navigation handled in game component
  };

  const handleError = (error: Error) => {
    console.error('[SixSecondKissChallenge1] Game error:', error);
  };

  return (
    <GameConnector
      gameId={GAME_ID}
      categoryId={CATEGORY_ID}
      onComplete={handleComplete}
      onError={handleError}
    >
      {(session, updateScore, isSyncing) => (
        <SixSecondKissGame 
          session={session} 
          updateScore={updateScore} 
          isSyncing={isSyncing} 
        />
      )}
    </GameConnector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: SPACING.lg,
  },
  syncIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  syncText: {
    color: COLORS.vibrantPink,
  },
  gameArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  touchZoneAnimated: {
    // Base style for animated touch zone
  },
  touchZone: {
    width: 120,
    height: 180,
    borderRadius: BORDER_RADIUS.xxlarge,
    padding: SPACING.micro,
    opacity: 0.8,
  },
  touchZoneActive: {
    opacity: 1,
    ...SHADOWS.neon,
  },
  touchZoneInner: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
    borderRadius: BORDER_RADIUS.xxlarge - 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchZoneText: {
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold as any,
  },
  connectedText: {
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    opacity: 0.8,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerGradient: {
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.regular,
    borderRadius: BORDER_RADIUS.round,
  },
  timerText: {
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  instructionsContainer: {
    marginVertical: SPACING.lg,
    padding: SPACING.regular,
  },
  instructions: {
    textAlign: 'center',
  },
  resetButton: {
    alignSelf: 'center',
    marginBottom: SPACING.sm,
  },
  sessionInfo: {
    textAlign: 'center',
    opacity: 0.3,
  },
});

export default SixSecondKissChallenge1;
