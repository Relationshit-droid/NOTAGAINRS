/**
 * GameConnector - Backend Integration Component for All Games
 * 
 * This component wraps game screens and provides:
 * - Automatic game session creation in backend
 * - Score tracking and submission
 * - Real-time sync via WebSocket
 * - Loading and error states
 * 
 * Usage:
 * <GameConnector
 *   gameId="six-second-kiss"
 *   categoryId="romance-hub"
 *   onComplete={(score) => navigation.navigate('Results', { score })}
 * >
 *   {(session, updateScore) => <YourGameComponent session={session} onScore={updateScore} />}
 * </GameConnector>
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gamesApi, GameSession } from '../../lib/api';
import { auth } from '../../lib/firebaseClient';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { Typography, SquishyButton } from '../ui';

interface GameConnectorProps {
  gameId: string;
  categoryId: string;
  children: (
    session: GameSession | null,
    updateScore: (score: number, completed?: boolean, responses?: any[]) => void,
    isSyncing: boolean
  ) => React.ReactNode;
  onComplete?: (finalScore: number, session: GameSession) => void;
  onError?: (error: Error) => void;
}

interface GameState {
  score: number;
  completed: boolean;
  responses: any[];
}

export const GameConnector: React.FC<GameConnectorProps> = ({
  gameId,
  categoryId,
  children,
  onComplete,
  onError,
}) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Create game session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          throw new Error('User not authenticated');
        }

        const token = await currentUser.getIdToken();
        
        // Create game session in backend
        const newSession = await gamesApi.createSession(
          currentUser.uid,
          gameId,
          categoryId,
          token
        );
        
        setSession(newSession);
        console.log(`[GameConnector] Session created: ${newSession.id}`);
      } catch (err) {
        console.error('[GameConnector] Failed to create session:', err);
        setError(err instanceof Error ? err : new Error('Failed to create game session'));
        onError?.(err instanceof Error ? err : new Error('Failed to create game session'));
      } finally {
        setLoading(false);
      }
    };

    createSession();
  }, [gameId, categoryId, onError]);

  // Update score function
  const updateScore = useCallback(async (
    score: number,
    completed: boolean = false,
    responses: any[] = []
  ) => {
    if (!session) return;

    setIsSyncing(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      
      const updatedSession = await gamesApi.updateSession(
        session.id,
        { score, completed, responses },
        token
      );
      
      setSession(updatedSession);
      
      // If game completed, call onComplete callback
      if (completed && onComplete) {
        onComplete(score, updatedSession);
      }
    } catch (err) {
      console.error('[GameConnector] Failed to update score:', err);
      Alert.alert(
        'Sync Error',
        'Failed to save your progress. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
    }
  }, [session, onComplete]);

  // Platform-safe reload function
  const handleReload = () => {
    if (Platform.OS === 'web') {
      // On web, use window.location.reload()
      window.location.reload();
    } else {
      // On mobile, reset error state to retry session creation
      setError(null);
      setLoading(true);
      
      // Retry creating the session
      const retrySession = async () => {
        try {
          const currentUser = auth.currentUser;
          
          if (!currentUser) {
            throw new Error('User not authenticated');
          }

          const token = await currentUser.getIdToken();
          
          const newSession = await gamesApi.createSession(
            currentUser.uid,
            gameId,
            categoryId,
            token
          );
          
          setSession(newSession);
          console.log(`[GameConnector] Session created on retry: ${newSession.id}`);
        } catch (err) {
          console.error('[GameConnector] Failed to create session on retry:', err);
          setError(err instanceof Error ? err : new Error('Failed to create game session'));
          onError?.(err instanceof Error ? err : new Error('Failed to create game session'));
        } finally {
          setLoading(false);
        }
      };

      retrySession();
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background}>
          <ActivityIndicator size="large" color={COLORS.vibrantPink} />
          <Typography variant="body" center style={styles.loadingText}>
            Preparing your game...
          </Typography>
        </LinearGradient>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.backgroundPrimary, COLORS.backgroundSecondary]} style={styles.background}>
          <Typography variant="h2" center color={COLORS.error}>
            Failed to load game
          </Typography>
          <Typography variant="body" center color={COLORS.textSecondary} style={styles.errorSubtext}>
            {error.message}
          </Typography>
          <SquishyButton
            onPress={handleReload}
            accessibilityLabel="Try Again"
          >
            <Typography variant="button" color={COLORS.textPrimary}>
              Try Again
            </Typography>
          </SquishyButton>
        </LinearGradient>
      </View>
    );
  }

  // Render game with session and update function
  return (
    <View style={styles.container}>
      {children(session, updateScore, isSyncing)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.screenPadding,
  },
  loadingText: {
    marginTop: SPACING.large,
  },
  errorSubtext: {
    marginBottom: SPACING.large,
  },
});

export default GameConnector;
