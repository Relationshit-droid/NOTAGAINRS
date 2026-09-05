/**
 * useGameSession Hook
 * 
 * A reusable hook for integrating games with the backend API.
 * Handles session creation, score updates, completion tracking, and real-time sync.
 * 
 * Usage in any game screen:
 * const { 
 *   session, 
 *   updateScore, 
 *   completeGame, 
 *   submitAnswer,
 *   isLoading, 
 *   isSyncing,
 *   error,
 *   partnerProgress 
 * } = useGameSession('game-id', 'category-id');
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { gamesApi, GameSession, GameAnswer } from '../lib/api';
import { auth } from '../lib/firebaseClient';
import { Alert } from 'react-native';

interface UseGameSessionReturn {
  /** The current game session from backend */
  session: GameSession | null;
  /** Whether the session is being created */
  isLoading: boolean;
  /** Whether a score update is in progress */
  isSyncing: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Partner's progress in the game (for multiplayer) */
  partnerProgress: any | null;
  /** Update the game score */
  updateScore: (score: number, responses?: any[]) => Promise<void>;
  /** Submit an answer for a specific question */
  submitAnswer: (questionId: string, answer: any, metadata?: Record<string, any>) => Promise<GameAnswer | null>;
  /** Mark the game as completed */
  completeGame: (finalScore: number, responses?: any[], achievements?: string[]) => Promise<void>;
  /** Reset the game session */
  resetSession: () => Promise<void>;
  /** Refresh session data from server */
  refreshSession: () => Promise<void>;
}

export function useGameSession(
  gameId: string,
  categoryId: string,
  coupleId?: string
): UseGameSessionReturn {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [partnerProgress, setPartnerProgress] = useState<any | null>(null);
  
  // Use ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Create game session on mount
  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('User not authenticated');
        }

        const token = await currentUser.getIdToken();
        const newSession = await gamesApi.createSession(
          currentUser.uid,
          gameId,
          categoryId,
          token,
          coupleId
        );

        if (isMounted.current) {
          setSession(newSession);
          console.log(`[useGameSession] Created session: ${newSession.id}`);
        }
      } catch (err) {
        console.error('[useGameSession] Failed to create session:', err);
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error('Failed to create game session'));
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    createSession();
  }, [gameId, categoryId, coupleId]);

  // Update score function
  const updateScore = useCallback(async (score: number, responses?: any[]) => {
    if (!session) {
      console.warn('[useGameSession] Cannot update score: no session');
      return;
    }

    setIsSyncing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const updated = await gamesApi.updateSession(
        session.id,
        { score, completed: false, responses },
        token
      );

      if (isMounted.current) {
        setSession(updated);
        if (updated.partner_progress) {
          setPartnerProgress(updated.partner_progress);
        }
      }
    } catch (err) {
      console.error('[useGameSession] Failed to update score:', err);
    } finally {
      if (isMounted.current) {
        setIsSyncing(false);
      }
    }
  }, [session]);

  // Submit answer function
  const submitAnswer = useCallback(async (
    questionId: string,
    answer: any,
    metadata?: Record<string, any>
  ): Promise<GameAnswer | null> => {
    if (!session) {
      console.warn('[useGameSession] Cannot submit answer: no session');
      return null;
    }

    setIsSyncing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;

      const token = await currentUser.getIdToken();
      const answerRecord = await gamesApi.submitAnswer(
        session.id,
        {
          user_id: currentUser.uid,
          question_id: questionId,
          answer,
          timestamp: new Date().toISOString(),
          metadata
        },
        token
      );

      if (isMounted.current) {
        // Refresh session to get updated score
        const updated = await gamesApi.getSession(session.id, token);
        setSession(updated);
        if (updated.partner_progress) {
          setPartnerProgress(updated.partner_progress);
        }
      }

      return answerRecord;
    } catch (err) {
      console.error('[useGameSession] Failed to submit answer:', err);
      return null;
    } finally {
      if (isMounted.current) {
        setIsSyncing(false);
      }
    }
  }, [session]);

  // Complete game function
  const completeGame = useCallback(async (
    finalScore: number,
    responses?: any[],
    achievements?: string[]
  ) => {
    if (!session) {
      console.warn('[useGameSession] Cannot complete game: no session');
      return;
    }

    setIsSyncing(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const updated = await gamesApi.completeSession(
        session.id,
        {
          final_score: finalScore,
          responses,
          game_state: session.game_state,
          achievements
        },
        token
      );

      if (isMounted.current) {
        setSession(updated);
        console.log(`[useGameSession] Game completed with score: ${finalScore}`);
      }
    } catch (err) {
      console.error('[useGameSession] Failed to complete game:', err);
      Alert.alert('Error', 'Failed to save game results. Please try again.');
    } finally {
      if (isMounted.current) {
        setIsSyncing(false);
      }
    }
  }, [session]);

  // Reset session
  const resetSession = useCallback(async () => {
    setSession(null);
    setError(null);
    setPartnerProgress(null);
    
    // Create new session
    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const newSession = await gamesApi.createSession(
        currentUser.uid,
        gameId,
        categoryId,
        token,
        coupleId
      );

      if (isMounted.current) {
        setSession(newSession);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Failed to reset session'));
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [gameId, categoryId, coupleId]);

  // Refresh session from server
  const refreshSession = useCallback(async () => {
    if (!session) return;

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const token = await currentUser.getIdToken();
      const updated = await gamesApi.getSession(session.id, token);

      if (isMounted.current) {
        setSession(updated);
        if (updated.partner_progress) {
          setPartnerProgress(updated.partner_progress);
        }
      }
    } catch (err) {
      console.error('[useGameSession] Failed to refresh session:', err);
    }
  }, [session]);

  return {
    session,
    isLoading,
    isSyncing,
    error,
    partnerProgress,
    updateScore,
    submitAnswer,
    completeGame,
    resetSession,
    refreshSession,
  };
}

export default useGameSession;
