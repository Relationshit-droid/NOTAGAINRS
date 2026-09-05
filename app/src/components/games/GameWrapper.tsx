/**
 * GameWrapper Component
 * 
 * A comprehensive wrapper for all game screens that provides:
 * - Backend session management
 * - Real-time multiplayer synchronization
 * - Score tracking and validation
 * - Error handling and recovery
 * - Loading states
 * - Dr. Marcie integration
 * 
 * Usage:
 * <GameWrapper
 *   gameId="truth-teller-tower"
 *   categoryId="love-arcade"
 *   coupleId={coupleId}
 *   onComplete={handleComplete}
 *   onExit={handleExit}
 * >
 *   {(props) => <YourGameComponent {...props} />}
 * </GameWrapper>
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useGameSession } from '../../hooks/useGameSession';
import { useWebSocket } from '../../hooks/useWebSocket';
import { GameSession } from '../../lib/api';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { Typography, SquishyButton } from '../ui';

// Game state types
export type GameState = 
  | 'initializing'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'partner_waiting'
  | 'completed'
  | 'error';

// Props for child game components
export interface GameComponentProps {
  /** Current game session */
  session: GameSession;
  /** Current game state */
  gameState: GameState;
  /** Current score */
  score: number;
  /** Partner's progress (for multiplayer games) */
  partnerProgress: any | null;
  /** Whether partner is online */
  partnerOnline: boolean;
  /** Submit an answer */
  onSubmitAnswer: (questionId: string, answer: any, metadata?: Record<string, any>) => Promise<void>;
  /** Update score */
  onUpdateScore: (points: number) => void;
  /** Complete the game */
  onComplete: (finalScore: number, achievements?: string[]) => void;
  /** Pause the game */
  onPause: () => void;
  /** Resume the game */
  onResume: () => void;
  /** Exit the game */
  onExit: () => void;
  /** Send real-time update to partner */
  sendPartnerUpdate: (data: any) => boolean;
}

// GameWrapper props
interface GameWrapperProps {
  /** Game ID from registry */
  gameId: string;
  /** Category ID */
  categoryId: string;
  /** Couple ID for multiplayer */
  coupleId?: string;
  /** Child render function */
  children: (props: GameComponentProps) => React.ReactNode;
  /** Called when game completes */
  onComplete?: (results: { score: number; session: GameSession; achievements?: string[] }) => void;
  /** Called when user exits */
  onExit?: () => void;
  /** Whether to enable multiplayer sync */
  enableMultiplayer?: boolean;
}

export const GameWrapper: React.FC<GameWrapperProps> = ({
  gameId,
  categoryId,
  coupleId,
  children,
  onComplete,
  onExit,
  enableMultiplayer = true,
}) => {
  // Game session management
  const {
    session,
    isLoading: isSessionLoading,
    isSyncing,
    error: sessionError,
    partnerProgress,
    updateScore,
    submitAnswer,
    completeGame,
    resetSession,
  } = useGameSession(gameId, categoryId, coupleId);

  // WebSocket for real-time sync
  const {
    isConnected: isWsConnected,
    partnerOnline,
    sendMessage,
    lastMessage,
  } = useWebSocket(enableMultiplayer ? coupleId : null);

  // Local game state
  const [gameState, setGameState] = useState<GameState>('initializing');
  const [localScore, setLocalScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Initialize game state when session is ready
  useEffect(() => {
    if (isSessionLoading) {
      setGameState('loading');
    } else if (session) {
      setGameState('ready');
      setLocalScore(session.score || 0);
    } else if (sessionError) {
      setGameState('error');
    }
  }, [isSessionLoading, session, sessionError]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'game_progress':
        // Partner sent progress update
        break;
      case 'partner_ready':
        if (gameState === 'partner_waiting') {
          setGameState('playing');
        }
        break;
      case 'partner_paused':
        setGameState('paused');
        break;
      case 'partner_completed':
        // Partner completed the game
        break;
    }
  }, [lastMessage, gameState]);

  // Submit answer handler
  const handleSubmitAnswer = useCallback(async (
    questionId: string,
    answer: any,
    metadata?: Record<string, any>
  ) => {
    if (!session) return;

    try {
      await submitAnswer(questionId, answer, metadata);
      
      // Notify partner of progress
      if (enableMultiplayer && isWsConnected) {
        sendMessage({
          type: 'game_progress',
          questionId,
          answered: true,
        });
      }
    } catch (err) {
      console.error('[GameWrapper] Failed to submit answer:', err);
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    }
  }, [session, submitAnswer, enableMultiplayer, isWsConnected, sendMessage]);

  // Update score handler
  const handleUpdateScore = useCallback((points: number) => {
    const newScore = localScore + points;
    setLocalScore(newScore);
    updateScore(newScore);
  }, [localScore, updateScore]);

  // Complete game handler
  const handleComplete = useCallback((finalScore: number, newAchievements?: string[]) => {
    if (!session) return;

    const allAchievements = [...achievements, ...(newAchievements || [])];
    
    completeGame(finalScore, undefined, allAchievements);
    setGameState('completed');

    // Notify partner
    if (enableMultiplayer && isWsConnected) {
      sendMessage({
        type: 'game_completed',
        score: finalScore,
        achievements: allAchievements,
      });
    }

    // Call onComplete callback
    onComplete?.({
      score: finalScore,
      session,
      achievements: allAchievements,
    });
  }, [session, achievements, completeGame, enableMultiplayer, isWsConnected, sendMessage, onComplete]);

  // Pause handler
  const handlePause = useCallback(() => {
    setGameState('paused');
    
    if (enableMultiplayer && isWsConnected) {
      sendMessage({
        type: 'game_paused',
      });
    }
  }, [enableMultiplayer, isWsConnected, sendMessage]);

  // Resume handler
  const handleResume = useCallback(() => {
    setGameState('playing');
    
    if (enableMultiplayer && isWsConnected) {
      sendMessage({
        type: 'game_resumed',
      });
    }
  }, [enableMultiplayer, isWsConnected, sendMessage]);

  // Exit handler
  const handleExit = useCallback(() => {
    Alert.alert(
      'Exit Game?',
      'Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            // Save current progress
            if (session && localScore > 0) {
              updateScore(localScore);
            }
            onExit?.();
          },
        },
      ]
    );
  }, [session, localScore, updateScore, onExit]);

  // Send partner update
  const sendPartnerUpdate = useCallback((data: any): boolean => {
    if (!enableMultiplayer || !isWsConnected) return false;
    
    return sendMessage({
      type: 'game_progress',
      ...data,
    });
  }, [enableMultiplayer, isWsConnected, sendMessage]);

  // Start game
  const handleStart = useCallback(() => {
    setGameState('playing');
    
    if (enableMultiplayer && coupleId) {
      if (!partnerOnline) {
        setGameState('partner_waiting');
      }
      
      sendMessage({
        type: 'game_started',
        gameId,
        sessionId: session?.id,
      });
    }
  }, [enableMultiplayer, coupleId, partnerOnline, sendMessage, gameId, session?.id]);

  // Retry on error
  const handleRetry = useCallback(() => {
    resetSession();
  }, [resetSession]);

  // Loading state
  if (gameState === 'initializing' || gameState === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.gradientStart} />
        <Typography variant="headerMedium" style={styles.loadingText}>
          Loading game...
        </Typography>
      </View>
    );
  }

  // Error state
  if (gameState === 'error' || sessionError) {
    return (
      <View style={styles.container}>
        <Typography variant="displaySmall" color={COLORS.error} style={styles.errorTitle}>
          Oops!
        </Typography>
        <Typography variant="bodyLarge" style={styles.errorText}>
          {sessionError?.message || 'Failed to load game'}
        </Typography>
        <SquishyButton onPress={handleRetry} style={styles.retryButton}>
          <Typography variant="headerSmall" color={COLORS.textPrimary}>
            Try Again
          </Typography>
        </SquishyButton>
        <SquishyButton onPress={onExit} style={styles.exitButton}>
          <Typography variant="headerSmall" color={COLORS.textSecondary}>
            Exit
          </Typography>
        </SquishyButton>
      </View>
    );
  }

  // Waiting for partner
  if (gameState === 'partner_waiting') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.gradientStart} />
        <Typography variant="headerLarge" style={styles.waitingText}>
          Waiting for partner...
        </Typography>
        <Typography variant="bodyMedium" style={styles.waitingSubtext}>
          They'll join you in this game soon
        </Typography>
        <SquishyButton onPress={() => setGameState('playing')} style={styles.startAnywayButton}>
          <Typography variant="bodyMedium" color={COLORS.gradientStart}>
            Start Anyway
          </Typography>
        </SquishyButton>
      </View>
    );
  }

  // Ready to start
  if (gameState === 'ready') {
    return (
      <View style={styles.container}>
        <Typography variant="displaySmall" style={styles.readyTitle}>
          Ready to Play?
        </Typography>
        <Typography variant="bodyLarge" style={styles.readyText}>
          Your session is set up and ready to go!
        </Typography>
        {enableMultiplayer && coupleId && (
          <View style={styles.partnerStatus}>
            <View style={[styles.statusDot, partnerOnline && styles.statusDotOnline]} />
            <Typography variant="bodyMedium" style={styles.partnerStatusText}>
              Partner {partnerOnline ? 'online' : 'offline'}
            </Typography>
          </View>
        )}
        <SquishyButton onPress={handleStart} style={styles.startButton}>
          <Typography variant="headerMedium" color={COLORS.textPrimary}>
            Start Game
          </Typography>
        </SquishyButton>
        <SquishyButton onPress={onExit} style={styles.exitButton}>
          <Typography variant="headerSmall" color={COLORS.textSecondary}>
            Exit
          </Typography>
        </SquishyButton>
      </View>
    );
  }

  // Game completed
  if (gameState === 'completed') {
    return (
      <View style={styles.container}>
        <Typography variant="displaySmall" style={styles.completedTitle}>
          🎉 Game Complete!
        </Typography>
        <Typography variant="displayLarge" color={COLORS.gradientStart} style={styles.completedScore}>
          Score: {localScore}
        </Typography>
        {achievements.length > 0 && (
          <View style={styles.achievements}>
            <Typography variant="headerMedium" style={styles.achievementsTitle}>
              Achievements:
            </Typography>
            {achievements.map((achievement, index) => (
              <Typography key={index} variant="bodyLarge" color={COLORS.creativeChaos} style={styles.achievement}>
                🏆 {achievement}
              </Typography>
            ))}
          </View>
        )}
        <SquishyButton onPress={onExit} style={styles.doneButton}>
          <Typography variant="headerMedium" color={COLORS.textPrimary}>
            Done
          </Typography>
        </SquishyButton>
      </View>
    );
  }

  // Render game component with props
  if (!session) {
    return (
      <View style={styles.container}>
        <Typography variant="bodyLarge" style={styles.errorText}>
          Session not available
        </Typography>
        <SquishyButton onPress={handleRetry} style={styles.retryButton}>
          <Typography variant="headerSmall" color={COLORS.textPrimary}>
            Retry
          </Typography>
        </SquishyButton>
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      {isSyncing && (
        <View style={styles.syncIndicator}>
          <ActivityIndicator size="small" color={COLORS.textPrimary} />
        </View>
      )}
      {children({
        session,
        gameState,
        score: localScore,
        partnerProgress,
        partnerOnline,
        onSubmitAnswer: handleSubmitAnswer,
        onUpdateScore: handleUpdateScore,
        onComplete: handleComplete,
        onPause: handlePause,
        onResume: handleResume,
        onExit: handleExit,
        sendPartnerUpdate,
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepCosmic,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.large,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: COLORS.deepCosmic,
  },
  loadingText: {
    marginTop: SPACING.regular,
  },
  errorTitle: {
    marginBottom: SPACING.medium,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
    opacity: 0.8,
  },
  retryButton: {
    paddingHorizontal: SPACING.xxlarge,
    paddingVertical: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  exitButton: {
    paddingHorizontal: SPACING.xxlarge,
    paddingVertical: SPACING.medium,
  },
  waitingText: {
    marginTop: SPACING.regular,
  },
  waitingSubtext: {
    marginTop: SPACING.small,
    opacity: 0.7,
  },
  startAnywayButton: {
    marginTop: SPACING.xlarge,
    paddingHorizontal: SPACING.xlarge,
    paddingVertical: SPACING.medium,
    borderWidth: 1,
    borderColor: COLORS.gradientStart,
    borderRadius: BORDER_RADIUS.medium,
  },
  readyTitle: {
    marginBottom: SPACING.medium,
  },
  readyText: {
    textAlign: 'center',
    marginBottom: SPACING.xlarge,
    opacity: 0.8,
  },
  partnerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xlarge,
  },
  statusDot: {
    width: SPACING.small,
    height: SPACING.small,
    borderRadius: BORDER_RADIUS.small / 2,
    backgroundColor: COLORS.error,
    marginRight: SPACING.small,
  },
  statusDotOnline: {
    backgroundColor: COLORS.success,
  },
  partnerStatusText: {
    opacity: 0.8,
  },
  startButton: {
    paddingHorizontal: SPACING.xxxlarge,
    paddingVertical: SPACING.regular,
    marginBottom: SPACING.medium,
  },
  completedTitle: {
    marginBottom: SPACING.regular,
  },
  completedScore: {
    marginBottom: SPACING.xlarge,
  },
  achievements: {
    alignItems: 'center',
    marginBottom: SPACING.xxlarge,
  },
  achievementsTitle: {
    marginBottom: SPACING.medium,
  },
  achievement: {
    marginBottom: SPACING.tiny,
  },
  doneButton: {
    paddingHorizontal: SPACING.xxxlarge,
    paddingVertical: SPACING.regular,
  },
  syncIndicator: {
    position: 'absolute',
    top: SPACING.small,
    right: SPACING.small,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.tiny,
  },
});

export default GameWrapper;
